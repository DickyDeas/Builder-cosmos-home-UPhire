/**
 * Analytics tab - recruitment insights and performance metrics
 * Extracted from Index.tsx for maintainability
 */

import React from "react";
import { toast } from "@/hooks/use-toast";
import {
  ArrowUp,
  ArrowDown,
  UserCheck,
  PoundSterling,
  Star,
  TrendingUp,
  Target,
  Download,
  Linkedin,
  Users,
  Github,
  Globe,
} from "lucide-react";

export const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-200">
          Recruitment insights and performance metrics
        </p>
      </div>
      <div className="flex space-x-3">
        <select className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
          <option value="last30days" className="text-gray-900">
            Last 30 Days
          </option>
          <option value="last90days" className="text-gray-900">
            Last 90 Days
          </option>
          <option value="lastyear" className="text-gray-900">
            Last Year
          </option>
        </select>
        <button
          onClick={() => toast({ title: "Export complete", description: "Analytics report exported successfully." })}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>

    {/* Key Performance Indicators */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Hires</p>
            <p className="text-3xl font-bold text-gray-900">47</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              +12% vs last month
            </p>
          </div>
          <UserCheck className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Cost per Hire</p>
            <p className="text-3xl font-bold text-gray-900">£2,340</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowDown className="w-4 h-4 mr-1" />
              -8% vs last month
            </p>
          </div>
          <PoundSterling className="w-8 h-8 text-slate-600" />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Quality of Hire</p>
            <p className="text-3xl font-bold text-gray-900">8.7/10</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              +0.3 vs last month
            </p>
          </div>
          <Star className="w-8 h-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Source Effectiveness
            </p>
            <p className="text-3xl font-bold text-gray-900">73%</p>
            <p className="text-sm text-slate-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              LinkedIn leading
            </p>
          </div>
          <Target className="w-8 h-8 text-slate-600" />
        </div>
      </div>
    </div>

    {/* Hiring Funnel Analysis */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hiring Funnel Analysis
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Applications
            </span>
            <span className="text-sm font-bold text-gray-900">1,247</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Screened</span>
            <span className="text-sm font-bold text-gray-900">423 (34%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: "34%" }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Interviewed
            </span>
            <span className="text-sm font-bold text-gray-900">284 (67%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-slate-500 h-3 rounded-full"
              style={{ width: "67%" }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Offers</span>
            <span className="text-sm font-bold text-gray-900">89 (31%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-amber-500 h-3 rounded-full"
              style={{ width: "31%" }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Hires</span>
            <span className="text-sm font-bold text-gray-900">47 (53%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-slate-600 h-3 rounded-full"
              style={{ width: "53%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Source Performance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Linkedin className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-gray-900">
                LinkedIn
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">342 hires</p>
              <p className="text-xs text-gray-600">£2,100 avg cost</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Indeed</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">156 hires</p>
              <p className="text-xs text-gray-600">£1,800 avg cost</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Github className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-gray-900">GitHub</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">89 hires</p>
              <p className="text-xs text-gray-600">£2,800 avg cost</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-900">
                Referrals
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">67 hires</p>
              <p className="text-xs text-gray-600">£900 avg cost</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Time-based Analytics */}
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Monthly Hiring Trends
      </h3>
      <div className="grid grid-cols-6 gap-4">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => {
          const heights = [60, 75, 45, 90, 80, 70];
          return (
            <div key={month} className="text-center">
              <div className="h-24 flex items-end justify-center mb-2">
                <div
                  className="w-8 bg-gradient-to-t from-violet-600 via-purple-500 to-pink-500 rounded-t shadow-sm"
                  style={{ height: `${heights[index]}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{month}</p>
              <p className="text-sm font-bold text-gray-900">
                {Math.floor(heights[index] / 2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
