/**
 * Market Intelligence service: parallel fetch from Adzuna, ITJobsWatch, Grok,
 * uploaded roles, and reference data. Aggregates using median for accuracy.
 */

import { searchAdzunaJobs } from "./adzunaHttpClient";
import { fetchITJobsWatchSalary } from "./itjobswatchClient";

export interface MarketDataResult {
  salary: { min: number; max: number; median: number };
  demand: { level: string; trend: string; timeToFill: number; competition: string };
  skills: { required: string[]; trending: string[] };
  source: "adzuna" | "itjobswatch" | "grok" | "mock" | "aggregated";
  /** Sources used for aggregation (e.g. ["adzuna", "itjobswatch", "grok"]) */
  sourcesUsed?: string[];
  /** Approximate job count when available (e.g. from Adzuna) */
  jobCount?: number;
}

interface SalaryPoint {
  min: number;
  median: number;
  max: number;
  source: string;
  jobCount?: number;
}

const MOCK_SALARY: { min: number; max: number; median: number } = {
  min: 45000,
  max: 90000,
  median: 67500,
};

/** Reference market data from uploaded screenshots/chats (engineering manager, etc.) */
const REFERENCE_MARKET_DATA: Record<string, SalaryPoint> = {
  "engineering manager": {
    min: 60000,
    median: 72500,
    max: 85000,
    source: "reference",
    jobCount: 589,
  },
  "it manager": {
    min: 50000,
    median: 65000,
    max: 85000,
    source: "reference",
  },
  "project manager": {
    min: 45000,
    median: 58000,
    max: 75000,
    source: "reference",
  },
  "business administrator": {
    min: 28000,
    median: 35000,
    max: 45000,
    source: "reference",
  },
};

/**
 * Compute median of an array of numbers.
 */
function medianOf(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

/**
 * Parse salary string (e.g. "£60,000 - £85,000" or "£75,000") to min/median/max.
 */
/** Expand k/K suffix to thousands (50k → 50000) */
function expandK(str: string): string {
  return str.replace(/(\d+)\s*k\b/gi, (_, num) =>
    (parseInt(num, 10) * 1000).toString()
  );
}

export function parseSalaryString(salaryStr: string): { min: number; median: number; max: number } | null {
  if (!salaryStr || typeof salaryStr !== "string") return null;
  const cleaned = salaryStr.replace(/,/g, "").replace(/[£$]/g, "");
  const expanded = expandK(cleaned);
  const rangeMatch = expanded.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (!isNaN(min) && !isNaN(max) && min > 0) {
      return { min, median: Math.round((min + max) / 2), max };
    }
  }
  const singleMatch = expanded.match(/(\d+)/);
  if (singleMatch) {
    const val = parseInt(singleMatch[1], 10);
    if (!isNaN(val) && val > 0) {
      const min = Math.round(val * 0.8);
      const max = Math.round(val * 1.2);
      return { min, median: val, max };
    }
  }
  return null;
}

import { callGrokViaProxy } from "@/lib/grokProxyClient";

/**
 * Call Grok API via server proxy to infer market data for a role.
 */
async function fetchGrokMarketData(role: string): Promise<MarketDataResult | null> {
  const prompt = `For the UK IT job market role "${role}", provide salary and market data as JSON only. Use this exact format, no other text:
{
  "salary_min": number (UK GBP annual),
  "salary_median": number,
  "salary_max": number,
  "demand_level": "Low" or "Medium" or "High",
  "demand_trend": "Increasing" or "Stable" or "Decreasing",
  "time_to_fill_days": number,
  "competition": "Low" or "Medium" or "High",
  "required_skills": ["skill1", "skill2", "skill3"],
  "trending_skills": ["skill1", "skill2"]
}`;

  try {
    const content = await callGrokViaProxy({
      userPrompt: prompt,
      maxTokens: 500,
      temperature: 0.3,
      model: "grok-3",
    });
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      salary: {
        min: Number(parsed.salary_min) || MOCK_SALARY.min,
        median: Number(parsed.salary_median) || MOCK_SALARY.median,
        max: Number(parsed.salary_max) || MOCK_SALARY.max,
      },
      demand: {
        level: String(parsed.demand_level || "Medium"),
        trend: String(parsed.demand_trend || "Stable"),
        timeToFill: Number(parsed.time_to_fill_days) || 25,
        competition: String(parsed.competition || "Medium"),
      },
      skills: {
        required: Array.isArray(parsed.required_skills)
          ? parsed.required_skills
          : ["Problem Solving", "Git", "Communication"],
        trending: Array.isArray(parsed.trending_skills)
          ? parsed.trending_skills
          : ["TypeScript", "Cloud", "AI"],
      },
      source: "grok",
    };
  } catch (err) {
    console.warn("Grok market data error:", err);
    return null;
  }
}

