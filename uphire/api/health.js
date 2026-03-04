/**
 * Health check endpoint for monitoring and load balancers
 * GET /api/health - returns 200 with status
 */
export async function handler(_event) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0",
    }),
  };
}
