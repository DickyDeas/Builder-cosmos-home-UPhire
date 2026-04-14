/**
 * Adzuna API client for UK job market data.
 * Uses /api/adzuna-proxy to avoid CORS (proxy adds app_id/app_key server-side).
 * Register at https://developer.adzuna.com/ for API keys.
 */

import { fetchWithTimeout } from "@/lib/apiClient";

const PROXY = "/api/adzuna-proxy";
const TIMEOUT_MS = 12000;
const MIN_REASONABLE_UK_ANNUAL_SALARY = 15000;
const MAX_REASONABLE_UK_ANNUAL_SALARY = 250000;

export interface AdzunaJob {
  id: string;
  title: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  location?: { display_name?: string };
  company?: { display_name?: string };
}

export interface AdzunaSearchResult {
  results?: AdzunaJob[];
  count?: number;
}

const SKILL_ALIASES: Record<string, RegExp[]> = {
  "Business Development": [/\bbusiness development\b/i, /\bnew business\b/i],
  Sales: [/\bsales\b/i, /\brevenue\b/i, /\bpipeline\b/i],
  "Client Management": [/\bclient management\b/i, /\baccount management\b/i],
  "KPI Management": [/\bkpi(s)?\b/i, /\btargets?\b/i],
  Recruitment: [/\brecruit(ment|er|ing)\b/i, /\bsourcing\b/i],
  Screening: [/\bscreening\b/i, /\bshortlist(ing)?\b/i],
  "Talent Acquisition": [/\btalent acquisition\b/i],
  "Financial Analysis": [/\bfinancial analysis\b/i],
  Budgeting: [/\bbudget(ing)?\b/i],
  Forecasting: [/\bforecast(ing)?\b/i],
  Accounting: [/\baccount(ing|ant)\b/i],
  Excel: [/\bexcel\b/i],
  Copywriting: [/\bcopywrit(ing|er)\b/i],
  "Content Strategy": [/\bcontent strategy\b/i],
  "SEO Writing": [/\bseo\b/i, /\bsearch engine optimisation\b/i],
  Editing: [/\bedit(ing|or)\b/i],
  CRM: [/\bcrm\b/i, /\bsalesforce\b/i, /\bhubspot\b/i],
  SQL: [/\bsql\b/i],
  Python: [/\bpython\b/i],
  "Data Analysis": [/\bdata analysis\b/i, /\banalytics\b/i],
  "Data Modeling": [/\bdata model(l)?ing\b/i],
  ETL: [/\betl\b/i, /\bdata pipeline\b/i],
  "Qlik Sense": [/\bqlik sense\b/i],
  QlikView: [/\bqlikview\b/i],
  "Power BI": [/\bpower ?bi\b/i],
  Tableau: [/\btableau\b/i],
  React: [/\breact\b/i],
  TypeScript: [/\btypescript\b/i],
  JavaScript: [/\bjavascript\b/i],
  "Node.js": [/\bnode(\.js)?\b/i],
  API: [/\bapi(s)?\b/i, /\brest\b/i],
  Testing: [/\btesting\b/i, /\bjest\b/i, /\bcypress\b/i],
  Git: [/\bgit\b/i],
  Docker: [/\bdocker\b/i],
  Kubernetes: [/\bkubernetes\b/i, /\bk8s\b/i],
  "CI/CD": [/\bci\/cd\b/i, /\bcontinuous integration\b/i],
  "Cloud Platforms": [/\baws\b/i, /\bazure\b/i, /\bgcp\b/i, /\bcloud\b/i],
  Communication: [/\bcommunication\b/i],
  "Problem Solving": [/\bproblem solving\b/i, /\btroubleshoot(ing)?\b/i],
  "Project Management": [/\bproject management\b/i],
  Leadership: [/\bleadership\b/i, /\bteam lead\b/i],
};

function extractTopSkillsFromJobs(jobs: AdzunaJob[], limit = 10): string[] {
  const score = new Map<string, number>();
  for (const job of jobs) {
    const text = `${job.title ?? ""} ${job.description ?? ""}`;
    for (const [skill, patterns] of Object.entries(SKILL_ALIASES)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          score.set(skill, (score.get(skill) ?? 0) + 1);
          break;
        }
      }
    }
  }
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([skill]) => skill);
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  const weight = idx - lower;
  return Math.round(sorted[lower] * (1 - weight) + sorted[upper] * weight);
}

/**
 * Search UK jobs via Adzuna to derive salary ranges.
 * Returns min/median/max from advertised salaries in results.
 */
export async function searchAdzunaJobs(
  role: string,
  location: string = "UK",
  resultsPerPage: number = 50
): Promise<{ min: number; max: number; median: number; count: number; topSkills: string[] } | null> {
  try {
    const params = new URLSearchParams({
      what: role,
      where: location,
      results_per_page: String(resultsPerPage),
    });
    const url = `${PROXY}?${params.toString()}`;
    const res = await fetchWithTimeout(url, {}, TIMEOUT_MS);
    if (!res.ok) {
      console.warn("Adzuna API error:", res.status, res.statusText);
      return null;
    }
    const data: AdzunaSearchResult = await res.json();
    const results = data?.results ?? [];
    const salaries = results
      .filter((j) => j.salary_min != null || j.salary_max != null)
      .map((j) => {
        const min = j.salary_min ?? 0;
        const max = j.salary_max ?? min;
        return Math.round((min + max) / 2);
      })
      .filter(
        (s) =>
          s >= MIN_REASONABLE_UK_ANNUAL_SALARY &&
          s <= MAX_REASONABLE_UK_ANNUAL_SALARY
      );

    if (salaries.length === 0) return null;

    salaries.sort((a, b) => a - b);
    // Use robust percentile bands instead of raw extremes
    // to avoid placeholder/outlier postings distorting min/max cards.
    const min = percentile(salaries, 0.1);
    const median = percentile(salaries, 0.5);
    const max = percentile(salaries, 0.9);

    return {
      min,
      max,
      median,
      count: salaries.length,
      topSkills: extractTopSkillsFromJobs(results),
    };
  } catch (err) {
    console.error("Adzuna search error:", err);
    return null;
  }
}
