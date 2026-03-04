/**
 * Dashboard tab - overview stats, Market Intelligence, recent activity
 * Extracted from Index.tsx for maintainability
 */

import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Briefcase,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { MarketIntelligence } from "../components/MarketIntelligence";
import { mockRoles, mockCandidates } from "../data";
import { fetchStrugglingRoles, fetchRolesNeedingAttention, type RoleNeedingAttention } from "@/services/roleFlagsService";

export const DashboardTab = ({ isStaff = false }: { isStaff?: boolean }) => {
  const [strugglingCount, setStrugglingCount] = useState(0);
  const [rolesNeedingAttention, setRolesNeedingAttention] = useState<RoleNeedingAttention[]>([]);

  useEffect(() => {
    if (!isStaff) return;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const [struggling, attention] = await Promise.all([
        fetchStrugglingRoles(),
        fetchRolesNeedingAttention(5, token),
      ]);
      setStrugglingCount(struggling.length);
      setRolesNeedingAttention(attention);
    };
    load();
  }, [isStaff]);

  const attentionCount = rolesNeedingAttention.length;
  const totalAlertCount = isStaff ? strugglingCount + attentionCount : 0;
  const getAllCandidatesCount = () => {
    const baseCount = mockCandidates.length;
    let shortlistedCount = 0;
    const seenEmails = new Set(mockCandidates.map((c) => c.email));

    mockRoles.forEach((role) => {
      if (role.shortlistedCandidates) {
        role.shortlistedCandidates.forEach((candidate) => {
          if (!seenEmails.has(candidate.email)) {
            shortlistedCount++;
            seenEmails.add(candidate.email);
          }
        });
      }
    });

    return baseCount + shortlistedCount;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-200">
            Welcome to your UPhireIQ AI-powered recruitment platform
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockRoles.filter((r) => r.status === "Active").length}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +2 this week
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-slate-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Candidates
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {getAllCandidatesCount()}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +18 this week
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Interviews This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">18</p>
              <p className="text-sm text-slate-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />6 scheduled today
              </p>
            </div>
            <Calendar className="w-8 h-8 text-slate-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Time to Hire (avg)
              </p>
              <p className="text-3xl font-bold text-gray-900">23d</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowDown className="w-4 h-4 mr-1" />
                -3 days vs last month
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Market Intelligence Section */}
      <MarketIntelligence />

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            {totalAlertCount > 0 && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {totalAlertCount} role(s) need attention
              </span>
            )}
          </div>
          {isStaff && rolesNeedingAttention.length > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-900 mb-2">
                Roles with no applicants (5+ days) – assign outside resource to build shortlist:
              </p>
              <ul className="text-sm text-amber-800 space-y-1">
                {rolesNeedingAttention.slice(0, 5).map((r) => (
                  <li key={r.role_id}>
                    {r.role_title}
                    {r.tenant_name && ` (${r.tenant_name})`}
                    {r.days_open > 0 && ` – ${r.days_open}d open`}
                  </li>
                ))}
                {rolesNeedingAttention.length > 5 && (
                  <li className="text-amber-700">+{rolesNeedingAttention.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Users className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New candidate applied for Senior React Developer
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Interview completed with Alice Johnson
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New role created: UX Designer
                </p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <img
                src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                alt="UPhireIQ AI"
                className="w-5 h-5 object-contain"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  UPhireIQ AI recruitment completed for Product Manager role
                </p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Overview
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Applications to Interview Rate
                </span>
                <span className="text-sm font-bold text-green-600">34%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "34%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Interview to Offer Rate
                </span>
                <span className="text-sm font-bold text-purple-600">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
                  style={{ width: "67%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Offer Acceptance Rate
                </span>
                <span className="text-sm font-bold text-purple-600">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: "89%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Employee Retention (1 year)
                </span>
                <span className="text-sm font-bold text-amber-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
