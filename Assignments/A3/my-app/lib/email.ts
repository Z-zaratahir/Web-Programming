import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('[Email] Skipping - no EMAIL_USER configured');
      console.log('[Email] Would send to:', options.to);
      console.log('[Email] Subject:', options.subject);
      return;
    }
    await transporter.sendMail({
      from: `"PropCRM" <${process.env.EMAIL_USER}>`,
      ...options,
    });
    console.log('[Email] Sent to:', options.to);
  } catch (error) {
    console.error('[Email] Failed to send:', error);
  }
}

export async function sendNewLeadEmail(leadName: string, leadEmail: string, adminEmail: string) {
  await sendEmail({
    to: adminEmail,
    subject: `🏠 New Lead Created: ${leadName}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 32px; text-align: center;">
          <h1 style="color: #00E5CC; margin: 0; font-size: 24px;">PropCRM</h1>
          <p style="color: #888; margin: 8px 0 0;">New Lead Alert</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111; margin: 0 0 16px;">New Lead Created</h2>
          <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${leadName}</p>
            <p style="margin: 0;"><strong>Email:</strong> ${leadEmail}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">Log in to your dashboard to view full details and assign this lead.</p>
        </div>
      </div>
    `,
  });
}

export async function sendLeadAssignedEmail(
  agentEmail: string,
  agentName: string,
  leadName: string,
  leadEmail: string,
  propertyInterest: string
) {
  await sendEmail({
    to: agentEmail,
    subject: `📋 New Lead Assigned: ${leadName}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 32px; text-align: center;">
          <h1 style="color: #00E5CC; margin: 0; font-size: 24px;">PropCRM</h1>
          <p style="color: #888; margin: 8px 0 0;">Lead Assignment</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111; margin: 0 0 8px;">Hi ${agentName},</h2>
          <p style="color: #666; margin: 0 0 20px;">A new lead has been assigned to you.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px;"><strong>Lead Name:</strong> ${leadName}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${leadEmail}</p>
            <p style="margin: 0;"><strong>Property Interest:</strong> ${propertyInterest}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">Please review and follow up with this lead at your earliest convenience.</p>
        </div>
      </div>
    `,
  });
}
