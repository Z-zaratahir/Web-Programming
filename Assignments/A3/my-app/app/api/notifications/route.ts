import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getSession } from '@/lib/auth';

// GET /api/notifications - Get user notifications (polling endpoint)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const since = searchParams.get('since');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: session.userId };
    if (unreadOnly) query.read = false;
    if (since) query.createdAt = { $gt: new Date(since) };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: session.userId,
      read: false,
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await connectDB();

    if (body.markAllRead) {
      await Notification.updateMany(
        { userId: session.userId, read: false },
        { read: true }
      );
    } else if (body.notificationId) {
      await Notification.findOneAndUpdate(
        { _id: body.notificationId, userId: session.userId },
        { read: true }
      );
    }

    return NextResponse.json({ message: 'Notifications updated' });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
