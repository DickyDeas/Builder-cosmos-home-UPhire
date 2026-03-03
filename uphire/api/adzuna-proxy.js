/**
 * Netlify serverless function: Adzuna API proxy for Market Intelligence
 * GET /api/adzuna-proxy?what=React+Developer&where=UK&results_per_page=50
 * Requires: VITE_ADZUNA_APP_ID, VITE_ADZUNA_APP_KEY (or ADZUNA_APP_ID, ADZUNA_APP_KEY) in Netlify env
 */

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const appId =
    process.env.ADZUNA_APP_ID || process.env.VITE_ADZUNA_APP_ID || "";
  const appKey =
    process.env.ADZUNA_APP_KEY || process.env.VITE_ADZUNA_APP_KEY || "";

  if (!appId || !appKey) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Adzuna API keys not configured" }),
    };
  }

  const params = event.queryStringParameters || {};
  const searchParams = new URLSearchParams(params);
  searchParams.set("app_id", appId);
  searchParams.set("app_key", appKey);

  const target = `https://api.adzuna.com/v1/api/jobs/gb/search/1?${searchParams.toString()}`;

  try {
    const res = await fetch(target);
    const data = await res.json();
    return {
      statusCode: res.ok ? 200 : res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Adzuna fetch error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Adzuna fetch failed" }),
    };
  }
}
