/**
 * Admin tab - view all client accounts (UPhire staff only)
 * Shows billing, usage, overspend, analytics when schema/APIs exist.
 */

import React, { useEffect, useState } from "react";
import { Building, Users, Briefcase, Loader2, AlertTriangle, CreditCard, TrendingUp, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { fetchAllTenantsForStaff, type AdminTenant } from "@/services/tenantsService";
import { fetchRolesNeedingAttention, type RoleNeedingAttention } from "@/services/roleFlagsService";

export const AdminTab = () => {
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [rolesNeedingAttention, setRolesNeedingAttention] = useState<RoleNeedingAttention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const [tenantData, roles] = await Promise.all([
        fetchAllTenantsForStaff(),
        fetchRolesNeedingAttention(5, token),
      ]);
      setTenants(tenantData);
      setRolesNeedingAttention(roles);
      setError(null);
    };
    load().catch(() => setError("Access denied or failed to load")).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 animate-spin text-slate-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <p className="text-amber-800 font-medium">{error}</p>
        <p className="text-sm text-amber-700 mt-2">
          This view is for UPhire staff only. Set UPHIRE_STAFF_EMAILS in Netlify env, or ensure your profile has staff access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">All Clients</h1>
        <p className="text-slate-200 mt-1">
          View all client accounts, billing, usage, and shortlist alerts (UPhire staff only)
        </p>
      </div>

      {/* Shortlist delay alerts */}
      {rolesNeedingAttention.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">
              Shortlist delays – {rolesNeedingAttention.length} role(s) with no applicants (5+ days)
            </h3>
          </div>
          <p className="text-sm text-amber-800 mb-3">
            Consider assigning outside resource to build shortlists for these roles.
          </p>
          <ul className="text-sm text-amber-800 space-y-1 max-h-32 overflow-y-auto">
            {rolesNeedingAttention.slice(0, 10).map((r) => (
              <li key={r.role_id}>
                <span className="font-medium">{r.role_title}</span>
                {r.tenant_name && <span className="text-amber-700"> ({r.tenant_name})</span>}
                {r.days_open > 0 && <span className="text-amber-600"> – {r.days_open}d open</span>}
              </li>
            ))}
            {rolesNeedingAttention.length > 10 && (
              <li className="text-amber-700">+{rolesNeedingAttention.length - 10} more</li>
            )}
          </ul>
        </div>
      )}

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Roles</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Users</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Billing plan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Missed payments</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Usage</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Overspend</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Analytics</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <p className="text-gray-500 font-medium">No clients yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Client info (name, roles, users, billing, usage, shortlist alerts) will appear here when tenants sign up.
                    </p>
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-gray-900">{t.name}</span>
                      </div>
                      {t.slug && (
                        <span className="text-xs text-gray-500 mt-0.5 block">{t.slug}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        {t.role_count ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-500" />
                        {t.user_count ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        {t.billing_plan ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.missed_payments != null && t.missed_payments > 0 ? (
                        <span className="text-red-600 font-medium">{t.missed_payments}</span>
                      ) : (
                        t.missed_payments === 0 ? "0" : "—"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-slate-500" />
                        {t.usage ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.overspend === true ? (
                        <span className="text-amber-600 font-medium">Yes</span>
                      ) : (
                        t.overspend === false ? "No" : "—"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        {t.analytics_summary ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {t.created_at
                        ? new Date(t.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
