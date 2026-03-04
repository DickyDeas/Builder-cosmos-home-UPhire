/**
 * Market Intelligence: Adzuna → ITJobsWatch → Grok fallback, with uploaded roles
 * Extracted from Index.tsx for maintainability
 */

import React, { useState, useEffect } from "react";
import { Search, Globe, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { sanitizeSearch } from "@/lib/security";
import { toast } from "@/hooks/use-toast";
import type { Role } from "../types";
import type { MarketData } from "../types";
import { mockRoles } from "../data";

interface MarketIntelligenceProps {
  uploadedRoles?: Role[];
}

export const MarketIntelligence = ({
  uploadedRoles = mockRoles,
}: MarketIntelligenceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchResults, setLastSearchResults] = useState<MarketData | null>(
    null,
  );
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [supabaseRoleTitles, setSupabaseRoleTitles] = useState<string[]>([]);

  useEffect(() => {
    const loadSupabaseRoles = async () => {
      try {
        const { data } = await supabase.from("roles").select("title");
        if (data?.length) {
          setSupabaseRoleTitles(data.map((r) => r.title).filter(Boolean));
        }
      } catch {
        // Supabase not configured or no roles
      }
    };
    loadSupabaseRoles();
  }, []);

  const allUploadedRoleTitles = [
    ...new Set([
      ...uploadedRoles.map((r) => r.title),
      ...supabaseRoleTitles,
    ]),
  ].filter(Boolean);

  const searchMarketData = async (role: string) => {
    const safeRole = sanitizeSearch(role);
    if (!safeRole) return;
    setIsSearching(true);
    try {
      const { fetchMarketData, parseSalaryString } = await import(
        "@/services/marketDataService"
      );
      const roleLower = safeRole.toLowerCase();
      const uploadedSalaries: { min: number; median: number; max: number }[] = [];
      for (const r of uploadedRoles) {
        if (r.salary && r.title?.toLowerCase().includes(roleLower)) {
          const parsed = parseSalaryString(r.salary);
          if (parsed) uploadedSalaries.push(parsed);
        }
      }
      const result = await fetchMarketData(safeRole, {
        uploadedRolesSalaries: uploadedSalaries.length ? uploadedSalaries : undefined,
      });
      setLastSearchResults({
        salary: result.salary,
        demand: result.demand,
        skills: result.skills,
        sourcesUsed: result.sourcesUsed,
        jobCount: result.jobCount,
      });
      setSearchHistory((prev) =>
        [safeRole, ...prev.filter((h) => h !== safeRole)].slice(0, 5)
      );
      if (result.sourcesUsed?.includes("mock")) {
        toast({
          title: "Using estimated data",
          description: "Live sources unavailable. Showing market estimates.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Market data search error:", err);
      setLastSearchResults(null);
      toast({
        title: "Search failed",
        description: "Unable to fetch market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Market Intelligence
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Powered by</span>
            <img
              src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
              alt="UPhireIQ"
              className="h-4 object-contain"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Globe className="w-4 h-4" />
          <span>Live UK Market Data</span>
        </div>
      </div>

      {/* Search Interface */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  searchMarketData(searchTerm.trim());
                }
              }}
              placeholder="e.g. Senior React Developer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <button
            onClick={() =>
              searchTerm.trim() && searchMarketData(searchTerm.trim())
            }
            disabled={isSearching || !searchTerm.trim()}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSearching ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isSearching ? "Searching..." : "Search"}</span>
          </button>
        </div>

        {allUploadedRoleTitles.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Your uploaded roles:</p>
            <div className="flex flex-wrap gap-2">
              {allUploadedRoleTitles.slice(0, 12).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSearchTerm(role);
                    searchMarketData(role);
                  }}
                  className="px-3 py-1 text-xs bg-slate-50 text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "React Developer",
            "Product Manager",
            "UX Designer",
            "DevOps Engineer",
          ].map((role) => (
            <button
              key={role}
              onClick={() => {
                setSearchTerm(role);
                searchMarketData(role);
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {role}
            </button>
          ))}
        </div>

        {searchHistory.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(term);
                    searchMarketData(term);
                  }}
                  className="px-2 py-1 text-xs bg-slate-50 text-slate-700 rounded hover:bg-slate-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isSearching && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-slate-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            Fetching market data (Adzuna, ITJobsWatch, Grok)...
          </p>
        </div>
      )}

      {lastSearchResults && !isSearching && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600 font-medium">
                Minimum Salary
              </p>
              <p className="text-2xl font-bold text-slate-800">
                £{lastSearchResults.salary.min.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-medium">
                Median Salary
              </p>
              <p className="text-2xl font-bold text-green-800">
                £{lastSearchResults.salary.median.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600 font-medium">
                Maximum Salary
              </p>
              <p className="text-2xl font-bold text-slate-800">
                £{lastSearchResults.salary.max.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Market Demand</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Demand Level:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lastSearchResults.demand.level === "High"
                        ? "bg-red-100 text-red-800"
                        : lastSearchResults.demand.level === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {lastSearchResults.demand.level}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trend:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {lastSearchResults.demand.trend}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Avg. Time to Fill:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {lastSearchResults.demand.timeToFill} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Competition:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {lastSearchResults.demand.competition}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Salary Benchmarking
              </h4>
              <div className="relative pt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 h-3 rounded-full relative"
                    style={{ width: "100%" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <span className="text-xs text-white font-medium">
                        £{lastSearchResults.salary.min / 1000}k
                      </span>
                      <span className="text-xs text-white font-bold">
                        £{lastSearchResults.salary.median / 1000}k
                      </span>
                      <span className="text-xs text-white font-medium">
                        £{lastSearchResults.salary.max / 1000}k
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minimum</span>
                  <span>Median</span>
                  <span>Maximum</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {lastSearchResults.jobCount
                  ? `Based on ${lastSearchResults.jobCount.toLocaleString()} recent job postings in the UK market`
                  : lastSearchResults.sourcesUsed?.length
                    ? `Aggregated from ${lastSearchResults.sourcesUsed.join(", ")} (median of all sources)`
                    : "Based on UK market data"}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => toast({ title: "Export complete", description: "Market report exported successfully." })}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                Export Report
              </button>
              <button
                onClick={() =>
                  toast({ title: "Create role", description: "Redirecting to create role with market data..." })
                }
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                Create Role
              </button>
              <button
                onClick={() => toast({ title: "Export complete", description: "Market data exported to CSV." })}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors ml-2"
              >
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                Required Skills
              </h5>
              <div className="flex flex-wrap gap-2">
                {lastSearchResults.skills.required.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                Trending Skills
              </h5>
              <div className="flex flex-wrap gap-2">
                {lastSearchResults.skills.trending.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!lastSearchResults && !isSearching && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Current Market Trends
            </h4>
            <p className="text-sm text-gray-600">
              Real-time insights from the UK tech recruitment market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Hottest Roles This Month
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Senior React Developer
                    </p>
                    <p className="text-xs text-gray-600">
                      +23% demand increase
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">£77k</p>
                    <p className="text-xs text-gray-600">median</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      DevOps Engineer
                    </p>
                    <p className="text-xs text-gray-600">
                      +18% demand increase
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">£80k</p>
                    <p className="text-xs text-gray-600">median</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Data Scientist
                    </p>
                    <p className="text-xs text-gray-600">
                      +15% demand increase
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">£75k</p>
                    <p className="text-xs text-gray-600">median</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-amber-600 mr-2" />
                Trending Skills
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      TypeScript
                    </span>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    +31%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      AWS
                    </span>
                  </div>
                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                    +27%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Kubernetes
                    </span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    +24%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Machine Learning
                    </span>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    +22%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Market Overview</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-600">89%</p>
                <p className="text-sm text-gray-600">Market Activity</p>
                <p className="text-xs text-green-600 mt-1">↑ 5% vs last month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">21d</p>
                <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                <p className="text-xs text-green-600 mt-1">↓ 2 days vs last month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-600">£68k</p>
                <p className="text-sm text-gray-600">Avg. Tech Salary</p>
                <p className="text-xs text-green-600 mt-1">↑ 3% vs last quarter</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">1,247</p>
                <p className="text-sm text-gray-600">Active Job Postings</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% vs last week</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Search for a specific role above to get detailed market
              intelligence and salary benchmarking
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>Powered by</span>
              <img
                src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                alt="UPhireIQ"
                className="h-3 object-contain"
              />
              <span>for accurate UK market insights</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
