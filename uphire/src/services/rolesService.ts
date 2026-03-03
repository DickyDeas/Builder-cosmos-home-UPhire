/**
 * Roles service - per-user persistence via Supabase
 */

import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/services/auditService";
import type { Role } from "@/pages/uphire/types";

export interface DbRole {
  id: string;
  profile_id: string;
  tenant_id?: string;
  title: string;
  department?: string;
  location?: string;
  status?: string;
  salary?: string;
  priority?: string;
  description?: string;
  key_skills?: string[];
  requirements?: string[];
  benefits?: string[];
  experience_level?: string;
  employment_type?: string;
  work_pattern?: string;
  education_level?: string;
  created_at?: string;
}

function dbRoleToRole(r: DbRole, shortlistedCount = 0): Role {
  return {
    id: r.id,
    title: r.title,
    department: r.department || "",
    location: r.location || "",
    status: r.status || "Draft",
    candidates: 0,
    shortlisted: shortlistedCount,
    interviewed: 0,
    created: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
    salary: r.salary || "",
    priority: r.priority || "Medium",
    deiScore: 85,
    description: r.description,
    requirements: r.requirements || [],
    benefits: r.benefits || [],
    shortlistedCandidates: [],
    keySkills: r.key_skills || [],
    experienceLevel: r.experience_level,
    employmentType: r.employment_type,
    workPattern: r.work_pattern,
    educationLevel: r.education_level,
  };
}

export async function fetchRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }

  const roles = (data || []) as DbRole[];
  const result: Role[] = [];

  for (const r of roles) {
    const { count } = await supabase
      .from("shortlisted_candidates")
      .select("id", { count: "exact", head: true })
      .eq("role_id", r.id);
    result.push(dbRoleToRole(r, count || 0));
  }

  return result;
}

export async function insertRole(role: Partial<Role> & { tenantId?: string }): Promise<Role | null> {
  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;
  if (!profileId) return null;

  const insertPayload = {
    profile_id: profileId,
    tenant_id: role.tenantId || null,
    title: role.title || "",
    department: role.department || null,
    location: role.location || null,
    status: role.status || "Draft",
    salary: role.salary || null,
    priority: role.priority || "Medium",
    description: role.description || null,
    key_skills: role.keySkills || [],
    requirements: role.requirements || [],
    benefits: role.benefits || [],
    experience_level: role.experienceLevel || null,
    employment_type: role.employmentType || null,
    work_pattern: role.workPattern || null,
    education_level: role.educationLevel || null,
  };

  const { data, error } = await supabase
    .from("roles")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting role:", error);
    return null;
  }

  const created = data as DbRole;
  logAudit({
    tenantId: created.tenant_id || role.tenantId,
    userId: profileId,
    action: "role_create",
    resourceType: "role",
    resourceId: created.id,
    metadata: { title: created.title },
  });
  return dbRoleToRole(created);
}

export async function updateRole(id: string, role: Partial<Role>): Promise<boolean> {
  const updatePayload: Record<string, unknown> = {
    title: role.title,
    department: role.department,
    location: role.location,
    status: role.status,
    salary: role.salary,
    priority: role.priority,
    description: role.description,
    key_skills: role.keySkills,
    requirements: role.requirements,
    benefits: role.benefits,
    experience_level: role.experienceLevel,
    employment_type: role.employmentType,
    work_pattern: role.workPattern,
    education_level: role.educationLevel,
  };

  const { error } = await supabase.from("roles").update(updatePayload).eq("id", id);

  if (error) {
    console.error("Error updating role:", error);
    return false;
  }

  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;
  if (profileId) {
    logAudit({
      userId: profileId,
      action: "role_update",
      resourceType: "role",
      resourceId: id,
      metadata: { title: role.title },
    });
  }
  return true;
}
