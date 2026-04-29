import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Lead from '@/lib/models/Lead';
import { getSession } from '@/lib/auth';
import * as XLSX from 'xlsx';

// GET /api/leads/export?format=excel|pdf
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'excel';

    const leads = await Lead.find({}).populate('assignedTo', 'name email').lean();

    const data = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      'Property Interest': lead.propertyInterest,
      Budget: lead.budget,
      Status: lead.status,
      Priority: lead.score,
      'Assigned To': (lead.assignedTo as { name?: string })?.name || 'Unassigned',
      'Follow-up Date': lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not set',
      'Created At': new Date(lead.createdAt).toLocaleDateString(),
    }));

    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 25 },
        { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 },
        { wch: 15 }, { wch: 15 },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }

    // PDF export - return JSON data for client-side PDF generation
    return NextResponse.json({ data, format: 'pdf' });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
