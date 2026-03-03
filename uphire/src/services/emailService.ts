/**
 * Email service - Brevo (Sendinblue) integration.
 * Uses /api/email-send proxy so API key stays server-side.
 */

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  replyTo?: string;
}

/**
 * Send transactional email via server-side Brevo proxy.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const res = await fetch("/api/email-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        htmlContent: options.htmlContent,
        textContent: options.textContent,
        replyTo: options.replyTo,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Email API error:", res.status, data);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

/**
 * Send welcome email after signup.
 */
export async function sendWelcomeEmail(to: string, name?: string): Promise<boolean> {
  const displayName = name || to.split("@")[0];
  return sendEmail({
    to,
    subject: "Welcome to UPhire",
    htmlContent: `
      <h2>Welcome to UPhire, ${displayName}!</h2>
      <p>Your account has been created. Log in to start managing your recruitment pipeline.</p>
      <p>Best regards,<br/>The UPhire Team</p>
    `,
  });
}

/**
 * Send message to candidate (recruiter outreach).
 */
export async function sendCandidateMessage(
  to: string,
  candidateName: string,
  message: string,
  roleTitle?: string
): Promise<boolean> {
  const subject = roleTitle ? `Re: ${roleTitle} opportunity` : "Message from UPhire";
  return sendEmail({
    to,
    subject,
    htmlContent: `
      <p>Hi ${candidateName},</p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
      <p>Best regards,<br/>The UPhire Team</p>
    `,
  });
}

/**
 * Send job offer email to candidate.
 */
export async function sendOfferEmail(
  to: string,
  candidateName: string,
  roleTitle: string,
  companyName?: string,
  salaryRange?: string
): Promise<boolean> {
  const company = companyName || "our company";
  const salary = salaryRange ? `<p><strong>Salary:</strong> ${salaryRange}</p>` : "";
  return sendEmail({
    to,
    subject: `Job Offer – ${roleTitle} at ${company}`,
    htmlContent: `
      <h2>Congratulations, ${candidateName}!</h2>
      <p>We are pleased to extend an offer for the position of <strong>${roleTitle}</strong> at ${company}.</p>
      ${salary}
      <p>Please review the attached offer letter for full details. We look forward to welcoming you to the team.</p>
      <p>Best regards,<br/>The UPhire Team</p>
    `,
  });
}
