/** Utility functions for UPhire platform - extracted to reduce Index.tsx size and OOM risk */

import type { Role } from "./types";

export const getInterviewStageColor = (stage: string) => {
  const stageColors: {
    [key: string]: { bg: string; text: string; border: string };
  } = {
    shortlisted: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    screening_scheduled: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    screening_completed: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    technical_scheduled: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    technical_completed: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    final_scheduled: {
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
    },
    final_completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    offer_made: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    hired: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };
  return (
    stageColors[stage] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
    }
  );
};

export const getInterviewStageLabel = (stage: string) => {
  const labels: { [key: string]: string } = {
    shortlisted: "Shortlisted",
    screening_scheduled: "Screening Scheduled",
    screening_completed: "Screening Complete",
    technical_scheduled: "Technical Scheduled",
    technical_completed: "Technical Complete",
    final_scheduled: "Final Scheduled",
    final_completed: "Final Complete",
    offer_made: "Offer Made",
    hired: "Hired",
    rejected: "Rejected",
  };
  return labels[stage] || stage;
};

export const normalizeSalaryInput = (value: string): string => {
  const str = String(value).trim();
  if (!str) return "";
  const withKExpanded = str.replace(/(\d+)\s*k\b/gi, (_, num) =>
    (parseInt(num, 10) * 1000).toString()
  );
  const rangeMatch = withKExpanded.match(/^([£\d,\s]+)\s*[-–—]\s*([£\d,\s]+)$/);
  if (rangeMatch) {
    const a = parseInt(rangeMatch[1].replace(/[£,]/g, ""), 10);
    const b = parseInt(rangeMatch[2].replace(/[£,]/g, ""), 10);
    if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) {
      return `£${a.toLocaleString("en-GB")} - £${b.toLocaleString("en-GB")}`;
    }
  }
  const singleMatch = withKExpanded.replace(/[£,]/g, "");
  const num = parseInt(singleMatch, 10);
  if (!isNaN(num) && num > 0) {
    return `£${num.toLocaleString("en-GB")}`;
  }
  return str;
};

export const computeAIMatchScore = (
  candidate: { skills?: string[]; experience?: string; notes?: string; educationLevel?: string },
  role: { keySkills?: string[]; requirements?: string[]; experienceLevel?: string }
): number => {
  const candidateSkills = new Set((candidate.skills || []).map((s) => s.toLowerCase()));
  const roleSkills = (role.keySkills || []).map((s) => s.toLowerCase());
  const roleReqs = (role.requirements || []).join(" ").toLowerCase();
  const skillsMatch = roleSkills.length
    ? Math.min(100, (roleSkills.filter((s) => candidateSkills.has(s) || roleReqs.includes(s)).length / roleSkills.length) * 100)
    : 70;
  const expYears = parseInt((candidate.experience || "0").replace(/\D/g, ""), 10) || 0;
  const reqExp = parseInt((role.experienceLevel || "3").replace(/\D/g, ""), 10) || 3;
  const experienceScore = Math.min(100, (expYears / Math.max(1, reqExp)) * 80 + 20);
  const qualificationsScore = candidate.educationLevel || candidate.notes ? 85 : 70;
  const fitScore = 80;
  return Math.min(100, Math.round(skillsMatch * 0.4 + experienceScore * 0.3 + qualificationsScore * 0.2 + fitScore * 0.1));
};

export const formatCurrency = (value: string | number): string => {
  if (typeof value === "number") return `£${value.toLocaleString("en-GB")}`;
  const str = String(value).trim().replace(/\$/g, "£");
  if (!str) return "";
  const withKExpanded = str.replace(/(\d+)\s*k\b/gi, (_, n) => (parseInt(n, 10) * 1000).toString());
  const rangeMatch = withKExpanded.match(/^([£\d,\s]+)\s*[-–—]\s*([£\d,\s]+)$/);
  if (rangeMatch) {
    const a = parseInt(rangeMatch[1].replace(/[£,]/g, ""), 10);
    const b = parseInt(rangeMatch[2].replace(/[£,]/g, ""), 10);
    if (!isNaN(a) && !isNaN(b)) return `£${a.toLocaleString("en-GB")} - £${b.toLocaleString("en-GB")}`;
  }
  const cleaned = withKExpanded.replace(/[£,]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? str : `£${num.toLocaleString("en-GB")}`;
};

export const channelLabel = (ch: "email" | "linkedin" | "job_board" | "indeed" | "sms" | "phone") =>
  ({ email: "Email", linkedin: "LinkedIn", job_board: "Job Board", indeed: "Indeed", sms: "SMS", phone: "Phone" }[ch]);
