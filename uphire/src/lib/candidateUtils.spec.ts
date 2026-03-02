import { describe, it, expect } from "vitest";
import {
  filterCandidatesByStatus,
  sortCandidatesByName,
  sortCandidatesByApplied,
} from "./candidateUtils";

const mockCandidates = [
  { id: 1, name: "Alice", status: "Applied", applied: "2024-01-15" },
  { id: 2, name: "Bob", status: "Shortlisted", applied: "2024-01-10" },
  { id: 3, name: "Charlie", status: "Applied", applied: "2024-01-20" },
];

describe("candidateUtils", () => {
  describe("filterCandidatesByStatus", () => {
    it("returns all when status is All", () => {
      expect(filterCandidatesByStatus(mockCandidates, "All")).toHaveLength(3);
    });
    it("returns all when status is empty", () => {
      expect(filterCandidatesByStatus(mockCandidates, "")).toHaveLength(3);
    });
    it("filters by status", () => {
      const result = filterCandidatesByStatus(mockCandidates, "Applied");
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.status === "Applied")).toBe(true);
    });
    it("returns empty for non-matching status", () => {
      expect(filterCandidatesByStatus(mockCandidates, "Hired")).toHaveLength(0);
    });
  });

  describe("sortCandidatesByName", () => {
    it("sorts A–Z", () => {
      const sorted = sortCandidatesByName(mockCandidates);
      expect(sorted.map((c) => c.name)).toEqual(["Alice", "Bob", "Charlie"]);
    });
  });

  describe("sortCandidatesByApplied", () => {
    it("sorts newest first", () => {
      const sorted = sortCandidatesByApplied(mockCandidates);
      expect(sorted[0].name).toBe("Charlie");
      expect(sorted[2].name).toBe("Bob");
    });
  });
});
