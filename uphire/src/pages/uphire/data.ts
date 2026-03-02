/** Mock data and business profile - extracted to reduce Index.tsx size and OOM risk */

import type { Role, Candidate, Employee, Document, ShortlistedCandidate, JobBoardConfig } from "./types";

export const mockRoles: Role[] = [
  {
    id: 1,
    title: "Senior React Developer",
    department: "Engineering",
    location: "London, UK",
    status: "Active",
    candidates: 28,
    shortlisted: 8,
    interviewed: 5,
    created: "2024-01-15",
    salary: "£60,000 - £85,000",
    priority: "High",
    deiScore: 92,
    description:
      "We're looking for a Senior React Developer to join our dynamic engineering team.",
    requirements: [
      "5+ years of React development experience",
      "Strong TypeScript skills",
      "Experience with modern build tools",
      "Knowledge of testing frameworks",
      "Excellent problem-solving abilities",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health and dental coverage",
      "Flexible working arrangements",
      "Professional development budget",
      "25 days annual leave + bank holidays",
    ],
    shortlistedCandidates: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        location: "London, UK",
        experience: "5+ years",
        skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
        aiMatch: 94,
        source: "LinkedIn",
        applied: "2024-01-20",
        avatar: "AJ",
        phoneNumber: "+44 20 7946 0958",
        linkedinProfile: "https://linkedin.com/in/alicejohnson",
        notes: "Excellent React skills, previous startup experience",
        interviewStage: "technical_completed",
        lastUpdated: "2024-01-22",
        interviewHistory: [
          { id: 1, type: "screening", status: "completed", date: "2024-01-21", interviewer: "HR Team", feedback: "Great cultural fit, strong communication skills", rating: 9 },
          { id: 2, type: "technical", status: "completed", date: "2024-01-22", interviewer: "Tech Lead", feedback: "Impressive technical skills, solved problems efficiently", rating: 8 },
        ],
      },
      {
        id: 2,
        name: "David Rodriguez",
        email: "david.rodriguez@email.com",
        location: "Manchester, UK",
        experience: "6+ years",
        skills: ["React", "TypeScript", "Python", "Docker", "Kubernetes"],
        aiMatch: 89,
        source: "GitHub",
        applied: "2024-01-19",
        avatar: "DR",
        phoneNumber: "+44 161 496 0058",
        githubProfile: "https://github.com/davidrodriguez",
        notes: "Full-stack expertise, DevOps experience",
        interviewStage: "screening_scheduled",
        lastUpdated: "2024-01-20",
        interviewHistory: [{ id: 3, type: "screening", status: "scheduled", date: "2024-01-24", interviewer: "HR Team" }],
      },
      {
        id: 3,
        name: "Sarah Mitchell",
        email: "sarah.mitchell@email.com",
        location: "Birmingham, UK",
        experience: "4+ years",
        skills: ["React", "JavaScript", "CSS", "Node.js", "MongoDB"],
        aiMatch: 85,
        source: "Indeed",
        applied: "2024-01-18",
        avatar: "SM",
        phoneNumber: "+44 121 496 0058",
        notes: "Creative problem solver, strong UI/UX sense",
        interviewStage: "shortlisted",
        lastUpdated: "2024-01-18",
        interviewHistory: [],
      },
      {
        id: 4,
        name: "James Wilson",
        email: "james.wilson@email.com",
        location: "Edinburgh, UK",
        experience: "7+ years",
        skills: ["React", "Vue.js", "TypeScript", "GraphQL", "PostgreSQL"],
        aiMatch: 91,
        source: "AngelList",
        applied: "2024-01-17",
        avatar: "JW",
        notes: "Senior developer with team lead experience",
        interviewStage: "final_scheduled",
        lastUpdated: "2024-01-23",
        interviewHistory: [
          { id: 4, type: "screening", status: "completed", date: "2024-01-19", interviewer: "HR Team", rating: 8 },
          { id: 5, type: "technical", status: "completed", date: "2024-01-21", interviewer: "Tech Lead", rating: 9 },
          { id: 6, type: "final", status: "scheduled", date: "2024-01-25", interviewer: "Engineering Manager" },
        ],
      },
      {
        id: 5,
        name: "Emma Thompson",
        email: "emma.thompson@email.com",
        location: "Bristol, UK",
        experience: "3+ years",
        skills: ["React", "JavaScript", "HTML", "CSS", "Firebase"],
        aiMatch: 78,
        source: "Stack Overflow",
        applied: "2024-01-16",
        avatar: "ET",
        interviewStage: "offer_made",
        lastUpdated: "2024-01-23",
        interviewHistory: [
          { id: 7, type: "screening", status: "completed", date: "2024-01-18", interviewer: "HR Team", rating: 7 },
          { id: 8, type: "technical", status: "completed", date: "2024-01-20", interviewer: "Tech Lead", rating: 8 },
          { id: 9, type: "final", status: "completed", date: "2024-01-22", interviewer: "Engineering Manager", rating: 8 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "London, UK",
    status: "Active",
    candidates: 15,
    shortlisted: 4,
    interviewed: 2,
    created: "2024-01-10",
    salary: "£70,000 - £95,000",
    priority: "Medium",
    deiScore: 88,
    description: "Join our product team to drive innovation and user experience.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical skills",
      "Experience with agile methodologies",
      "Excellent stakeholder management",
      "Data-driven decision making",
    ],
    benefits: [
      "Competitive salary and bonus scheme",
      "Health and wellness benefits",
      "Flexible working hours",
      "Learning and development opportunities",
      "Stock options",
    ],
    shortlistedCandidates: [
      {
        id: 6,
        name: "Michael Chen",
        email: "michael.chen@email.com",
        location: "London, UK",
        experience: "4+ years",
        skills: ["Product Strategy", "Data Analysis", "Agile", "Figma", "SQL"],
        aiMatch: 87,
        source: "LinkedIn",
        applied: "2024-01-12",
        avatar: "MC",
        interviewStage: "technical_scheduled",
        lastUpdated: "2024-01-15",
        interviewHistory: [{ id: 10, type: "screening", status: "completed", date: "2024-01-14", interviewer: "Product Director", rating: 8 }],
      },
      {
        id: 7,
        name: "Lisa Park",
        email: "lisa.park@email.com",
        location: "Cambridge, UK",
        experience: "5+ years",
        skills: ["Product Management", "UX Research", "Analytics", "Roadmapping"],
        aiMatch: 92,
        source: "Indeed",
        applied: "2024-01-11",
        avatar: "LP",
        interviewStage: "screening_completed",
        lastUpdated: "2024-01-16",
        interviewHistory: [{ id: 11, type: "screening", status: "completed", date: "2024-01-15", interviewer: "Product Director", rating: 9 }],
      },
    ],
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    status: "Active",
    candidates: 22,
    shortlisted: 6,
    interviewed: 3,
    created: "2024-01-08",
    salary: "£45,000 - £65,000",
    priority: "Low",
    deiScore: 95,
    description: "Create beautiful and intuitive user experiences for our products.",
    requirements: [
      "3+ years of UX design experience",
      "Proficiency in Figma and design tools",
      "User research and testing experience",
      "Portfolio of design work",
      "Collaborative mindset",
    ],
    benefits: [
      "Remote-first culture",
      "Design conference budget",
      "Latest design tools and equipment",
      "Mentorship opportunities",
      "Creative freedom",
    ],
    shortlistedCandidates: [
      {
        id: 8,
        name: "Sophie Taylor",
        email: "sophie.taylor@email.com",
        location: "Brighton, UK",
        experience: "4+ years",
        skills: ["UX Design", "Figma", "User Research", "Prototyping", "Design Systems"],
        aiMatch: 88,
        source: "Dribbble",
        applied: "2024-01-09",
        avatar: "ST",
        interviewStage: "shortlisted",
        lastUpdated: "2024-01-09",
        interviewHistory: [],
      },
      {
        id: 9,
        name: "Alex Kumar",
        email: "alex.kumar@email.com",
        location: "Leeds, UK",
        experience: "3+ years",
        skills: ["UI/UX Design", "Adobe Creative Suite", "Sketch", "InVision"],
        aiMatch: 82,
        source: "Behance",
        applied: "2024-01-10",
        avatar: "AK",
        interviewStage: "screening_scheduled",
        lastUpdated: "2024-01-12",
        interviewHistory: [],
      },
    ],
  },
];

export let mockCandidates: Candidate[] = [
  { id: 1, name: "Alice Johnson", role: "Senior React Developer", email: "alice.johnson@email.com", location: "London, UK", experience: "5+ years", skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"], aiMatch: 94, status: "Shortlisted", source: "LinkedIn", applied: "2024-01-20", avatar: "AJ", phoneNumber: "+44 20 7946 0958", linkedinProfile: "https://linkedin.com/in/alicejohnson", notes: "Excellent React skills, previous startup experience" },
  { id: 2, name: "Bob Smith", role: "Frontend Developer", email: "bob.smith@email.com", location: "Manchester, UK", experience: "3+ years", skills: ["JavaScript", "React", "CSS", "HTML", "Git"], aiMatch: 78, status: "Applied", source: "Indeed", applied: "2024-01-19", avatar: "BS" },
  { id: 3, name: "Carol Davis", role: "Product Manager", email: "carol.davis@email.com", location: "Edinburgh, UK", experience: "4+ years", skills: ["Product Strategy", "Agile", "Analytics", "Figma"], aiMatch: 88, status: "Interview Scheduled", source: "LinkedIn", applied: "2024-01-18", avatar: "CD" },
  { id: 4, name: "David Wilson", role: "UX Designer", email: "david.wilson@email.com", location: "Bristol, UK", experience: "2+ years", skills: ["UX Design", "Figma", "User Research", "Prototyping"], aiMatch: 82, status: "Offer Made", source: "Dribbble", applied: "2024-01-17", avatar: "DW" },
];

export let mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Software Engineer",
    department: "Engineering",
    startDate: "2023-03-15",
    salary: "£75,000",
    manager: "Tech Lead",
    employmentType: "Full-Time",
    probationPeriod: false,
    probationMonths: 6,
    employeeId: "EMP001",
    email: "sarah.johnson@company.com",
    phoneNumber: "+44 20 1234 5678",
    avatar: "SJ",
    documents: [{ id: 1, name: "Employment Contract", type: "Contract", category: "Legal", lastModified: "2023-03-15", autoSend: false, template: "Standard Employment", status: "Signed", date: "2023-03-15" }],
  },
  {
    id: 2,
    name: "Mark Thompson",
    position: "Product Designer",
    department: "Design",
    startDate: "2024-01-08",
    salary: "£55,000",
    manager: "Design Lead",
    employmentType: "Full-Time",
    probationPeriod: true,
    probationMonths: 3,
    employeeId: "EMP002",
    email: "mark.thompson@company.com",
    avatar: "MT",
    documents: [],
  },
];

