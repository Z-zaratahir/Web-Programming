import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Lead from '@/lib/models/Lead';
import User from '@/lib/models/User';
import { getSession } from '@/lib/auth';

// GET /api/analytics - Admin analytics data
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    // Total leads
    const totalLeads = await Lead.countDocuments();

    // Status distribution
    const statusDistribution = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Priority distribution
    const priorityDistribution = await Lead.aggregate([
      { $group: { _id: '$score', count: { $sum: 1 } } },
    ]);

    // Agent performance
    const agents = await User.find({ role: 'agent' }).select('-password').lean();
    const agentPerformance = await Promise.all(
      agents.map(async (agent) => {
        const totalAssigned = await Lead.countDocuments({ assignedTo: agent._id });
        const closedWon = await Lead.countDocuments({ assignedTo: agent._id, status: 'Closed Won' });
        const closedLost = await Lead.countDocuments({ assignedTo: agent._id, status: 'Closed Lost' });
        const inProgress = await Lead.countDocuments({
          assignedTo: agent._id,
          status: { $nin: ['Closed Won', 'Closed Lost', 'New'] },
        });
        const statusBreakdown = await Lead.aggregate([
          { $match: { assignedTo: agent._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        return {
          agentId: agent._id,
          agentName: agent.name,
          agentEmail: agent.email,
          totalAssigned,
          closedWon,
          closedLost,
          inProgress,
          conversionRate: totalAssigned > 0 ? Math.round((closedWon / totalAssigned) * 100) : 0,
          statusBreakdown,
        };
      })
    );

    // Leads created over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const leadsOverTime = await Lead.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Overdue follow-ups count
    const overdueFollowUps = await Lead.countDocuments({
      followUpDate: { $lt: new Date(), $ne: null },
    });

    // Stale leads count (no activity for 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const staleLeads = await Lead.countDocuments({
      lastActivityAt: { $lt: sevenDaysAgo },
    });

    // Unassigned leads
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });

    return NextResponse.json({
      totalLeads,
      statusDistribution,
      priorityDistribution,
      agentPerformance,
      leadsOverTime,
      overdueFollowUps,
      staleLeads,
      unassignedLeads,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
