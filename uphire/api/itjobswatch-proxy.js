/**
 * Netlify serverless function: ITJobsWatch proxy for Market Intelligence
 * GET /api/itjobswatch-proxy?skill=react
 * Fetches and parses ITJobsWatch UK salary pages (no API key required)
 */

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const params = event.queryStringParameters || {};
  const skill = params.skill || "software engineering";
  const slug = encodeURIComponent(skill.replace(/\s+/g, "%20"));
  const fetchUrl = `https://www.itjobswatch.co.uk/jobs/uk/${slug}.do`;

  try {
    const res = await fetch(fetchUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; UPhire/1.0)" },
    });
    const html = await res.text();

    const medianMatch =
      html.match(/Median annual salary[^£]*£([0-9,]+)/i) ??
      html.match(/50th Percentile[^£]*£([0-9,]+)/i);
    const p10Match = html.match(/10th Percentile[^£]*£([0-9,]+)/i);
    const p90Match = html.match(/90th Percentile[^£]*£([0-9,]+)/i);

    const median = medianMatch
      ? parseInt(medianMatch[1].replace(/,/g, ""), 10)
      : null;
    const p10 = p10Match
      ? parseInt(p10Match[1].replace(/,/g, ""), 10)
      : null;
    const p90 = p90Match
      ? parseInt(p90Match[1].replace(/,/g, ""), 10)
      : null;

    if (!median) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "No salary data found" }),
      };
    }

    const body = {
      median,
      percentile10: p10 ?? Math.round(median * 0.65),
      percentile90: p90 ?? Math.round(median * 1.5),
      min: p10 ?? Math.round(median * 0.65),
      max: p90 ?? Math.round(median * 1.5),
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.error("ITJobsWatch fetch error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "ITJobsWatch fetch failed" }),
    };
  }
}
