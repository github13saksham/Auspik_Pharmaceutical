/**
 * Auspik Pharmaceuticals - Corporate Email Templates
 * Professional, modern, responsive email designs with embedded brand assets
 */

const LOGO_URL = 'https://auspikpharmaceuticals.com/Pharma_Company_logo.jpeg';
const WEBSITE_URL = 'https://auspikpharmaceuticals.com';
const ADMIN_PORTAL_URL = 'https://admin.auspikpharmaceuticals.com';

const HEADER_HTML = (titleBadge = 'Corporate Notification') => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f2744 0%, #173b6c 50%, #1e4b8a 100%); padding: 32px 24px 28px; text-align: center; border-top-left-radius: 14px; border-top-right-radius: 14px;">
    <tr>
      <td align="center">
        <!-- Logo Container with white glow and rounded frame -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 10px 18px; margin: 0 auto 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.18);">
          <tr>
            <td align="center">
              <img src="${LOGO_URL}" alt="Auspik Pharmaceuticals" width="168" style="display: block; width: 168px; max-width: 100%; height: auto; border: 0;" />
            </td>
          </tr>
        </table>
        <div style="display: inline-block; padding: 4px 14px; background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 20px; color: #cbd5e1; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
          ${titleBadge}
        </div>
      </td>
    </tr>
  </table>
`;

const FOOTER_HTML = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 26px 28px 22px; text-align: center; border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;">
    <tr>
      <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #475569; line-height: 1.6;">
        <strong style="color: #0f2744; font-size: 14px;">Auspik Pharmaceuticals Pvt. Ltd.</strong><br/>
        <span style="color: #64748b; font-size: 12px;">An ISO and GMP Pharmaceutical Company based in Karnal, Haryana</span><br/>
        <span style="color: #64748b; font-size: 12px;">Operational Facility: 167-B, Sector-3 HSIIDC Industrial Area, Karnal, Haryana - 132001</span>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-top: 14px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 0 10px;">
              <a href="${WEBSITE_URL}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 12px; font-weight: 600;">Website</a>
            </td>
            <td style="color: #cbd5e1; font-size: 12px;">•</td>
            <td style="padding: 0 10px;">
              <a href="mailto:support@auspikpharmaceuticals.com" style="color: #2563eb; text-decoration: none; font-size: 12px; font-weight: 600;">support@auspikpharmaceuticals.com</a>
            </td>
            <td style="color: #cbd5e1; font-size: 12px;">•</td>
            <td style="padding: 0 10px;">
              <a href="https://wa.me/919671240000" target="_blank" style="color: #16a34a; text-decoration: none; font-size: 12px; font-weight: 600;">+91 9671240000</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-top: 16px; font-size: 11px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        © ${new Date().getFullYear()} Auspik Pharmaceuticals Pvt. Ltd. All rights reserved.
      </td>
    </tr>
  </table>
`;