/**
 * Build demand/skills from aggregated salary and role.
 */
function buildDemandAndSkills(
  salary: { min: number; max: number; median: number },
  role: string,
  grokResult: MarketDataResult | null,
  adzunaSkills?: string[]
): {
  demand: MarketDataResult["demand"];
  skills: MarketDataResult["skills"];
} {
  if (grokResult) {
    return { demand: grokResult.demand, skills: grokResult.skills };
  }
  if (adzunaSkills && adzunaSkills.length > 0) {
    const required = adzunaSkills.slice(0, 5);
    const trending = adzunaSkills.slice(5, 10);
    return {
      demand: {
        level: salary.median > 70000 ? "High" : salary.median > 55000 ? "Medium" : "Low",
        trend: "Stable",
        timeToFill: 15 + Math.floor(Math.random() * 15),
        competition: salary.median > 70000 ? "High" : "Medium",
      },
      skills: {
        required,
        trending: trending.length > 0 ? trending : required.slice(0, 3),
      },
    };
  }
  const normalized = role.toLowerCase();
  const demandLevel =
    salary.median > 70000 ? "High" : salary.median > 55000 ? "Medium" : "Low";
  const competition = salary.median > 70000 ? "High" : "Medium";
  const skillSets: Record<string, { required: string[]; trending: string[] }> = {
    "head of finance": {
      required: ["Financial Planning", "Budgeting", "Forecasting", "Financial Reporting", "Leadership"],
      trending: ["FP&A", "Power BI", "Data-driven Planning", "Automation"],
    },
    "finance manager": {
      required: ["Financial Management", "Forecasting", "Budget Control", "Stakeholder Management", "Reporting"],
      trending: ["FP&A", "Power BI", "Financial Automation", "Data Visualization"],
    },
    accountant: {
      required: ["Accounting", "Financial Reporting", "Reconciliation", "Excel", "Compliance"],
      trending: ["Automation", "ERP Systems", "Data Analytics", "Power BI"],
    },
    finance: {
      required: ["Financial Analysis", "Budgeting", "Forecasting", "Excel", "Reporting"],
      trending: ["FP&A", "Power BI", "ERP Systems", "Automation"],
    },
    copywriter: {
      required: ["Copywriting", "Content Strategy", "SEO Writing", "Brand Voice", "Editing"],
      trending: ["AI-assisted Content", "Conversion Copy", "Content Personalization", "UX Writing"],
    },
    "content writer": {
      required: ["Content Writing", "Research", "SEO", "Editing", "Storytelling"],
      trending: ["AI-assisted Content", "Topic Clustering", "Content Ops", "UX Writing"],
    },
    writer: {
      required: ["Writing", "Editing", "Research", "Communication", "Attention to Detail"],
      trending: ["SEO", "AI-assisted Drafting", "Content Strategy", "UX Writing"],
    },
    marketing: {
      required: ["Campaign Management", "Content Strategy", "Analytics", "Communication", "CRM"],
      trending: ["Performance Marketing", "Marketing Automation", "AI Content", "Attribution"],
    },
    sales: {
      required: ["Prospecting", "Pipeline Management", "Negotiation", "CRM", "Communication"],
      trending: ["Sales Automation", "Account-based Selling", "Revenue Intelligence", "AI Outreach"],
    },
    hr: {
      required: ["Talent Acquisition", "Interviewing", "Stakeholder Management", "Compliance", "Communication"],
      trending: ["People Analytics", "Employer Branding", "HR Automation", "Skills-based Hiring"],
    },
    recruiter: {
      required: ["Sourcing", "Screening", "Interview Coordination", "Stakeholder Management", "ATS"],
      trending: ["AI Sourcing", "Talent Intelligence", "Pipeline Analytics", "Automation"],
    },
    recruitment: {
      required: ["Business Development", "Candidate Sourcing", "KPI Management", "Client Management", "Sales"],
      trending: ["Talent Market Mapping", "AI Sourcing", "Pipeline Analytics", "Automation"],
    },
    consultant: {
      required: ["Client Management", "Business Development", "Communication", "Negotiation", "KPI Tracking"],
      trending: ["Data-led Consulting", "Automation", "AI Assistance", "Market Intelligence"],
    },
    operations: {
      required: ["Process Improvement", "Project Coordination", "Reporting", "Cross-functional Collaboration"],
      trending: ["Automation", "Data-led Operations", "Workflow Optimization", "AI Copilots"],
    },
    customer: {
      required: ["Customer Support", "Communication", "Problem Solving", "Ticketing Systems", "Empathy"],
      trending: ["AI Support Tools", "Customer Analytics", "Self-serve Knowledge", "Automation"],
    },
    support: {
      required: ["Issue Resolution", "Communication", "Troubleshooting", "CRM/Ticketing", "Documentation"],
      trending: ["AI Assistants", "Automation", "Knowledge Base Optimization", "CS Ops"],
    },
    qa: {
      required: ["Test Planning", "Manual Testing", "Bug Tracking", "Communication", "Quality Standards"],
      trending: ["Test Automation", "Shift-left Testing", "CI/CD Testing", "Performance Testing"],
    },
    security: {
      required: ["Risk Assessment", "Security Controls", "Incident Response", "Compliance", "Monitoring"],
      trending: ["Cloud Security", "Zero Trust", "DevSecOps", "Threat Intelligence"],
    },
    analyst: {
      required: ["Data Analysis", "Reporting", "SQL", "Stakeholder Communication", "Problem Solving"],
      trending: ["BI Tools", "Data Visualization", "AI Analytics", "Automation"],
    },
    manager: {
      required: ["Team Leadership", "Planning", "Stakeholder Management", "Performance Management", "Communication"],
      trending: ["Data-driven Leadership", "AI-assisted Planning", "Change Management", "Process Automation"],
    },
    qlik: {
      required: ["Qlik Sense", "QlikView", "SQL", "Data Modeling", "ETL"],
      trending: ["Power BI", "Tableau", "Snowflake", "dbt", "Python"],
    },
    bi: {
      required: ["Business Intelligence", "SQL", "Dashboarding", "Data Warehousing"],
      trending: ["Power BI", "Looker", "dbt", "Snowflake"],
    },
    react: {
      required: ["React", "JavaScript", "HTML", "CSS", "Git"],
      trending: ["TypeScript", "Next.js", "GraphQL", "React Native", "Testing Library"],
    },
    product: {
      required: ["Product Strategy", "Analytics", "Agile", "Stakeholder Management"],
      trending: ["Data Analysis", "User Research", "A/B Testing", "Roadmapping"],
    },
    engineering: {
      required: ["Engineering Leadership", "Automation", "Digital Manufacturing", "Team Management"],
      trending: ["Project Delivery", "Agile", "DevOps"],
    },
    ux: {
      required: ["Figma", "User Research", "Prototyping", "Design Systems"],
      trending: ["Design Systems", "Accessibility", "User Research", "Prototyping"],
    },
    data: {
      required: ["Python", "SQL", "Statistics", "Machine Learning"],
      trending: ["LLMs", "MLOps", "Data Engineering", "Cloud"],
    },
    devops: {
      required: ["CI/CD", "Docker", "Kubernetes", "Cloud"],
      trending: ["Terraform", "GitOps", "Observability", "Security"],
    },
    developer: {
      required: ["JavaScript", "TypeScript", "Git", "API Integration", "Testing"],
      trending: ["AI-assisted Development", "Cloud-native Apps", "CI/CD", "Observability"],
    },
  };

  const keywordAliases: Record<string, string[]> = {
    react: ["frontend", "front-end", "ui developer", "web developer"],
    qlik: ["qlikview", "qlik sense", "bi developer", "business intelligence"],
    bi: ["business intelligence", "data visualization", "dashboard"],
    devops: ["platform engineer", "site reliability", "sre", "infrastructure engineer"],
    data: ["data engineer", "data scientist", "ml engineer", "analytics engineer"],
    finance: ["fp&a", "financial analyst", "head of finance", "finance manager", "accountant"],
    copywriter: ["content writer", "seo writer", "content marketer"],
    hr: ["human resources", "people partner", "talent partner"],
    recruiter: ["talent acquisition", "resourcer", "headhunter"],
    recruitment: ["recruitment consultant", "recruiter", "agency recruiter", "360 recruiter", "perm consultant"],
    consultant: ["recruitment consultant", "talent consultant", "staffing consultant"],
    qa: ["quality assurance", "test engineer", "tester"],
    security: ["cyber", "infosec", "security engineer"],
    customer: ["customer support", "customer success", "service desk"],
  };
  let skills: { required: string[]; trending: string[] } = {
    required: ["JavaScript", "Problem Solving", "Git", "Testing"],
    trending: ["TypeScript", "Cloud Platforms", "Docker", "Microservices"],
  };
  let bestMatch: { key: string; score: number } | null = null;
  for (const key of Object.keys(skillSets)) {
    let score = 0;
    if (normalized.includes(key)) score += key.length + 5;
    const aliases = keywordAliases[key] ?? [];
    for (const alias of aliases) {
      if (normalized.includes(alias)) score += alias.length;
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, score };
    }
  }
  if (bestMatch) {
    skills = skillSets[bestMatch.key];
  }
  return {
    demand: {
      level: demandLevel,
      trend: "Stable",
      timeToFill: 15 + Math.floor(Math.random() * 15),
      competition,
    },
    skills,
  };
}

