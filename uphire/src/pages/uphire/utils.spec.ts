import { describe, it, expect } from "vitest";
import {
  computeAIMatchScore,
  normalizeSalaryInput,
  formatCurrency,
  getInterviewStageLabel,
} from "./utils";

describe("uphire utils", () => {
  describe("computeAIMatchScore", () => {
    it("returns high score when skills match", () => {
      const candidate = { skills: ["React", "TypeScript"], experience: "5 years" };
      const role = { keySkills: ["React", "TypeScript"], requirements: ["frontend"] };
      expect(computeAIMatchScore(candidate, role)).toBeGreaterThan(80);
    });
    it("returns lower score when skills mismatch", () => {
      const candidate = { skills: ["Java"], experience: "1 year" };
      const role = { keySkills: ["React", "TypeScript"], experienceLevel: "5" };
      expect(computeAIMatchScore(candidate, role)).toBeLessThan(80);
    });
    it("handles empty role skills", () => {
      const candidate = { skills: ["React"] };
      const role = { keySkills: [], requirements: [] };
      const score = computeAIMatchScore(candidate, role);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("normalizeSalaryInput", () => {
    it("expands k suffix", () => {
      expect(normalizeSalaryInput("50k")).toBe("£50,000");
    });
    it("parses range", () => {
      expect(normalizeSalaryInput("30000 - 40000")).toBe("£30,000 - £40,000");
    });
  });

  describe("formatCurrency", () => {
    it("formats number", () => {
      expect(formatCurrency(2340)).toBe("£2,340");
    });
  });

  describe("getInterviewStageLabel", () => {
    it("returns label for known stage", () => {
      expect(getInterviewStageLabel("shortlisted")).toBe("Shortlisted");
    });
    it("returns stage for unknown", () => {
      expect(getInterviewStageLabel("unknown")).toBe("unknown");
    });
  });
});
