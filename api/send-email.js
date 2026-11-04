import {
  getAdminCareerApplicationHtml,
  getCandidateConfirmationHtml,
  getAdminInquiryAlertHtml,
  getCustomerInquiryConfirmationHtml
} from './email-templates.js';

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'Auspik Pharmaceuticals <noreply@auspikpharmaceuticals.com>';
  const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'support@auspikpharmaceuticals.com';
  // Send admin alerts to both the company support mailbox and backup Gmail
  const ADMIN_RECIPIENTS = Array.from(new Set([ADMIN_EMAIL, 'auspikpharma@gmail.com'])).filter(Boolean);
  const SUPPORT_REPLY_TO = 'support@auspikpharmaceuticals.com';

  const { type, data } = req.body || {};

  try {
    if (type === 'career_application') {
      const { job, applicant, resumeName, resumeDataUrl } = data;

      // 1. Send Alert to Admin using branded template
      const adminHtml = getAdminCareerApplicationHtml({ job, applicant, resumeName });

      const attachments = [];
      if (resumeDataUrl && resumeName) {
        const base64Data = resumeDataUrl.includes('base64,') ? resumeDataUrl.split('base64,')[1] : resumeDataUrl;
        attachments.push({
          filename: resumeName,
          content: base64Data
        });
      }

      // Admin email request
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: ADMIN_RECIPIENTS,
          reply_to: applicant?.email,
          subject: `[Job Application] ${job?.title} - ${applicant?.fullName}`,
          html: adminHtml,
          attachments: attachments.length > 0 ? attachments : undefined
        })
      });

      if (!adminRes.ok) {
        const errJson = await adminRes.json().catch(() => ({}));
        console.warn('Admin application email alert warning:', errJson);
      }

      // 2. Send Confirmation to Applicant using branded template
      const userHtml = getCandidateConfirmationHtml({ job, applicant });

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: SENDER_EMAIL,
            to: [applicant?.email],
            reply_to: SUPPORT_REPLY_TO,
            subject: `Application Received: ${job?.title} - Auspik Pharmaceuticals`,
            html: userHtml
          })
        });
      } catch (err) {
        console.warn('Applicant confirmation email notice:', err.message);
      }

      return res.status(200).json({ success: true, message: 'Application emails processed' });
    }

    if (type === 'inquiry') {
      const { name, email, phone, type: inquiryType, product, message } = data;

      // 1. Send Alert to Admin using branded template
      const adminHtml = getAdminInquiryAlertHtml({ name, email, phone, type: inquiryType, product, message });

      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: ADMIN_RECIPIENTS,
          reply_to: email,
          subject: `[Inquiry Alert] ${product ? `${product} - ` : ''}${name}`,
          html: adminHtml
        })
      });

      if (!adminRes.ok) {
        const errJson = await adminRes.json().catch(() => ({}));
        console.warn('Admin inquiry email alert warning:', errJson);
      }

      // 2. Send Confirmation to Customer using branded template
      const customerHtml = getCustomerInquiryConfirmationHtml({ name, email, phone, product, message });

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: SENDER_EMAIL,
            to: [email],
            reply_to: SUPPORT_REPLY_TO,
            subject: `We have received your inquiry - Auspik Pharmaceuticals`,
            html: customerHtml
          })
        });
      } catch (err) {
        console.warn('Customer confirmation email notice:', err.message);
      }

      return res.status(200).json({ success: true, message: 'Inquiry emails processed' });
    }

    return res.status(400).json({ error: 'Invalid notification type' });
  } catch (error) {
    console.error('Error dispatching emails via Resend:', error);
    return res.status(500).json({ error: error.message || 'Failed to dispatch email' });
  }
}
