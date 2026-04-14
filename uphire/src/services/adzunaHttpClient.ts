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
  salary_min?: number;
  salary_max?: number;
  location?: { display_name?: string };
  company?: { display_name?: string };
}

export interface AdzunaSearchResult {
  results?: AdzunaJob[];
  count?: number;
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
): Promise<{ min: number; max: number; median: number; count: number } | null> {
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

    return { min, max, median, count: salaries.length };
  } catch (err) {
    console.error("Adzuna search error:", err);
    return null;
  }
}
