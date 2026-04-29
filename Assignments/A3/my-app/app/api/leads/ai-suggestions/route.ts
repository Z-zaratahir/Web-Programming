import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// POST /api/leads/ai-suggestions - AI-based follow-up suggestions (Bonus)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { leadName, status, score, budget, propertyInterest, daysSinceLastActivity, notes } = body;

    // Rule-based AI suggestions (simulating AI behavior)
    const suggestions: string[] = [];

    // Based on priority
    if (score === 'High') {
      suggestions.push('🔥 High-priority lead! Schedule a personal meeting within 24 hours.');
      suggestions.push('Prepare a premium property portfolio matching their budget range.');
      suggestions.push('Consider offering an exclusive property viewing experience.');
    } else if (score === 'Medium') {
      suggestions.push('📞 Follow up with a phone call within 48 hours.');
      suggestions.push('Send a curated list of properties matching their interest.');
    } else {
      suggestions.push('📧 Send an introductory email with market insights.');
      suggestions.push('Add to nurture campaign for periodic updates.');
    }

    // Based on status
    if (status === 'New') {
      suggestions.push('Make initial contact within 2 hours for best conversion.');
      suggestions.push('Research the lead\'s background before reaching out.');
    } else if (status === 'Contacted') {
      suggestions.push('Schedule a follow-up within 3 days to maintain momentum.');
      suggestions.push('Prepare answers to common questions about properties of interest.');
    } else if (status === 'Qualified') {
      suggestions.push('Arrange property viewings for their top choices.');
      suggestions.push('Prepare a detailed comparison of shortlisted properties.');
    } else if (status === 'Proposal') {
      suggestions.push('Follow up on the proposal within 2 days.');
      suggestions.push('Be ready to negotiate and have alternative options prepared.');
    } else if (status === 'Negotiation') {
      suggestions.push('Stay responsive - respond to queries within 1 hour.');
      suggestions.push('Consider offering flexible payment terms to close the deal.');
    }

    // Based on inactivity
    if (daysSinceLastActivity > 14) {
      suggestions.push('⚠️ Lead has been inactive for over 2 weeks. Send a re-engagement message.');
      suggestions.push('Consider offering a limited-time incentive to reignite interest.');
    } else if (daysSinceLastActivity > 7) {
      suggestions.push('📌 Lead going cold. Schedule a check-in call this week.');
    }

    // Based on budget
    if (budget > 50000000) {
      suggestions.push('💎 Ultra-premium client. Consider VIP treatment with dedicated viewings.');
    }

    // Based on property interest
    if (propertyInterest) {
      suggestions.push(`Prepare latest listings for "${propertyInterest}" category.`);
    }

    // Based on notes
    if (notes && notes.length > 0) {
      suggestions.push('Review previous notes before next contact to show personalized attention.');
    }

    return NextResponse.json({
      leadName,
      suggestions: suggestions.slice(0, 5), // Return top 5 suggestions
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
