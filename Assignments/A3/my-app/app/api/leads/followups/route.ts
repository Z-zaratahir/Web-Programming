import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Lead from '@/lib/models/Lead';
import { getSession } from '@/lib/auth';

// GET /api/leads/followups - Get leads with follow-up reminders
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // 'overdue', 'upcoming', 'stale', 'all'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = {};

    if (session.role === 'agent') {
      query.assignedTo = session.userId;
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    if (type === 'overdue') {
      query.followUpDate = { $lt: now, $ne: null };
    } else if (type === 'upcoming') {
      query.followUpDate = { $gte: now, $lte: threeDaysFromNow };
    } else if (type === 'stale') {
      query.lastActivityAt = { $lt: sevenDaysAgo };
      query.status = { $nin: ['Closed Won', 'Closed Lost'] };
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ followUpDate: 1 })
      .lean();

    // Categorize
    const overdue = leads.filter(
      (l) => l.followUpDate && new Date(l.followUpDate) < now
    );
    const upcoming = leads.filter(
      (l) => l.followUpDate && new Date(l.followUpDate) >= now && new Date(l.followUpDate) <= threeDaysFromNow
    );
    const stale = leads.filter(
      (l) => new Date(l.lastActivityAt) < sevenDaysAgo && !['Closed Won', 'Closed Lost'].includes(l.status)
    );

    return NextResponse.json({
      leads,
      summary: {
        overdue: overdue.length,
        upcoming: upcoming.length,
        stale: stale.length,
      },
      categorized: { overdue, upcoming, stale },
    });
  } catch (error) {
    console.error('Followups error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
