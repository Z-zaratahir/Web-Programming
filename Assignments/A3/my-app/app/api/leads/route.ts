import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Lead from '@/lib/models/Lead';
import Activity from '@/lib/models/Activity';
import Notification from '@/lib/models/Notification';
import User from '@/lib/models/User';
import { getSession } from '@/lib/auth';
import { sendNewLeadEmail } from '@/lib/email';
import { validateBody } from '@/lib/middleware';

// GET /api/leads - Get all leads (Admin) or assigned leads (Agent)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const assignedTo = searchParams.get('assignedTo');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const followUpOverdue = searchParams.get('followUpOverdue');
    const stale = searchParams.get('stale');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // Agent can only see assigned leads
    if (session.role === 'agent') {
      query.assignedTo = session.userId;
    }

    // Filters
    if (status) query.status = status;
    if (priority) query.score = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { propertyInterest: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Follow-up overdue filter
    if (followUpOverdue === 'true') {
      query.followUpDate = { $lt: new Date(), $ne: null };
    }

    // Stale leads filter (no activity for 7 days)
    if (stale === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query.lastActivityAt = { $lt: sevenDaysAgo };
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ leads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const validate = validateBody([
      { field: 'name', required: true, type: 'string', minLength: 2 },
      { field: 'email', required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
      { field: 'phone', required: true, type: 'string', minLength: 5 },
      { field: 'propertyInterest', required: true, type: 'string' },
      { field: 'budget', required: true, type: 'number' },
    ]);

    const errors = await validate(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    await connectDB();

    const lead = await Lead.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      propertyInterest: body.propertyInterest,
      budget: body.budget,
      status: 'New',
      notes: body.notes || '',
      assignedTo: body.assignedTo || null,
      followUpDate: body.followUpDate || null,
    });

    // Create activity log
    await Activity.create({
      leadId: lead._id,
      action: 'lead_created',
      description: `Lead "${lead.name}" was created with ${lead.score} priority`,
      performedBy: session.userId,
      performedByName: session.name,
    });

    // Create notifications for all admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      userId: admin._id,
      type: 'lead_created' as const,
      title: 'New Lead Created',
      message: `${lead.name} - ${lead.propertyInterest} (${lead.score} Priority)`,
      leadId: lead._id,
    }));
    await Notification.insertMany(notifications);

    // Send email notification to admins
    for (const admin of admins) {
      await sendNewLeadEmail(lead.name, lead.email, admin.email);
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
