/**
 * Employees service - per-user persistence via Supabase with audit logging
 */

import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/services/auditService";
import type { Employee } from "@/pages/uphire/types";

export interface DbEmployee {
  id: string;
  profile_id: string;
  name: string;
  position?: string;
  department?: string;
  start_date?: string;
  salary?: string;
  manager?: string;
  employment_type?: string;
  probation_period?: boolean;
  probation_months?: number;
  employee_id?: string;
  email?: string;
  phone_number?: string;
  avatar?: string;
}

function dbEmployeeToEmployee(e: DbEmployee): Employee {
  const nameParts = e.name.split(" ");
  const avatar = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : e.name.slice(0, 2).toUpperCase();

  return {
    id: e.id,
    name: e.name,
    position: e.position || "",
    department: e.department || "",
    startDate: e.start_date || "",
    salary: e.salary || "",
    manager: e.manager || "",
    employmentType: e.employment_type || "Full-Time",
    probationPeriod: e.probation_period ?? false,
    probationMonths: e.probation_months ?? 6,
    employeeId: e.employee_id || "",
    documents: [],
    email: e.email,
    phoneNumber: e.phone_number,
    avatar,
  };
}

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employee_details")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching employees:", error);
    return [];
  }

  return (data || []).map((e) => dbEmployeeToEmployee(e as DbEmployee));
}

export async function insertEmployee(emp: Partial<Employee>): Promise<Employee | null> {
  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;
  if (!profileId) return null;

  const insertPayload = {
    profile_id: profileId,
    name: emp.name || "",
    position: emp.position || null,
    department: emp.department || null,
    start_date: emp.startDate || null,
    salary: emp.salary || null,
    manager: emp.manager || null,
    employment_type: emp.employmentType || "Full-Time",
    probation_period: emp.probationPeriod ?? false,
    probation_months: emp.probationMonths ?? 6,
    employee_id: emp.employeeId || null,
    email: emp.email || null,
    phone_number: emp.phoneNumber || null,
  };

  const { data, error } = await supabase
    .from("employee_details")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting employee:", error);
    return null;
  }

  const created = dbEmployeeToEmployee(data as DbEmployee);
  logAudit({
    userId: profileId,
    action: "employee_create",
    resourceType: "employee",
    resourceId: created.id,
    metadata: { name: created.name },
  });
  return created;
}

export async function updateEmployee(id: string, emp: Partial<Employee>): Promise<boolean> {
  const { error } = await supabase
    .from("employee_details")
    .update({
      name: emp.name,
      position: emp.position,
      department: emp.department,
      start_date: emp.startDate,
      salary: emp.salary,
      manager: emp.manager,
      employment_type: emp.employmentType,
      probation_period: emp.probationPeriod,
      probation_months: emp.probationMonths,
      email: emp.email,
      phone_number: emp.phoneNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating employee:", error);
    return false;
  }

  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;
  if (profileId) {
    logAudit({
      userId: profileId,
      action: "employee_update",
      resourceType: "employee",
      resourceId: id,
      metadata: { name: emp.name },
    });
  }
  return true;
}
