import { describe, it, expect } from "vitest";
import { validateRoleForm } from "./roleUtils";

describe("roleUtils", () => {
  describe("validateRoleForm", () => {
    it("valid when title and department present", () => {
      const result = validateRoleForm({ title: "Engineer", department: "Tech" });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    it("invalid when title missing", () => {
      const result = validateRoleForm({ department: "Tech" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Job title is required");
    });
    it("invalid when department missing", () => {
      const result = validateRoleForm({ title: "Engineer" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Department is required");
    });
    it("invalid when both missing", () => {
      const result = validateRoleForm({});
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
