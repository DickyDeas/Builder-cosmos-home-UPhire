/**
 * Adzuna API client for UK job market data.
 * Uses /api/adzuna-proxy to avoid CORS (proxy adds app_id/app_key server-side).
 * Register at https://developer.adzuna.com/ for API keys.
 */

const PROXY = "/api/adzuna-proxy";

export interface AdzunaJob {
  id: string;
  title: string;
  salary_min?: number;
  salary_max?: number;
  location?: { display_name?: string };
  company?: { display_name?: string };
}

export interface AdzunaSearchResult {
  results?: AdzunaJob[];
  count?: number;
}

/**
 * Search UK jobs via Adzuna to derive salary ranges.
 * Returns min/median/max from advertised salaries in results.
 */
export async function searchAdzunaJobs(
  role: string,
  location: string = "UK",
  resultsPerPage: number = 50
): Promise<{ min: number; max: number; median: number; count: number } | null> {
  try {
    const params = new URLSearchParams({
      what: role,
      where: location,
      results_per_page: String(resultsPerPage),
    });
    const url = `${PROXY}?${params.toString()}`;
    const res = await fetch(url);
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
      .filter((s) => s > 0);

    if (salaries.length === 0) return null;

    salaries.sort((a, b) => a - b);
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    const mid = Math.floor(salaries.length / 2);
    const median =
      salaries.length % 2 === 0
        ? Math.round((salaries[mid - 1] + salaries[mid]) / 2)
        : salaries[mid];

    return { min, max, median, count: salaries.length };
  } catch (err) {
    console.error("Adzuna search error:", err);
    return null;
  }
}
