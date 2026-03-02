/**
 * Pure utility functions for candidate filtering and sorting.
 * Extracted for testability.
 */

export interface CandidateLike {
  id: number;
  name: string;
  status: string;
  [key: string]: unknown;
}

/** Filter candidates by status. "All" returns all candidates. */
export function filterCandidatesByStatus<T extends CandidateLike>(
  candidates: T[],
  status: string
): T[] {
  if (!status || status === "All") return [...candidates];
  return candidates.filter((c) => c.status === status);
}

/** Sort candidates by name (A–Z) */
export function sortCandidatesByName<T extends { name: string }>(candidates: T[]): T[] {
  return [...candidates].sort((a, b) => a.name.localeCompare(b.name));
}

/** Sort candidates by applied date (newest first) */
export function sortCandidatesByApplied<T extends { applied?: string }>(candidates: T[]): T[] {
  return [...candidates].sort((a, b) => {
    const da = a.applied ? new Date(a.applied).getTime() : 0;
    const db = b.applied ? new Date(b.applied).getTime() : 0;
    return db - da;
  });
}
