import nodemailer from 'nodemailer';

// ─── Email Transporter Setup ──────────────────────────────────────────────────
// If SMTP is configured in .env, use it. Otherwise, use a preview/log-only mode.
let transporter = null;
let isEthereal = false;

const createTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS;
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : null;

  if (host && user && pass) {
    const isGmail = host.toLowerCase().includes("gmail") || user.toLowerCase().endsWith("@gmail.com");
    const transportConfig = isGmail
      ? {
          service: "gmail",
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 6000,
          socketTimeout: 10000,
        }
      : {
          host,
          port: parseInt(port) || 587,
          secure: parseInt(port) === 465,
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 6000,
          socketTimeout: 10000,
          tls: {
            rejectUnauthorized: false,
          },
        };

    transporter = nodemailer.createTransport(transportConfig);
    isEthereal = false;
    console.log("📧 Email service configured with real SMTP (Gmail mode:", isGmail, ") User:", user);
  } else {
    // Try creating an Ethereal test account for instant web preview
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEthereal = true;
      console.log("📧 Email service: created Ethereal test account (" + testAccount.user + ")");
    } catch (e) {
      // Fallback: log emails to console (offline dev mode)
      transporter = {
        sendMail: async (options) => {
          console.log("═══════════════════════════════════════════════════");
          console.log("📧 EMAIL (dev mode — no SMTP configured in .env)");
          console.log("To:", options.to);
          console.log("Subject:", options.subject);
          console.log("═══════════════════════════════════════════════════");
          return { messageId: "dev-" + Date.now() };
        },
      };
      isEthereal = false;
      console.log("📧 Email service running in DEV mode (console only)");
    }
  }

  return transporter;
};

// ─── HTTP-based Email Providers (Port 443 HTTPS — 100% works on Render Free) ───

// Send via Resend REST API (https://resend.com)
const sendViaResend = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from = process.env.RESEND_FROM || "HireHub <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend API: ${data.message || JSON.stringify(data)}`);
  }
  console.log(`📧 Email delivered via Resend API (HTTPS) to ${to}: ${data.id}`);
  return { provider: "resend", id: data.id };
};

