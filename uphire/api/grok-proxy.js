/**
 * Netlify serverless function: Grok API proxy for AI screening and market data.
 * Keeps GROK_API_KEY server-side only (never exposed to client).
 *
 * POST /api/grok-proxy
 * Body: { systemPrompt?, userPrompt, maxTokens?, temperature?, model? }
 *
 * Requires: GROK_API_KEY, GROK_API_URL (or GROK_API_KEY, GROK_API_URL) in Netlify env.
 * Do NOT use VITE_ prefix - these must be server-only.
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
    process.env.GROK_API_KEY ||
    process.env.VITE_GROK_API_KEY ||
    "";
  const apiUrl =
    process.env.GROK_API_URL ||
    process.env.VITE_GROK_API_URL ||
    "https://api.x.ai/v1";

  if (!apiKey || apiKey === "demo-key") {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Grok API key not configured" }),
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

  const { systemPrompt, userPrompt, maxTokens = 2000, temperature = 0.3, model = "grok-beta" } = body;
  if (!userPrompt) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing userPrompt" }),
    };
  }

  const url = apiUrl.includes("/chat/completions") ? apiUrl : `${apiUrl}/chat/completions`;
  const messages = systemPrompt
    ? [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]
    : [{ role: "user", content: userPrompt }];

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: data?.error?.message || "Grok API error" }),
      };
    }

    const content = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ content }),
    };
  } catch (err) {
    console.error("Grok proxy error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Grok API request failed" }),
    };
  }
}
