/**
 * Pure utility functions for recruitment cost savings and ROI calculations.
 * Extracted for testability.
 */

export interface SavingsInput {
  totalSavings: number;
  avgCostPerHire: number;
  previousAvgCost: number;
  hiresCount?: number;
}

/** Cost reduction per hire (previous - current) */
export function computeCostReduction(previous: number, current: number): number {
  return Math.max(0, previous - current);
}

/** Efficiency gain as percentage: ((previous - current) / previous) * 100 */
export function computeEfficiencyGain(previous: number, current: number): number {
  if (previous <= 0) return 0;
  return Math.round(((previous - current) / previous) * 100);
}

/** ROI in Year 1: (totalSavings / (avgCostPerHire * hiresCount)) * 100 */
export function computeROIYear1(
  totalSavings: number,
  avgCostPerHire: number,
  hiresCount: number
): number {
  const totalCost = avgCostPerHire * hiresCount;
  if (totalCost <= 0) return 0;
  return Math.round((totalSavings / totalCost) * 100);
}

/** Payback period in months: (totalCost / monthlySavings) */
export function computePaybackMonths(
  totalCost: number,
  monthlySavings: number
): number {
  if (monthlySavings <= 0) return Infinity;
  return Math.round((totalCost / monthlySavings) * 10) / 10;
}

/** Projected annual savings from monthly average */
export function computeProjectedAnnualSavings(monthlySavings: number[]): number {
  if (monthlySavings.length === 0) return 0;
  const avg = monthlySavings.reduce((a, b) => a + b, 0) / monthlySavings.length;
  return Math.round(avg * 12);
}