// Send via Brevo REST API (https://brevo.com)
const sendViaBrevo = async (to, subject, html) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return null;

  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || "anand2005rathod@gmail.com";
  const senderName = "HireHub";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey.trim(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Brevo API: ${data.message || JSON.stringify(data)}`);
  }
  console.log(`📧 Email delivered via Brevo API (HTTPS) to ${to}: ${data.messageId}`);
  return { provider: "brevo", id: data.messageId };
};

// ─── Demo Redirect Configuration ───────────────────────────────────────────────
const DEMO_REDIRECT_TARGET = process.env.DEMO_REDIRECT_EMAIL ? process.env.DEMO_REDIRECT_EMAIL.trim() : "anand2005rathod@gmail.com";
const DEMO_EMAILS_TO_REDIRECT = [
  "anand@test.com",
  "recruiter@gmail.com",
  "demo.recruiter@hirehub.com",
];

export const isDemoEmail = (email) => {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  if (e === DEMO_REDIRECT_TARGET?.toLowerCase()) return false;
  return (
    DEMO_EMAILS_TO_REDIRECT.includes(e) ||
    e.endsWith("@test.com") ||
    e.endsWith("@hirehub.com") ||
    e.endsWith("@example.com") ||
    e.includes("demo.recruiter") ||
    e === "recruiter@gmail.com"
  );
};

// ─── Core Send Function ───────────────────────────────────────────────────────
const sendEmail = async (to, subject, html) => {
  // Check if recipient should be redirected to test target
  let recipient = to;
  let finalHtml = html;
  const isDemo = isDemoEmail(to);

  if (isDemo && DEMO_REDIRECT_TARGET) {
    recipient = DEMO_REDIRECT_TARGET;
    console.log(`🔀 [Redirect] Diverting email originally for "${to}" → "${recipient}"`);
    const demoBanner = `<div style="background:#e0f2fe;border:1px solid #bae6fd;color:#0369a1;padding:10px 14px;border-radius:8px;font-size:12px;margin:0 0 20px;font-family:sans-serif;">ℹ️ <strong>Demo Environment:</strong> This notification was generated for <code>${to}</code> and routed to your verified test inbox (<code>${recipient}</code>).</div>`;
    if (finalHtml.includes('<td style="padding:40px;">')) {
      finalHtml = finalHtml.replace('<td style="padding:40px;">', `<td style="padding:40px;">\n              ${demoBanner}`);
    }
  }

  // 1. Primary choice for Render / cloud: HTTP REST API (HTTPS port 443 — NEVER blocked by Render)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await sendViaResend(recipient, subject, finalHtml);
      return { success: true, provider: "Resend (HTTPS 443)", ...res };
    } catch (err) {
      console.error("Resend API attempt failed:", err.message);
    }
  }

  if (process.env.BREVO_API_KEY) {
    try {
      const res = await sendViaBrevo(recipient, subject, finalHtml);
      return { success: true, provider: "Brevo (HTTPS 443)", ...res };
    } catch (err) {
      console.error("Brevo API attempt failed:", err.message);
    }
  }

  // 2. Secondary choice: SMTP Transport (Works locally & on paid cloud instances)
  try {
    const transport = await createTransporter();
    const from = process.env.SMTP_FROM || `"HireHub" <${process.env.SMTP_USER || "noreply@hirehub.com"}>`;
    const info = await transport.sendMail({ from, to: recipient, subject, html: finalHtml });
    console.log(`📧 Email sent successfully via SMTP to ${recipient} (original: ${to}): "${subject}"`);
    if (isEthereal && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`🔗 Preview email live in browser: ${previewUrl}`);
      }
    }
    return { success: true, provider: "SMTP", messageId: info?.messageId };
  } catch (error) {
    const isRender = !!process.env.RENDER || !!process.env.RENDER_EXTERNAL_URL;
    const isTimeout = error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.message?.includes('timeout');
    
    console.error(`📧 Email send failed to ${recipient}:`, error.message);

    let diagnostic = error.message;
    if (isRender || isTimeout) {
      diagnostic = "Render Free blocks outbound SMTP ports (465 & 587). To send emails reliably on Render, add RESEND_API_KEY (free at resend.com) to your Render Environment Variables to send over HTTPS.";
      console.warn("⚠️ RENDER SMTP RESTRICTION DETECTED:", diagnostic);
    }

    return {
      success: false,
      error: diagnostic,
      isRenderPortBlock: isRender || isTimeout,
    };
  }
};

// ─── HTML Email Wrapper ───────────────────────────────────────────────────────
const wrapInTemplate = (content, preheader = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HireHub</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6A38C2 0%,#8B5CF6 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                Hire<span style="color:#F83002;">Hub</span>
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} HireHub. All rights reserved.
              </p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">
                You're receiving this because you have an account on HireHub.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Email Templates ──────────────────────────────────────────────────────────

/**
 * Welcome email sent on signup
 */
export const sendWelcomeEmail = async (user) => {
  const html = wrapInTemplate(`
    <h2 style="margin:0 0 16px;color:#1f2937;font-size:22px;">Welcome to HireHub! 🎉</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 16px;">
      Hi <strong>${user.fullname}</strong>,
    </p>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Your account has been created successfully as a <strong>${user.role === 'student' ? 'Job Seeker' : 'Recruiter'}</strong>.
      ${user.role === 'student'
        ? "Start exploring thousands of job opportunities from top companies and find your dream job!"
        : "Set up your company profile and start posting jobs to find the best talent!"
      }
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
         style="display:inline-block;background:linear-gradient(135deg,#6A38C2,#8B5CF6);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
        Get Started →
      </a>
    </div>
    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If you didn't create this account, you can safely ignore this email.
    </p>
  `, `Welcome to HireHub, ${user.fullname}!`);

  return sendEmail(user.email, "Welcome to HireHub! 🎉", html);
};

/**
 * Confirmation email sent to student after applying
 */
export const sendApplicationReceivedEmail = async (applicant, job, companyName) => {
  const html = wrapInTemplate(`
    <h2 style="margin:0 0 16px;color:#1f2937;font-size:22px;">Application Submitted ✅</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 16px;">
      Hi <strong>${applicant.fullname}</strong>,
    </p>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Your application for the position below has been successfully submitted!
    </p>
    <div style="background:#f3f0ff;border-left:4px solid #6A38C2;border-radius:8px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1f2937;">${job.title}</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:14px;">🏢 ${companyName}</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:14px;">📍 ${job.location}</p>
      <p style="margin:0;color:#6b7280;font-size:14px;">💼 ${job.jobType}</p>
    </div>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 8px;">
      The recruiter will review your application and you'll be notified of any status updates.
    </p>
    <p style="color:#9ca3af;font-size:13px;margin:16px 0 0;">
      Good luck! 🍀
    </p>
  `, `Application submitted for ${job.title}`);

  return sendEmail(applicant.email, `Application Submitted: ${job.title}`, html);
};

/**
 * Email sent to recruiter when someone applies to their job
 */
export const sendNewApplicantEmail = async (recruiterEmail, applicantName, job) => {
  const html = wrapInTemplate(`
    <h2 style="margin:0 0 16px;color:#1f2937;font-size:22px;">New Applicant Alert 🔔</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
      <strong>${applicantName}</strong> has applied for your job posting:
    </p>
    <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1f2937;">${job.title}</p>
      <p style="margin:0;color:#6b7280;font-size:14px;">📍 ${job.location} · 💼 ${job.jobType}</p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/jobs/${job._id}/applicants" 
         style="display:inline-block;background:linear-gradient(135deg,#6A38C2,#8B5CF6);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
        Review Applicant →
      </a>
    </div>
  `, `New applicant for ${job.title}`);

  return sendEmail(recruiterEmail, `New Applicant: ${applicantName} → ${job.title}`, html);
};

/**
 * Email sent to student when application status changes
 */
export const sendStatusUpdateEmail = async (applicant, job, companyName, newStatus) => {
  const isAccepted = newStatus === 'accepted';

  const statusBadge = isAccepted
    ? '<span style="display:inline-block;background:#dcfce7;color:#166534;padding:6px 16px;border-radius:20px;font-weight:600;font-size:14px;">✅ Accepted</span>'
    : '<span style="display:inline-block;background:#fef2f2;color:#991b1b;padding:6px 16px;border-radius:20px;font-weight:600;font-size:14px;">❌ Rejected</span>';

  const message = isAccepted
    ? "Congratulations! The recruiter was impressed with your profile and has accepted your application. You may hear from them soon regarding next steps."
    : "Unfortunately, the recruiter has decided to move forward with other candidates for this position. Don't be discouraged — keep applying and the right opportunity will come!";

  const html = wrapInTemplate(`
    <h2 style="margin:0 0 16px;color:#1f2937;font-size:22px;">
      Application Status Update
    </h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 16px;">
      Hi <strong>${applicant.fullname}</strong>,
    </p>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Your application status has been updated:
    </p>
    <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:0 0 24px;text-align:center;">
      <p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#1f2937;">${job.title}</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">🏢 ${companyName}</p>
      ${statusBadge}
    </div>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
      ${message}
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobs" 
         style="display:inline-block;background:linear-gradient(135deg,#6A38C2,#8B5CF6);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
        ${isAccepted ? "View Your Applications" : "Browse More Jobs"} →
      </a>
    </div>
  `, `Your application for ${job.title} has been ${newStatus}`);

  return sendEmail(
    applicant.email,
    `${isAccepted ? "🎉 " : ""}Application ${isAccepted ? "Accepted" : "Update"}: ${job.title}`,
    html
  );
};

/**
 * Send an immediate test notification to verify SMTP delivery
 */
export const sendTestEmail = async (to, name = "HireHub User") => {
  const html = wrapInTemplate(`
    <h2 style="margin:0 0 16px;color:#1f2937;font-size:22px;">
      Email Notification Test 🚀
    </h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 16px;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Great news! This test email confirms that your <strong>HireHub</strong> email delivery service is fully operational and configured with your real SMTP transport.
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:8px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#166534;">
        ✅ Real-Time Notifications Active
      </p>
      <ul style="margin:8px 0 0;padding-left:20px;color:#15803d;font-size:14px;line-height:1.7;">
        <li>Welcome emails upon registration</li>
        <li>Instant student application submission confirmations</li>
        <li>Instant recruiter alerts when candidates apply</li>
        <li>Application accepted/rejected status updates</li>
      </ul>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
         style="display:inline-block;background:linear-gradient(135deg,#6A38C2,#8B5CF6);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
        Open HireHub →
      </a>
    </div>
  `, "Test email notification from HireHub");

  return sendEmail(to, "HireHub: Email Notification Test ✅", html);
};

export default { sendWelcomeEmail, sendApplicationReceivedEmail, sendNewApplicantEmail, sendStatusUpdateEmail, sendTestEmail };
