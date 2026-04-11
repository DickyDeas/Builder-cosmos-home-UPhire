/**
 * Netlify serverless function: Groq API proxy for Market Intelligence
 * POST /api/grok-proxy
 *
 * Accepts JSON body with { messages: [ ... ] } to forward to Groq chat completion
 *
 * Requires GROK_API_KEY and optionally GROK_API_URL & GROK_MODEL in Netlify env
 */
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GROK_API_KEY || process.env.VITE_GROK_API_KEY;
  const apiUrl =
    process.env.GROK_API_URL || process.env.VITE_GROK_API_URL ||
    "https://api.groq.com/openai/v1/chat/completions";

  const model = process.env.GROK_MODEL || process.env.VITE_GROK_MODEL || "llama3-8b-8192";

  if (!apiKey) {
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Missing GROK_API_KEY" }),
    };
  }

  const body = JSON.parse(event.body || "{}");
  const messages = body.messages || [];
  const params = {
    model,
    messages,
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: text || "Groq API error" }),
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Groq proxy error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Groq fetch failed" }),
    };
  }
}
