/**
 * Pure utility functions for role creation and validation.
 * Extracted for testability.
 */

export interface RoleFormData {
  title?: string;
  department?: string;
  location?: string;
  salary?: string;
  [key: string]: unknown;
}

export interface RoleValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validate role form for create/edit. Title and department are required. */
export function validateRoleForm(data: RoleFormData): RoleValidationResult {
  const errors: string[] = [];
  const title = (data.title ?? "").trim();
  const department = (data.department ?? "").trim();

  if (!title) errors.push("Job title is required");
  if (!department) errors.push("Department is required");

  return {
    valid: errors.length === 0,
    errors,
  };
}
