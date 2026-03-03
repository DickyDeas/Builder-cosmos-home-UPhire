/**
 * Netlify serverless function: Brevo email proxy.
 * Keeps EMAIL_SERVICE_API_KEY server-side only (never exposed to client).
 *
 * POST /api/email-send
 * Body: { to: string | string[], subject, htmlContent?, textContent?, replyTo? }
 *
 * Requires: EMAIL_SERVICE_API_KEY, EMAIL_SERVICE_URL, FROM_EMAIL in Netlify env.
 * Do NOT use VITE_ prefix for API key - must be server-only.
 */

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey =
    process.env.EMAIL_SERVICE_API_KEY ||
    process.env.VITE_EMAIL_SERVICE_API_KEY ||
    "";
  const apiUrl =
    process.env.EMAIL_SERVICE_URL ||
    process.env.VITE_EMAIL_SERVICE_URL ||
    "https://api.brevo.com/v3";
  const fromEmail =
    process.env.FROM_EMAIL ||
    process.env.VITE_FROM_EMAIL ||
    "noreply@uphireiq.com";

  if (!apiKey) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Email service not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { to, subject, htmlContent, textContent, replyTo } = body;
  if (!to || !subject) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing to or subject" }),
    };
  }

  const toList = Array.isArray(to) ? to : [to];
  const recipients = toList.map((email) => ({ email }));

  try {
    const res = await fetch(`${apiUrl}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: "UPhire" },
        to: recipients,
        subject,
        htmlContent: htmlContent || textContent || "",
        textContent: textContent || undefined,
        replyTo: replyTo ? { email: replyTo } : undefined,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Brevo API error:", res.status, errText);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Email send failed" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Email send error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Email request failed" }),
    };
  }
}