export let mockDocuments: Document[] = [
  { id: 1, name: "Employee Handbook", type: "Handbook", category: "HR", lastModified: "2024-01-15", autoSend: true, template: "Standard Handbook" },
  { id: 2, name: "NDA Template", type: "Legal", category: "Legal", lastModified: "2024-01-10", autoSend: false, template: "NDA Standard" },
];

export const businessProfile = {
  companyName: "TechVision Solutions",
  industry: "Technology",
  founded: "2018",
  employees: "150-250",
  headquarters: "London, UK",
  website: "www.techvisionsolutions.com",
  description:
    "TechVision Solutions is a leading technology consultancy that helps businesses transform through innovative digital solutions. We specialize in cloud architecture, AI/ML implementation, and custom software development.",
  mission: "To empower businesses with cutting-edge technology solutions that drive growth and innovation.",
  values: ["Innovation", "Integrity", "Collaboration", "Excellence", "Diversity"],
  services: [
    "Cloud Architecture & Migration",
    "AI/ML Implementation",
    "Custom Software Development",
    "Digital Transformation Consulting",
    "DevOps & Infrastructure",
    "Data Analytics & Visualization",
  ],
  technologies: ["AWS", "Azure", "Google Cloud", "React", "Node.js", "Python", "TensorFlow", "Kubernetes", "Docker", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Next.js", "TailwindCSS"],
  clients: ["Fortune 500 companies", "Government agencies", "Healthcare organizations", "Financial institutions", "E-commerce platforms", "SaaS startups"],
  certifications: ["ISO 27001", "SOC 2 Type II", "Cyber Essentials Plus"],
  awards: ["Best Tech Employer 2023", "Innovation Award 2022", "Diversity Champion 2023"],
  companyLogo: undefined as string | undefined,
};

export const DEFAULT_JOB_BOARDS: JobBoardConfig[] = [
  { id: "reed", name: "Reed", details: "UK's largest job site", configured: false },
  { id: "cv-library", name: "CV-Library", details: "UK job board and CV database", configured: false },
  { id: "totaljobs", name: "Totaljobs", details: "Part of Totaljobs Group", configured: false },
  { id: "indeed", name: "Indeed", details: "Global job search engine", configured: false },
  { id: "linkedin", name: "LinkedIn", details: "Professional network and job board", configured: false },
  { id: "jobsite", name: "JobSite", details: "UK job board", configured: false },
  { id: "glassdoor", name: "Glassdoor", details: "Job reviews and listings", configured: false },
  { id: "adzuna", name: "Adzuna", details: "UK job search aggregator", configured: false },
  { id: "govuk", name: "Find a job (gov.uk)", details: "Free UK government job board – post once you've created an account", configured: false },
];

const STORAGE_KEY_PROFILE = "uphire_business_profile";
const STORAGE_KEY_JOB_BOARDS = "uphire_job_boards";

export function loadBusinessProfileFromStorage() {
  try {
    const s = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (s) {
      const parsed = JSON.parse(s);
      Object.assign(businessProfile, parsed);
    }
  } catch (_) {}
}

export function loadJobBoardsFromStorage(): JobBoardConfig[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY_JOB_BOARDS);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return DEFAULT_JOB_BOARDS.map((b) => ({ ...b }));
}

if (typeof window !== "undefined") {
  loadBusinessProfileFromStorage();
}
