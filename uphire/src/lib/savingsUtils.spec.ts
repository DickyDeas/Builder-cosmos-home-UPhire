import { describe, it, expect } from "vitest";
import {
  computeCostReduction,
  computeEfficiencyGain,
  computeROIYear1,
  computePaybackMonths,
  computeProjectedAnnualSavings,
} from "./savingsUtils";

describe("savingsUtils", () => {
  describe("computeCostReduction", () => {
    it("returns previous minus current", () => {
      expect(computeCostReduction(4200, 2340)).toBe(1860);
    });
    it("returns 0 when current >= previous", () => {
      expect(computeCostReduction(2000, 2500)).toBe(0);
    });
  });

  describe("computeEfficiencyGain", () => {
    it("computes percentage correctly", () => {
      expect(computeEfficiencyGain(4200, 2340)).toBe(44);
    });
    it("returns 0 when previous is 0", () => {
      expect(computeEfficiencyGain(0, 100)).toBe(0);
    });
  });

  describe("computeROIYear1", () => {
    it("computes ROI from savings and cost", () => {
      expect(computeROIYear1(247500, 2340, 100)).toBe(106);
    });
  });

  describe("computePaybackMonths", () => {
    it("computes payback period", () => {
      expect(computePaybackMonths(10000, 2000)).toBe(5);
    });
  });

  describe("computeProjectedAnnualSavings", () => {
    it("averages monthly and multiplies by 12", () => {
      const monthly = [15000, 18500, 22000];
      expect(computeProjectedAnnualSavings(monthly)).toBe(222000);
    });
    it("returns 0 for empty array", () => {
      expect(computeProjectedAnnualSavings([])).toBe(0);
    });
  });
});