const WRAPPER = (content, titleBadge) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auspik Pharmaceuticals</title>
</head>
<body style="margin: 0; padding: 32px 12px; background-color: #eef2f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background: #ffffff; border-radius: 14px; box-shadow: 0 12px 36px -8px rgba(15, 39, 68, 0.16); border: 1px solid #e1e8f0; overflow: hidden;">
          <tr>
            <td>
              ${HEADER_HTML(titleBadge)}
              <div style="padding: 34px 32px 28px;">
                ${content}
              </div>
              ${FOOTER_HTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * 1. Admin Job Application Alert
 */
export const getAdminCareerApplicationHtml = ({ job, applicant, resumeName }) => {
  const content = `
    <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 24px;">
      <h1 style="margin: 0 0 6px; font-size: 22px; font-weight: 800; color: #0f2744; letter-spacing: -0.02em;">New Job Application Received</h1>
      <p style="margin: 0; font-size: 14.5px; color: #475569;">A new candidate has submitted their application through the careers portal.</p>
    </div>

    <!-- Job Designation Banner -->
    <div style="background: #f0f7ff; border: 1px solid #c7ddfc; border-left: 5px solid #2563eb; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em;">Applied Position</div>
      <div style="font-size: 18px; font-weight: 800; color: #0f2744; margin-top: 2px;">${job?.title || 'Open Position'}</div>
      <div style="font-size: 13px; color: #475569; margin-top: 2px;">Department: <strong>${job?.department || 'Operations'}</strong> &bull; Location: <strong>Karnal, Haryana</strong></div>
    </div>

    <!-- Candidate Profile Table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 22px;">
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569; width: 34%;">Applicant Name:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f2744;">${applicant?.fullName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Email Address:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #2563eb;">
          <a href="mailto:${applicant?.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${applicant?.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Phone Number:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f2744; font-weight: 600;">
          <a href="tel:${applicant?.phone}" style="color: #0f2744; text-decoration: none;">${applicant?.phone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Relevant Experience:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f2744;">${applicant?.experience || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Current Location:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f2744;">${applicant?.currentLocation || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Resume / CV:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 13.5px; color: #059669; font-weight: 600;">
          ${resumeName ? `Attached (${resumeName})` : 'No file attached'}
        </td>
      </tr>
    </table>

    ${applicant?.coverNote ? `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 18px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Candidate Note / Message:</div>
        <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${applicant.coverNote}</p>
      </div>
    ` : ''}

    <!-- Call to action button for admin -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px;">
      <tr>
        <td align="center">
          <a href="${ADMIN_PORTAL_URL}" target="_blank" style="display: inline-block; padding: 12px 28px; background: #1e4b8a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 12px rgba(30, 75, 138, 0.3);">
            Open Admin Management Portal &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  return WRAPPER(content, 'HR & Recruitment Alert');
};

/**
 * 2. Applicant Confirmation Email
 */
export const getCandidateConfirmationHtml = ({ job, applicant }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-flex; width: 52px; height: 52px; background: #dcfce7; border-radius: 50%; line-height: 52px; text-align: center; color: #16a34a; font-size: 26px; font-weight: bold; margin-bottom: 14px;">
        ✓
      </div>
      <h1 style="margin: 0 0 6px; font-size: 22px; font-weight: 800; color: #0f2744; letter-spacing: -0.02em;">Application Received</h1>
      <p style="margin: 0; font-size: 15px; color: #475569;">Thank you for your interest in joining Auspik Pharmaceuticals.</p>
    </div>

    <p style="font-size: 15px; color: #1e293b; line-height: 1.6; margin: 0 0 16px;">
      Dear <strong>${applicant?.fullName}</strong>,
    </p>

    <p style="font-size: 14.5px; color: #334155; line-height: 1.65; margin: 0 0 18px;">
      We have successfully received your job application and submitted credentials for the position of <strong>${job?.title || 'Open Role'}</strong>.
    </p>

    <!-- Role Summary Box -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Application Summary</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #334155;">
        <tr>
          <td style="padding: 4px 0; color: #64748b; width: 35%;">Applied Position:</td>
          <td style="padding: 4px 0; font-weight: 700; color: #0f2744;">${job?.title || 'Position'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Department:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #0f2744;">${job?.department || 'Pharmaceutical Operations'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Facility Location:</td>
          <td style="padding: 4px 0; color: #0f2744;">HSIIDC, Sector-3, Karnal, Haryana</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Contact Registered:</td>
          <td style="padding: 4px 0; color: #0f2744;">${applicant?.phone} &bull; ${applicant?.email}</td>
        </tr>
      </table>
    </div>

    <!-- Next steps section -->
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 6px; padding: 16px 18px; margin-bottom: 22px;">
      <div style="font-size: 13.5px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">What Happens Next?</div>
      <p style="margin: 0; font-size: 13.5px; color: #334155; line-height: 1.6;">
        Our Human Resources and Technical Screening committee evaluates each candidate's background against our quality and technical standards. If your qualifications match the role requirements, our talent acquisition team will contact you directly to schedule an interview.
      </p>
    </div>

    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px;">
      If you have questions regarding your application, you may reply directly to this email or write to us at <a href="mailto:support@auspikpharmaceuticals.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">support@auspikpharmaceuticals.com</a>.
    </p>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px;">
      <p style="margin: 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
        Sincerely,<br/>
        <strong style="color: #0f2744; font-size: 14px;">Talent Acquisition & Human Resources</strong><br/>
        Auspik Pharmaceuticals Pvt. Ltd.
      </p>
    </div>
  `;

  return WRAPPER(content, 'Application Acknowledgment');
};

/**
 * 3. Admin Product / Contact Inquiry Alert
 */
export const getAdminInquiryAlertHtml = ({ name, email, phone, type: inquiryType, product, message }) => {
  const content = `
    <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 24px;">
      <h1 style="margin: 0 0 6px; font-size: 22px; font-weight: 800; color: #0f2744; letter-spacing: -0.02em;">New Inquiry Received</h1>
      <p style="margin: 0; font-size: 14.5px; color: #475569;">A prospective client or distributor has submitted a new inquiry via the website.</p>
    </div>

    <!-- Inquiry Type Highlight -->
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px;">
      <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em;">Inquiry Segment</div>
      <div style="font-size: 17px; font-weight: 800; color: #0f2744; margin-top: 2px;">${inquiryType || 'General Product Inquiry'}</div>
      ${product ? `<div style="font-size: 13.5px; color: #166534; margin-top: 4px;">Target Formulation: <strong>${product}</strong></div>` : ''}
    </div>

    <!-- Client Profile Table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 22px;">
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569; width: 34%;">Client Name:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f2744;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Email Address:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #2563eb;">
          <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Phone / WhatsApp:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f2744; font-weight: 600;">
          <a href="tel:${phone}" style="color: #0f2744; text-decoration: none;">${phone}</a>
        </td>
      </tr>
      ${product ? `
      <tr>
        <td style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #475569;">Requested Product:</td>
        <td style="padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #2563eb;">${product}</td>
      </tr>
      ` : ''}
    </table>

    <!-- Message Box -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 18px; margin-bottom: 24px;">
      <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Message / Requirement Details:</div>
      <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${message || 'No additional details provided.'}</p>
    </div>

    <!-- Quick Actions -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 6px;">
                <a href="${ADMIN_PORTAL_URL}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #1e4b8a; color: #ffffff; text-decoration: none; font-size: 13.5px; font-weight: 700; border-radius: 8px;">
                  Open Admin Portal &rarr;
                </a>
              </td>
              <td style="padding: 0 6px;">
                <a href="https://wa.me/${String(phone).replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; padding: 12px 20px; background: #16a34a; color: #ffffff; text-decoration: none; font-size: 13.5px; font-weight: 700; border-radius: 8px;">
                  Chat on WhatsApp &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return WRAPPER(content, 'Commercial & Sales Alert');
};

/**
 * 4. Customer Confirmation Email
 */
export const getCustomerInquiryConfirmationHtml = ({ name, email, phone, product, message }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-flex; width: 52px; height: 52px; background: #eff6ff; border-radius: 50%; line-height: 52px; text-align: center; color: #2563eb; font-size: 26px; font-weight: bold; margin-bottom: 14px;">
        ✓
      </div>
      <h1 style="margin: 0 0 6px; font-size: 22px; font-weight: 800; color: #0f2744; letter-spacing: -0.02em;">Thank You for Reaching Out</h1>
      <p style="margin: 0; font-size: 15px; color: #475569;">We have received your pharmaceutical inquiry.</p>
    </div>

    <p style="font-size: 15px; color: #1e293b; line-height: 1.6; margin: 0 0 16px;">
      Dear <strong>${name}</strong>,
    </p>

    <p style="font-size: 14.5px; color: #334155; line-height: 1.65; margin: 0 0 18px;">
      Thank you for connecting with <strong>Auspik Pharmaceuticals</strong>. Our commercial and institutional distribution team has received your inquiry${product ? ` regarding <strong>${product}</strong>` : ''} and is preparing the requested details.
    </p>

    <!-- Inquiry Summary Box -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Inquiry Summary</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #334155;">
        ${product ? `
        <tr>
          <td style="padding: 4px 0; color: #64748b; width: 35%;">Formulation / Product:</td>
          <td style="padding: 4px 0; font-weight: 700; color: #2563eb;">${product}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 4px 0; color: #64748b; width: 35%;">Registered Contact:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #0f2744;">${phone} &bull; ${email}</td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 6px 0 2px; color: #64748b; vertical-align: top;">Your Specification:</td>
          <td style="padding: 6px 0 2px; color: #1e293b; line-height: 1.5;">${message}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Assurance box -->
    <div style="background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 6px; padding: 16px 18px; margin-bottom: 22px;">
      <div style="font-size: 13.5px; font-weight: 700; color: #166534; margin-bottom: 4px;">What to Expect Next</div>
      <p style="margin: 0; font-size: 13.5px; color: #334155; line-height: 1.6;">
        A dedicated commercial sales representative will get in touch with you within <strong>24 business hours</strong> to assist with formulation specifications, packaging options, and institutional pricing quotes.
      </p>
    </div>

    <!-- Direct Helpline -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px;">
      <div style="font-size: 12.5px; font-weight: 700; color: #0f2744; margin-bottom: 4px;">Need Immediate Institutional Supply Assistance?</div>
      <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
        Call our Karnal operational desk directly at <strong>+91 9671240000</strong> / <strong>+91 8222844644</strong> or reply directly to this email at <a href="mailto:support@auspikpharmaceuticals.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">support@auspikpharmaceuticals.com</a>.
      </p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px;">
      <p style="margin: 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
        Warm regards,<br/>
        <strong style="color: #0f2744; font-size: 14px;">Commercial Sales & Institutional Supply Desk</strong><br/>
        Auspik Pharmaceuticals Pvt. Ltd.
      </p>
    </div>
  `;

  return WRAPPER(content, 'Inquiry Acknowledgment');
};