/**
 * Fetch market intelligence: parallel fetch from all sources, aggregate with median.
 * Uses Grok for demand/skills when available; otherwise infers from role.
 */
export async function fetchMarketData(
  role: string,
  options?: {
    /** Salary data from uploaded roles matching the search */
    uploadedRolesSalaries?: { min: number; median: number; max: number }[];
  }
): Promise<MarketDataResult> {
  const roleLower = role.toLowerCase().trim();

  // 1. Fetch from all sources in parallel (Grok always runs as fallback/enhancement)
  const [adzunaResult, itjwResult, grokResult] = await Promise.all([
    searchAdzunaJobs(role),
    fetchITJobsWatchSalary(role),
    fetchGrokMarketData(role),
  ]);

  // 2. Collect salary points from each source
  const salaryPoints: SalaryPoint[] = [];

  if (adzunaResult && adzunaResult.count >= 3) {
    salaryPoints.push({
      min: adzunaResult.min,
      median: adzunaResult.median,
      max: adzunaResult.max,
      source: "adzuna",
      jobCount: adzunaResult.count,
    });
  }

  if (itjwResult) {
    salaryPoints.push({
      min: itjwResult.min,
      median: itjwResult.median,
      max: itjwResult.max,
      source: "itjobswatch",
    });
  }

  if (grokResult) {
    salaryPoints.push({
      min: grokResult.salary.min,
      median: grokResult.salary.median,
      max: grokResult.salary.max,
      source: "grok",
    });
  }

  // 3. Add reference data for matching roles
  for (const [key, ref] of Object.entries(REFERENCE_MARKET_DATA)) {
    if (roleLower.includes(key) || key.includes(roleLower)) {
      salaryPoints.push(ref);
      break;
    }
  }

  // 4. Add uploaded roles salary data
  if (options?.uploadedRolesSalaries?.length) {
    for (const s of options.uploadedRolesSalaries) {
      if (s.min > 0 && s.median > 0 && s.max > 0) {
        salaryPoints.push({
          min: s.min,
          median: s.median,
          max: s.max,
          source: "uploaded_roles",
        });
      }
    }
  }

  // 5. Aggregate: median of all sources for most accurate result
  let salary: { min: number; max: number; median: number };
  let sourcesUsed: string[];
  let jobCount: number | undefined;

  if (salaryPoints.length > 0) {
    const mins = salaryPoints.map((p) => p.min);
    const medians = salaryPoints.map((p) => p.median);
    const maxs = salaryPoints.map((p) => p.max);
    salary = {
      min: medianOf(mins),
      median: medianOf(medians),
      max: medianOf(maxs),
    };
    sourcesUsed = [...new Set(salaryPoints.map((p) => p.source))];
    const totalJobs = salaryPoints
      .map((p) => p.jobCount)
      .filter((n): n is number => n != null);
    jobCount = totalJobs.length > 0 ? Math.max(...totalJobs) : undefined;
  } else {
    // No sources succeeded – use Grok if it returned (even with bad salary) or mock
    if (grokResult) {
      salary = grokResult.salary;
      sourcesUsed = ["grok"];
    } else {
      salary = MOCK_SALARY;
      sourcesUsed = ["mock"];
    }
  }

  const { demand, skills } = buildDemandAndSkills(
    salary,
    role,
    grokResult ?? null,
    adzunaResult?.topSkills
  );

  return {
    salary,
    demand,
    skills,
    source: salaryPoints.length > 1 ? "aggregated" : (sourcesUsed[0] as MarketDataResult["source"]) ?? "mock",
    sourcesUsed,
    jobCount,
  };
}
