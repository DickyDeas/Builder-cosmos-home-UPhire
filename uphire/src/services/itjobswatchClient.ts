/**
 * ITJobsWatch client for UK IT salary data.
 * ITJobsWatch has no public API; we use /api/itjobswatch-proxy which
 * fetches and parses their pages server-side.
 * Data: https://www.itjobswatch.co.uk/jobs/uk/{skill}.do
 */

const PROXY = "/api/itjobswatch-proxy";

export interface ITJobsWatchSalary {
  min: number;
  max: number;
  median: number;
  percentile10?: number;
  percentile90?: number;
  sampleSize?: number;
}

/**
 * Map common role names to ITJobsWatch skill slugs.
 */
function toSkillSlug(role: string): string {
  const normalized = role.toLowerCase().trim();
  const mapping: Record<string, string> = {
    "react developer": "react",
    "senior react developer": "react",
    "react": "react",
    "product manager": "product manager",
    "ux designer": "user experience",
    "frontend developer": "front end development",
    "backend developer": "backend",
    "fullstack developer": "full stack development",
    "full stack developer": "full stack development",
    "data scientist": "data science",
    "devops engineer": "devops",
    "software engineer": "software engineering",
    "python developer": "python",
    "java developer": "java",
    "node developer": "node.js",
    "node.js developer": "node.js",
    "api developer": "api development",
    "bi developer": "business intelligence",
    "data engineer": "data engineering",
  };
  return mapping[normalized] ?? normalized.replace(/\s+/g, "%20");
}

/**
 * Fetch salary data from ITJobsWatch via proxy.
 */
export async function fetchITJobsWatchSalary(
  role: string
): Promise<ITJobsWatchSalary | null> {
  try {
    const skill = toSkillSlug(role);
    const res = await fetch(`${PROXY}?skill=${encodeURIComponent(skill)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.median) return null;
    return {
      min: data.percentile10 ?? data.min ?? Math.round(data.median * 0.65),
      max: data.percentile90 ?? data.max ?? Math.round(data.median * 1.5),
      median: data.median,
      percentile10: data.percentile10,
      percentile90: data.percentile90,
      sampleSize: data.sampleSize,
    };
  } catch (err) {
    console.warn("ITJobsWatch fetch error:", err);
    return null;
  }
}
