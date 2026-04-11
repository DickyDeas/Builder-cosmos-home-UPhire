/**
 * Rate limiting for serverless APIs using Upstash Redis.
 * Gracefully skips if UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set.
 */

let ratelimit = null;

async function getRatelimit() {
  if (ratelimit) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');
    ratelimit = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: false,
    });
    return ratelimit;
  } catch (err) {
    console.warn('Rate limit init failed:', err.message);
    return null;
  }
}

/**
 * Check rate limit for identifier (e.g. IP). Returns { limited: boolean, remaining?: number }.
 */
export async function checkRateLimit(identifier) {
  const rl = await getRatelimit();
  if (!rl) return { limited: false };
  try {
    const { success, remaining } = await rl.limit(identifier);
    return { limited: !success, remaining };
  } catch (err) {
    console.warn('Rate limit check failed:', err.message);
    return { limited: false };
  }
}
