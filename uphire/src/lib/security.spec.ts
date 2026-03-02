import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeSearch,
  sanitizeEmail,
  sanitizeName,
  sanitizePhone,
  sanitizeCommaList,
  sanitizeId,
  MAX_LENGTHS,
} from "./security";

describe("security", () => {
  describe("sanitizeString", () => {
    it("strips HTML tags", () => {
      expect(sanitizeString("<script>alert(1)</script>")).toBe("alert(1)");
      expect(sanitizeString("<b>bold</b>")).toBe("bold");
    });
    it("removes javascript: protocol", () => {
      expect(sanitizeString("javascript:void(0)")).toBe("void(0)");
    });
    it("removes event handlers", () => {
      expect(sanitizeString('x onclick="evil()"')).not.toContain("onclick");
    });
    it("enforces max length", () => {
      expect(sanitizeString("a".repeat(1000), 50)).toHaveLength(50);
    });
  });

  describe("sanitizeSearch", () => {
    it("removes injection chars", () => {
      expect(sanitizeSearch("test'; DROP TABLE")).not.toContain("'");
      expect(sanitizeSearch("<script>")).not.toContain("<");
    });
  });

  describe("sanitizeEmail", () => {
    it("returns valid email normalized", () => {
      expect(sanitizeEmail("test@example.com")).toBe("test@example.com");
      expect(sanitizeEmail("  Test@Example.COM  ")).toBe("test@example.com");
    });
    it("returns null for invalid email", () => {
      expect(sanitizeEmail("invalid")).toBeNull();
      expect(sanitizeEmail("@nodomain")).toBeNull();
      expect(sanitizeEmail("")).toBeNull();
    });
  });

  describe("sanitizeName", () => {
    it("strips digits and dangerous chars", () => {
      expect(sanitizeName("John123")).toBe("John");
      expect(sanitizeName("O'Brien")).toContain("Brien");
    });
  });

  describe("sanitizePhone", () => {
    it("keeps digits and common phone chars", () => {
      expect(sanitizePhone("+44 20 1234 5678")).toBe("+44 20 1234 5678");
      expect(sanitizePhone("(555) 123-4567")).toBe("(555) 123-4567");
    });
  });

  describe("sanitizeCommaList", () => {
    it("splits and sanitizes", () => {
      expect(sanitizeCommaList("a, b, c")).toEqual(["a", "b", "c"]);
    });
  });

  describe("sanitizeId", () => {
    it("accepts alphanumeric and hyphen", () => {
      expect(sanitizeId("role-123")).toBe("role-123");
    });
    it("rejects invalid chars", () => {
      expect(sanitizeId("role;123")).toBeNull();
    });
  });

  describe("MAX_LENGTHS", () => {
    it("exports expected keys", () => {
      expect(MAX_LENGTHS).toHaveProperty("email", 254);
      expect(MAX_LENGTHS).toHaveProperty("search", 200);
    });
  });
});
