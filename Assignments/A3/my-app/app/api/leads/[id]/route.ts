import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Lead from '@/lib/models/Lead';
import Activity from '@/lib/models/Activity';
import Notification from '@/lib/models/Notification';
import User from '@/lib/models/User';
import { getSession } from '@/lib/auth';
import { sendLeadAssignedEmail } from '@/lib/email';

// GET /api/leads/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id).populate('assignedTo', 'name email phone').lean();
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Agent can only see their assigned leads
    if (session.role === 'agent' && lead.assignedTo?._id?.toString() !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get activities for this lead
    const activities = await Activity.find({ leadId: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/leads/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const existingLead = await Lead.findById(id);
    if (!existingLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Agent can only update their assigned leads
    if (session.role === 'agent' && existingLead.assignedTo?.toString() !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Track changes for activity log
    const changes: Record<string, { old: string; new: string }> = {};
    const trackFields = ['name', 'email', 'phone', 'propertyInterest', 'budget', 'status', 'notes', 'followUpDate'];

    for (const field of trackFields) {
      if (body[field] !== undefined && String(body[field]) !== String(existingLead[field as keyof typeof existingLead])) {
        changes[field] = {
          old: String(existingLead[field as keyof typeof existingLead] || ''),
          new: String(body[field]),
        };
      }
    }

    // Handle assignment/reassignment
    const isReassignment = body.assignedTo !== undefined &&
      body.assignedTo !== (existingLead.assignedTo?.toString() || null);

    // Update the lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { ...body, lastActivityAt: new Date() },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email phone');

    if (!updatedLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Create activity logs
    if (Object.keys(changes).length > 0) {
      // Status change
      if (changes.status) {
        await Activity.create({
          leadId: id,
          action: 'status_changed',
          description: `Status changed from "${changes.status.old}" to "${changes.status.new}"`,
          performedBy: session.userId,
          performedByName: session.name,
          changes: { status: changes.status },
        });
      }

      // Notes update
      if (changes.notes) {
        await Activity.create({
          leadId: id,
          action: 'notes_updated',
          description: `Notes were updated`,
          performedBy: session.userId,
          performedByName: session.name,
          changes: { notes: changes.notes },
        });
      }

      // Follow-up date
      if (changes.followUpDate) {
        await Activity.create({
          leadId: id,
          action: 'followup_set',
          description: `Follow-up date set to ${new Date(changes.followUpDate.new).toLocaleDateString()}`,
          performedBy: session.userId,
          performedByName: session.name,
          changes: { followUpDate: changes.followUpDate },
        });
      }

      // General update (for other field changes)
      const otherChanges = { ...changes };
      delete otherChanges.status;
      delete otherChanges.notes;
      delete otherChanges.followUpDate;

      if (Object.keys(otherChanges).length > 0) {
        await Activity.create({
          leadId: id,
          action: 'lead_updated',
          description: `Lead details updated: ${Object.keys(otherChanges).join(', ')}`,
          performedBy: session.userId,
          performedByName: session.name,
          changes: otherChanges,
        });
      }
    }

    // Handle assignment notification
    if (isReassignment && body.assignedTo) {
      const previousAssignee = existingLead.assignedTo?.toString();
      const action = previousAssignee ? 'reassigned' : 'assigned';

      await Activity.create({
        leadId: id,
        action: action,
        description: `Lead ${action} to agent`,
        performedBy: session.userId,
        performedByName: session.name,
      });

      // Notify the assigned agent
      const agent = await User.findById(body.assignedTo);
      if (agent) {
        await Notification.create({
          userId: agent._id,
          type: action === 'reassigned' ? 'lead_reassigned' : 'lead_assigned',
          title: `Lead ${action === 'reassigned' ? 'Reassigned' : 'Assigned'} to You`,
          message: `"${updatedLead.name}" has been ${action} to you`,
          leadId: id,
        });

        // Send email
        await sendLeadAssignedEmail(
          agent.email,
          agent.name,
          updatedLead.name,
          updatedLead.email,
          updatedLead.propertyInterest
        );
      }
    }

    // Check if score changed
    if (existingLead.score !== updatedLead.score) {
      await Activity.create({
        leadId: id,
        action: 'score_changed',
        description: `Priority changed from ${existingLead.score} to ${updatedLead.score}`,
        performedBy: session.userId,
        performedByName: session.name,
        changes: { score: { old: existingLead.score, new: updatedLead.score } },
      });

      // Notify admins about priority change
      const admins = await User.find({ role: 'admin' });
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        type: 'priority_changed' as const,
        title: 'Lead Priority Changed',
        message: `"${updatedLead.name}" priority changed to ${updatedLead.score}`,
        leadId: updatedLead._id,
      }));
      await Notification.insertMany(notifications);
    }

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/leads/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    await Activity.create({
      leadId: id,
      action: 'lead_deleted',
      description: `Lead "${lead.name}" was deleted`,
      performedBy: session.userId,
      performedByName: session.name,
    });

    await Lead.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
