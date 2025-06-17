import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Check,
  CheckCircle,
  XCircle,
  BarChart3,
  UserCheck,
  Building,
  Mail,
  MapPin,
  Star,
  Award,
  Zap,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Clock,
  Target,
  AlertTriangle,
  Lightbulb,
  Brain,
  X,
  ChevronDown,
  Upload,
  Download,
  Send,
  Phone,
  MessageSquare,
  VideoIcon,
  User,
  Timer,
  Briefcase,
  PieChart,
  Factory,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Menu,
  ArrowUp,
  ArrowDown,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";

// TypeScript Interfaces
interface Role {
  id: number;
  title: string;
  department: string;
  location: string;
  status: string;
  candidates: number;
  shortlisted: number;
  interviewed: number;
  created: string;
  salary: string;
  priority: string;
  deiScore: number;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  shortlistedCandidates?: ShortlistedCandidate[];
}

interface ShortlistedCandidate {
  id: number;
  name: string;
  email: string;
  location: string;
  experience: string;
  skills: string[];
  aiMatch: number;
  source: string;
  applied: string;
  avatar: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  notes?: string;
  interviewStage:
    | "shortlisted"
    | "screening_scheduled"
    | "screening_completed"
    | "technical_scheduled"
    | "technical_completed"
    | "final_scheduled"
    | "final_completed"
    | "offer_made"
    | "hired"
    | "rejected";
  interviewHistory: InterviewRecord[];
  lastUpdated: string;
}

interface InterviewRecord {
  id: number;
  type: "screening" | "technical" | "cultural" | "final";
  status: "scheduled" | "completed" | "cancelled";
  date: string;
  interviewer: string;
  feedback?: string;
  rating?: number;
}

interface Candidate {
  id: number;
  name: string;
  role: string;
  email: string;
  location: string;
  experience: string;
  skills: string[];
  aiMatch: number;
  status: string;
  source: string;
  applied: string;
  avatar: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  notes?: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  category: string;
  lastModified: string;
  autoSend: boolean;
  template: string;
  status?: string;
  date?: string;
}

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  startDate: string;
  salary: string;
  manager: string;
  employmentType: string;
  probationPeriod: boolean;
  probationMonths: number;
  employeeId: string;
  documents: Document[];
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

interface MarketData {
  salary: {
    min: number;
    max: number;
    median: number;
  };
  demand: {
    level: string;
    trend: string;
    timeToFill: number;
    competition: string;
  };
  skills: {
    required: string[];
    trending: string[];
  };
}

interface PredictionData {
  successRate: number;
  confidence: number;
  factors: {
    positive: string[];
    risks: string[];
  };
  recommendations: string[];
}

// Utility Functions
const getInterviewStageColor = (stage: string) => {
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

const getInterviewStageLabel = (stage: string) => {
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

// Mock Data
const mockRoles: Role[] = [
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
          {
            id: 1,
            type: "screening",
            status: "completed",
            date: "2024-01-21",
            interviewer: "HR Team",
            feedback: "Great cultural fit, strong communication skills",
            rating: 9,
          },
          {
            id: 2,
            type: "technical",
            status: "completed",
            date: "2024-01-22",
            interviewer: "Tech Lead",
            feedback:
              "Impressive technical skills, solved problems efficiently",
            rating: 8,
          },
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
        interviewHistory: [
          {
            id: 3,
            type: "screening",
            status: "scheduled",
            date: "2024-01-24",
            interviewer: "HR Team",
          },
        ],
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
          {
            id: 4,
            type: "screening",
            status: "completed",
            date: "2024-01-19",
            interviewer: "HR Team",
            rating: 8,
          },
          {
            id: 5,
            type: "technical",
            status: "completed",
            date: "2024-01-21",
            interviewer: "Tech Lead",
            rating: 9,
          },
          {
            id: 6,
            type: "final",
            status: "scheduled",
            date: "2024-01-25",
            interviewer: "Engineering Manager",
          },
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
          {
            id: 7,
            type: "screening",
            status: "completed",
            date: "2024-01-18",
            interviewer: "HR Team",
            rating: 7,
          },
          {
            id: 8,
            type: "technical",
            status: "completed",
            date: "2024-01-20",
            interviewer: "Tech Lead",
            rating: 8,
          },
          {
            id: 9,
            type: "final",
            status: "completed",
            date: "2024-01-22",
            interviewer: "Engineering Manager",
            rating: 8,
          },
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
    description:
      "Join our product team to drive innovation and user experience.",
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
        interviewHistory: [
          {
            id: 10,
            type: "screening",
            status: "completed",
            date: "2024-01-14",
            interviewer: "Product Director",
            rating: 8,
          },
        ],
      },
      {
        id: 7,
        name: "Lisa Park",
        email: "lisa.park@email.com",
        location: "Cambridge, UK",
        experience: "5+ years",
        skills: [
          "Product Management",
          "UX Research",
          "Analytics",
          "Roadmapping",
        ],
        aiMatch: 92,
        source: "Indeed",
        applied: "2024-01-11",
        avatar: "LP",
        interviewStage: "screening_completed",
        lastUpdated: "2024-01-16",
        interviewHistory: [
          {
            id: 11,
            type: "screening",
            status: "completed",
            date: "2024-01-15",
            interviewer: "Product Director",
            rating: 9,
          },
        ],
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
    description:
      "Create beautiful and intuitive user experiences for our products.",
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
        skills: [
          "UX Design",
          "Figma",
          "User Research",
          "Prototyping",
          "Design Systems",
        ],
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

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Senior React Developer",
    email: "alice.johnson@email.com",
    location: "London, UK",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    aiMatch: 94,
    status: "Shortlisted",
    source: "LinkedIn",
    applied: "2024-01-20",
    avatar: "AJ",
    phoneNumber: "+44 20 7946 0958",
    linkedinProfile: "https://linkedin.com/in/alicejohnson",
    notes: "Excellent React skills, previous startup experience",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Frontend Developer",
    email: "bob.smith@email.com",
    location: "Manchester, UK",
    experience: "3+ years",
    skills: ["JavaScript", "React", "CSS", "HTML", "Git"],
    aiMatch: 78,
    status: "Applied",
    source: "Indeed",
    applied: "2024-01-19",
    avatar: "BS",
  },
  {
    id: 3,
    name: "Carol Davis",
    role: "Product Manager",
    email: "carol.davis@email.com",
    location: "Edinburgh, UK",
    experience: "4+ years",
    skills: ["Product Strategy", "Agile", "Analytics", "Figma"],
    aiMatch: 88,
    status: "Interview Scheduled",
    source: "LinkedIn",
    applied: "2024-01-18",
    avatar: "CD",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "UX Designer",
    email: "david.wilson@email.com",
    location: "Bristol, UK",
    experience: "2+ years",
    skills: ["UX Design", "Figma", "User Research", "Prototyping"],
    aiMatch: 82,
    status: "Offer Made",
    source: "Dribbble",
    applied: "2024-01-17",
    avatar: "DW",
  },
];

const mockEmployees: Employee[] = [
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
    documents: [
      {
        id: 1,
        name: "Employment Contract",
        type: "Contract",
        category: "Legal",
        lastModified: "2023-03-15",
        autoSend: false,
        template: "Standard Employment",
        status: "Signed",
        date: "2023-03-15",
      },
    ],
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

const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Employee Handbook",
    type: "Handbook",
    category: "HR",
    lastModified: "2024-01-15",
    autoSend: true,
    template: "Standard Handbook",
  },
  {
    id: 2,
    name: "NDA Template",
    type: "Legal",
    category: "Legal",
    lastModified: "2024-01-10",
    autoSend: false,
    template: "NDA Standard",
  },
];

// Business Profile Data
const businessProfile = {
  companyName: "TechVision Solutions",
  industry: "Technology",
  founded: "2018",
  employees: "150-250",
  headquarters: "London, UK",
  website: "www.techvisionsolutions.com",
  description:
    "TechVision Solutions is a leading technology consultancy that helps businesses transform through innovative digital solutions. We specialize in cloud architecture, AI/ML implementation, and custom software development.",
  mission:
    "To empower businesses with cutting-edge technology solutions that drive growth and innovation.",
  values: [
    "Innovation",
    "Integrity",
    "Collaboration",
    "Excellence",
    "Diversity",
  ],
  services: [
    "Cloud Architecture & Migration",
    "AI/ML Implementation",
    "Custom Software Development",
    "Digital Transformation Consulting",
    "DevOps & Infrastructure",
    "Data Analytics & Visualization",
  ],
  technologies: [
    "AWS",
    "Azure",
    "Google Cloud",
    "React",
    "Node.js",
    "Python",
    "TensorFlow",
    "Kubernetes",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "Next.js",
    "TailwindCSS",
  ],
  clients: [
    "Fortune 500 companies",
    "Government agencies",
    "Healthcare organizations",
    "Financial institutions",
    "E-commerce platforms",
    "SaaS startups",
  ],
  certifications: ["ISO 27001", "SOC 2 Type II", "Cyber Essentials Plus"],
  awards: [
    "Best Tech Employer 2023",
    "Innovation Award 2022",
    "Diversity Champion 2023",
  ],
};

// Component Definitions

// Role Shortlist View Component
const RoleShortlistView = ({
  role,
  onBack,
  onScheduleInterview,
}: {
  role: Role;
  onBack: () => void;
  onScheduleInterview: (candidate: ShortlistedCandidate) => void;
}) => {
  const [filterStage, setFilterStage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("aiMatch");

  const filteredCandidates =
    role.shortlistedCandidates?.filter(
      (candidate) =>
        filterStage === "all" || candidate.interviewStage === filterStage,
    ) || [];

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "aiMatch") return b.aiMatch - a.aiMatch;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "applied")
      return new Date(b.applied).getTime() - new Date(a.applied).getTime();
    if (sortBy === "stage")
      return a.interviewStage.localeCompare(b.interviewStage);
    return 0;
  });

  const updateCandidateStage = (candidateId: number, newStage: string) => {
    // In a real app, this would update the backend
    console.log(`Updating candidate ${candidateId} to stage ${newStage}`);
  };

  const stageOptions = [
    { value: "all", label: "All Stages" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "screening_scheduled", label: "Screening Scheduled" },
    { value: "screening_completed", label: "Screening Complete" },
    { value: "technical_scheduled", label: "Technical Scheduled" },
    { value: "technical_completed", label: "Technical Complete" },
    { value: "final_scheduled", label: "Final Scheduled" },
    { value: "final_completed", label: "Final Complete" },
    { value: "offer_made", label: "Offer Made" },
    { value: "hired", label: "Hired" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            <span>Back to Roles</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {role.title} - Shortlist
            </h1>
            <p className="text-blue-100">
              {role.shortlistedCandidates?.length || 0} candidates shortlisted •{" "}
              {role.department}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            {stageOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-gray-900"
              >
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            <option value="aiMatch" className="text-gray-900">
              Sort by UPhireIQ AI Match
            </option>
            <option value="name" className="text-gray-900">
              Sort by Name
            </option>
            <option value="applied" className="text-gray-900">
              Sort by Applied Date
            </option>
            <option value="stage" className="text-gray-900">
              Sort by Stage
            </option>
          </select>
        </div>
      </div>

      {/* Stage Overview */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interview Pipeline Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* All Candidates Tab */}
          <button
            onClick={() => setFilterStage("all")}
            className={`border rounded-lg p-4 text-center transition-all hover:shadow-md ${
              filterStage === "all"
                ? "bg-blue-100 border-blue-300 ring-2 ring-blue-500 ring-opacity-50"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Users
              className={`w-6 h-6 mx-auto mb-2 ${
                filterStage === "all" ? "text-blue-600" : "text-gray-600"
              }`}
            />
            <p
              className={`text-2xl font-bold ${
                filterStage === "all" ? "text-blue-600" : "text-gray-900"
              }`}
            >
              {role.shortlistedCandidates?.length || 0}
            </p>
            <p
              className={`text-sm ${
                filterStage === "all" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              All
            </p>
          </button>

          {[
            { stage: "shortlisted", label: "Shortlisted", icon: Users },
            {
              stage: "screening_scheduled",
              label: "Screening",
              icon: Calendar,
            },
            { stage: "technical_scheduled", label: "Technical", icon: Brain },
            { stage: "final_scheduled", label: "Final", icon: Star },
            { stage: "offer_made", label: "Offers", icon: Award },
          ].map(({ stage, label, icon: Icon }) => {
            const count =
              role.shortlistedCandidates?.filter(
                (c) =>
                  c.interviewStage === stage ||
                  c.interviewStage ===
                    `${stage.replace("_scheduled", "_completed")}`,
              ).length || 0;
            const colors = getInterviewStageColor(stage);
            const isActive =
              filterStage === stage ||
              filterStage === `${stage.replace("_scheduled", "_completed")}`;

            return (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`border rounded-lg p-4 text-center transition-all hover:shadow-md ${
                  isActive
                    ? `${colors.bg} ${colors.border} ring-2 ring-opacity-50 ${colors.text.replace("text-", "ring-")}`
                    : `${colors.bg} ${colors.border} hover:shadow-lg`
                }`}
              >
                <Icon className={`w-6 h-6 ${colors.text} mx-auto mb-2`} />
                <p className={`text-2xl font-bold ${colors.text}`}>{count}</p>
                <p className={`text-sm ${colors.text}`}>{label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Shortlisted Candidates ({sortedCandidates.length})
          </h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Candidate</span>
          </button>
        </div>

        <div className="space-y-4">
          {sortedCandidates.map((candidate) => {
            const stageColors = getInterviewStageColor(
              candidate.interviewStage,
            );
            const nextInterviews = candidate.interviewHistory.filter(
              (i) => i.status === "scheduled",
            );

            return (
              <div
                key={candidate.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {candidate.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {candidate.name}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${stageColors.bg} ${stageColors.text} ${stageColors.border}`}
                        >
                          {getInterviewStageLabel(candidate.interviewStage)}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {candidate.aiMatch}% match
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <Mail className="w-4 h-4 inline mr-1" />
                            {candidate.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {candidate.location}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Applied: {candidate.applied}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <Award className="w-4 h-4 inline mr-1" />
                            {candidate.experience}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Globe className="w-4 h-4 inline mr-1" />
                            Source: {candidate.source}
                          </p>
                          {nextInterviews.length > 0 && (
                            <p className="text-sm text-orange-600 font-medium">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Next: {nextInterviews[0].type} on{" "}
                              {nextInterviews[0].date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                            +{candidate.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {candidate.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                          <p className="text-sm text-blue-800">
                            {candidate.notes}
                          </p>
                        </div>
                      )}

                      {/* Interview History */}
                      {candidate.interviewHistory.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">
                            Interview History
                          </h5>
                          <div className="space-y-2">
                            {candidate.interviewHistory.map((interview) => (
                              <div
                                key={interview.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      interview.status === "completed"
                                        ? "bg-green-500"
                                        : interview.status === "scheduled"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                                    }`}
                                  ></span>
                                  <span className="capitalize">
                                    {interview.type}
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">
                                    {interview.date}
                                  </span>
                                  {interview.rating && (
                                    <>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-green-600">
                                        {interview.rating}/10
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span
                                  className={`capitalize ${
                                    interview.status === "completed"
                                      ? "text-green-600"
                                      : interview.status === "scheduled"
                                        ? "text-yellow-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {interview.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => onScheduleInterview(candidate)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
                    >
                      <Calendar size={16} />
                      <span>Schedule Interview</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      View Profile
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Send Message
                    </button>
                    <div className="relative">
                      <select
                        value={candidate.interviewStage}
                        onChange={(e) =>
                          updateCandidateStage(candidate.id, e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="shortlisted">Shortlisted</option>
                        <option value="screening_scheduled">
                          Schedule Screening
                        </option>
                        <option value="screening_completed">
                          Screening Complete
                        </option>
                        <option value="technical_scheduled">
                          Schedule Technical
                        </option>
                        <option value="technical_completed">
                          Technical Complete
                        </option>
                        <option value="final_scheduled">Schedule Final</option>
                        <option value="final_completed">Final Complete</option>
                        <option value="offer_made">Make Offer</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Job Details View Component
const JobDetailsView = ({
  role,
  onBack,
}: {
  role: Role;
  onBack: () => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            <span>Back to Roles</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{role.title}</h1>
            <p className="text-blue-100">
              {role.department} • {role.location} • Posted: {role.created}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              role.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {role.status}
          </span>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              role.priority === "High"
                ? "bg-red-100 text-red-800"
                : role.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {role.priority} Priority
          </span>
        </div>
      </div>

      {/* Job Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{role.candidates}</p>
          <p className="text-sm text-gray-600">Total Candidates</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{role.shortlisted}</p>
          <p className="text-sm text-gray-600">Shortlisted</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{role.interviewed}</p>
          <p className="text-sm text-gray-600">Interviewed</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-gray-900">{role.salary}</p>
          <p className="text-sm text-gray-600">Salary Range</p>
        </div>
      </div>

      {/* Job Details Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {role.description ||
                  "We're looking for a talented professional to join our dynamic team. This role offers exciting opportunities to work on cutting-edge projects and contribute to our company's growth."}
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            <ul className="space-y-2">
              {role.requirements ? (
                role.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Bachelor's degree in relevant field
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      3+ years of professional experience
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Strong communication skills
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Benefits & Perks
            </h2>
            <ul className="space-y-2">
              {role.benefits ? (
                role.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Competitive salary and equity package
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Comprehensive health and dental coverage
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Flexible working arrangements
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Professional development opportunities
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Role Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Department</p>
                <p className="text-gray-900">{role.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-gray-900">{role.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Date Posted</p>
                <p className="text-gray-900">{role.created}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Employment Type
                </p>
                <p className="text-gray-900">Full-time</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Experience Level
                </p>
                <p className="text-gray-900">Mid to Senior Level</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Diversity & Inclusion
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">DEI Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${role.deiScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {role.deiScore}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This role meets our diversity and inclusion standards with focus
                on equal opportunity hiring.
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Job Description
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                View Applications
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Share Job Posting
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Close Position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Roles Tab Component
const RolesTab = () => {
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [recruitingRoleId, setRecruitingRoleId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewingShortlist, setViewingShortlist] = useState<Role | null>(null);
  const [schedulingCandidate, setSchedulingCandidate] =
    useState<ShortlistedCandidate | null>(null);
  const [viewingJobDetails, setViewingJobDetails] = useState<Role | null>(null);

  const startRecruitment = (roleId: number) => {
    setRecruitingRoleId(roleId);
    setShowRecruitModal(true);
  };

  const generatePrediction = (role: Role) => {
    setSelectedRole(role);
    setShowPredictionModal(true);
  };

  const viewShortlist = (role: Role) => {
    setViewingShortlist(role);
  };

  const viewJobDetails = (role: Role) => {
    setViewingJobDetails(role);
  };

  const scheduleInterviewFromShortlist = (candidate: ShortlistedCandidate) => {
    setSchedulingCandidate(candidate);
    setShowCalendlyModal(true);
  };

  // If viewing job details, show the job details view
  if (viewingJobDetails) {
    return (
      <JobDetailsView
        role={viewingJobDetails}
        onBack={() => setViewingJobDetails(null)}
      />
    );
  }

  // If viewing shortlist, show the shortlist view
  if (viewingShortlist) {
    return (
      <RoleShortlistView
        role={viewingShortlist}
        onBack={() => setViewingShortlist(null)}
        onScheduleInterview={scheduleInterviewFromShortlist}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Roles</h1>
          <p className="text-blue-100">
            Manage your open positions and recruitment pipeline
          </p>
        </div>
        <button
          onClick={() => setShowNewRoleModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium"
        >
          <Plus size={20} />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {role.title}
                </h3>
                <p className="text-gray-600">
                  {role.department} • {role.location}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {role.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : role.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {role.priority}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {role.created}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Salary</p>
              <p className="text-lg font-bold text-gray-900">{role.salary}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {role.candidates}
                </p>
                <p className="text-sm text-gray-600">Candidates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {role.shortlisted}
                </p>
                <p className="text-sm text-gray-600">Shortlisted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {role.interviewed}
                </p>
                <p className="text-sm text-gray-600">Interviewed</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => viewJobDetails(role)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() => generatePrediction(role)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  UPhireIQ AI Prediction
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => viewShortlist(role)}
                  disabled={
                    !role.shortlistedCandidates ||
                    role.shortlistedCandidates.length === 0
                  }
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Users size={14} />
                  <span>
                    Shortlist ({role.shortlistedCandidates?.length || 0})
                  </span>
                </button>
                <button
                  onClick={() => startRecruitment(role.id)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                >
                  UPhireIQ AI Recruit
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  UPhireIQ AI Match Score
                </span>
                <span className="text-sm font-bold text-green-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = () => {
  // Get total candidates including shortlisted ones from roles
  const getAllCandidatesCount = () => {
    const baseCount = mockCandidates.length;
    let shortlistedCount = 0;

    // Count unique shortlisted candidates from roles
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
          <p className="text-blue-100">
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
            <Briefcase className="w-8 h-8 text-blue-600" />
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
              <p className="text-sm text-blue-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />6 scheduled today
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
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
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Market Intelligence Section */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Market Intelligence
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Salary Insights</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  React Developer
                </span>
                <span className="text-sm text-gray-900">£45k - £85k</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Product Manager
                </span>
                <span className="text-sm text-gray-900">£55k - £90k</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  UX Designer
                </span>
                <span className="text-sm text-gray-900">£40k - £65k</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Market Trends</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    High Demand
                  </p>
                  <p className="text-xs text-gray-600">
                    React & TypeScript skills
                  </p>
                </div>
                <ArrowUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Growing</p>
                  <p className="text-xs text-gray-600">UX/UI Design roles</p>
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Stable</p>
                  <p className="text-xs text-gray-600">Product Management</p>
                </div>
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">23d</p>
              <p className="text-sm text-gray-600">Avg. Time to Fill</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">85%</p>
              <p className="text-sm text-gray-600">Market Competitiveness</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">42</p>
              <p className="text-sm text-gray-600">Active Competitors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
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
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New role created: UX Designer
                </p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
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
                <span className="text-sm font-bold text-blue-600">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
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
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "89%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Employee Retention (1 year)
                </span>
                <span className="text-sm font-bold text-orange-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
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

// Candidates Tab Component
const CandidatesTab = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [schedulingCandidate, setSchedulingCandidate] =
    useState<Candidate | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const openCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetails(true);
  };

  const scheduleInterview = (candidate: Candidate) => {
    setSchedulingCandidate(candidate);
    setShowCalendlyModal(true);
  };

  // Aggregate all candidates from multiple sources
  const getAllCandidates = (): Candidate[] => {
    const allCandidates: Candidate[] = [...mockCandidates];

    // Add shortlisted candidates from roles
    mockRoles.forEach((role) => {
      if (role.shortlistedCandidates) {
        role.shortlistedCandidates.forEach((shortlistedCandidate) => {
          // Convert ShortlistedCandidate to Candidate format and avoid duplicates
          const existingCandidate = allCandidates.find(
            (c) =>
              c.email === shortlistedCandidate.email ||
              c.id === shortlistedCandidate.id,
          );

          if (!existingCandidate) {
            const convertedCandidate: Candidate = {
              id: shortlistedCandidate.id,
              name: shortlistedCandidate.name,
              role: role.title, // Use the role title
              email: shortlistedCandidate.email,
              location: shortlistedCandidate.location,
              experience: shortlistedCandidate.experience,
              skills: shortlistedCandidate.skills,
              aiMatch: shortlistedCandidate.aiMatch,
              status:
                shortlistedCandidate.interviewStage === "shortlisted"
                  ? "Shortlisted"
                  : shortlistedCandidate.interviewStage === "hired"
                    ? "Hired"
                    : shortlistedCandidate.interviewStage.includes("scheduled")
                      ? "Interview Scheduled"
                      : shortlistedCandidate.interviewStage.includes(
                            "completed",
                          )
                        ? "Interview Completed"
                        : shortlistedCandidate.interviewStage === "offer_made"
                          ? "Offer Made"
                          : "In Process",
              source: shortlistedCandidate.source,
              applied: shortlistedCandidate.applied,
              avatar: shortlistedCandidate.avatar,
              phoneNumber: shortlistedCandidate.phoneNumber,
              linkedinProfile: shortlistedCandidate.linkedinProfile,
              githubProfile: shortlistedCandidate.githubProfile,
              portfolio: shortlistedCandidate.portfolio,
              notes: shortlistedCandidate.notes,
            };
            allCandidates.push(convertedCandidate);
          }
        });
      }
    });

    return allCandidates;
  };

  const allCandidates = getAllCandidates();

  const filteredCandidates =
    filterStatus === "All"
      ? allCandidates
      : allCandidates.filter((c) => c.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Candidates</h1>
          <p className="text-blue-100">
            Manage your candidate pipeline and applications
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            <option value="All" className="text-gray-900">
              All Status
            </option>
            <option value="Applied" className="text-gray-900">
              Applied
            </option>
            <option value="Shortlisted" className="text-gray-900">
              Shortlisted
            </option>
            <option value="Interview Scheduled" className="text-gray-900">
              Interview Scheduled
            </option>
            <option value="Interview Completed" className="text-gray-900">
              Interview Completed
            </option>
            <option value="Offer Made" className="text-gray-900">
              Offer Made
            </option>
            <option value="In Process" className="text-gray-900">
              In Process
            </option>
          </select>
          <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Candidates Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Candidates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {allCandidates.length}
              </p>
            </div>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {allCandidates.filter((c) => c.status === "Shortlisted").length}
              </p>
            </div>
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  allCandidates.filter(
                    (c) =>
                      c.status === "Interview Scheduled" ||
                      c.status === "Interview Completed",
                  ).length
                }
              </p>
            </div>
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg UPhireIQ AI Match
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {allCandidates.length > 0
                  ? Math.round(
                      allCandidates.reduce((acc, c) => acc + c.aiMatch, 0) /
                        allCandidates.length,
                    )
                  : 0}
                %
              </p>
            </div>
            <img
              src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
              alt="UPhireIQ AI"
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {candidate.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-600">{candidate.role}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  candidate.status === "Shortlisted"
                    ? "bg-yellow-100 text-yellow-800"
                    : candidate.status === "Applied"
                      ? "bg-blue-100 text-blue-800"
                      : candidate.status === "Interview Scheduled"
                        ? "bg-purple-100 text-purple-800"
                        : candidate.status === "Interview Completed"
                          ? "bg-indigo-100 text-indigo-800"
                          : candidate.status === "Offer Made"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                }`}
              >
                {candidate.status}
              </span>
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-600">
                <Mail className="w-4 h-4 inline mr-2" />
                {candidate.email}
              </p>
              <p className="text-sm text-gray-600">
                <MapPin className="w-4 h-4 inline mr-2" />
                {candidate.location}
              </p>
              <p className="text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-2" />
                Applied: {candidate.applied}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  UPhireIQ AI Match Score
                </span>
                <span className="text-sm font-bold text-green-600">
                  {candidate.aiMatch}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${candidate.aiMatch}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => openCandidateDetails(candidate)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => scheduleInterview(candidate)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Schedule Interview
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Send Message
                </button>
                <button className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simplified Other Tab Components
const AnalyticsTab = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      <p className="text-blue-100">
        Recruitment insights and performance metrics
      </p>
    </div>
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <p className="text-gray-600">Analytics dashboard coming soon...</p>
    </div>
  </div>
);

const EmployeesTab = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white">Employee Management</h1>
      <p className="text-blue-100">
        Comprehensive team management and HR records
      </p>
    </div>
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <p className="text-gray-600">Employee management coming soon...</p>
    </div>
  </div>
);

const DocumentsTab = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white">Document Management</h1>
      <p className="text-blue-100">
        Manage contracts, handbooks, and HR documents
      </p>
    </div>
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <p className="text-gray-600">Document management coming soon...</p>
    </div>
  </div>
);

const SavingsTab = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white">Cost Savings</h1>
      <p className="text-blue-100">Track recruitment ROI and cost efficiency</p>
    </div>
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <p className="text-gray-600">Cost savings analytics coming soon...</p>
    </div>
  </div>
);

const MyBusinessTab = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white">My Business</h1>
      <p className="text-blue-100">Company profile and settings</p>
    </div>
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Company Name</p>
              <p className="text-gray-900">{businessProfile.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Industry</p>
              <p className="text-gray-900">{businessProfile.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Founded</p>
              <p className="text-gray-900">{businessProfile.founded}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-gray-900">{businessProfile.employees}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
          <p className="text-gray-700">{businessProfile.description}</p>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const UPhirePlatform = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    initials: "",
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "savings", label: "Savings", icon: DollarSign },
    { id: "business", label: "My Business", icon: Building },
  ];

  const breadcrumbs = [
    "UPhire",
    ...(tabs
      .find((tab) => tab.id === activeTab)
      ?.label.toLowerCase()
      .split(" ") || []),
  ];

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Mock authentication
    setUser({
      name: "John Smith",
      email: credentials.email,
      role: "HR Manager",
      initials: "JS",
    });
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "roles":
        return <RolesTab />;
      case "candidates":
        return <CandidatesTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "employees":
        return <EmployeesTab />;
      case "documents":
        return <DocumentsTab />;
      case "savings":
        return <SavingsTab />;
      case "business":
        return <MyBusinessTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* Logo - Always Visible */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <img
                  src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-logo-no-background-pink-text-72849d?format=webp&width=800"
                  alt="UPhire Logo"
                  className="h-10 w-auto block"
                />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-white bg-opacity-20 text-white"
                          : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all"
                  >
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{user.initials}</span>
                    </div>
                    <span className="hidden sm:block">{user.name}</span>
                    <ChevronDown size={16} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                      <div className="p-3 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      <div className="py-1">
                        <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Settings size={16} />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setActiveTab("business");
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Factory size={16} />
                          <span>My Business</span>
                        </button>
                        <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <HelpCircle size={16} />
                          <span>Help & Support</span>
                        </button>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={() => {
                            setIsLoggedIn(false);
                            setUser({
                              name: "",
                              email: "",
                              role: "",
                              initials: "",
                            });
                            setShowUserDropdown(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white bg-opacity-20 text-white"
                        : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        {isLoggedIn && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-t border-white border-opacity-10">
            <nav className="text-sm">
              <span className="text-blue-100">
                {breadcrumbs.map((segment, index) => (
                  <span key={index}>
                    {index === 0
                      ? segment
                      : ` / ${segment.charAt(0).toUpperCase() + segment.slice(1)}`}
                  </span>
                ))}
              </span>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoggedIn ? (
          renderTabContent()
        ) : (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Welcome to UPhire
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                The UPhireIQ AI-powered recruitment platform that revolutionizes
                how you find, engage, and hire top talent with advanced
                automation and market intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <img
                  src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                  alt="UPhireIQ AI Logo"
                  className="h-10 mx-auto mb-4 object-contain"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Recruitment
                </h3>
                <p className="text-gray-600">
                  4-stage UPhireIQ AI recruitment automation across LinkedIn,
                  Indeed, GitHub, and more platforms with intelligent candidate
                  ranking.
                </p>
              </div>

              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Intelligence
                </h3>
                <p className="text-gray-600">
                  Real-time salary data, market demand analysis, and competitive
                  insights with ITJobsWatch API integration.
                </p>
              </div>

              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Complete HR Suite
                </h3>
                <p className="text-gray-600">
                  Comprehensive employee management, probation tracking,
                  document management, and Calendly interview scheduling.
                </p>
              </div>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Platform Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    UPhireIQ AI Success Prediction
                  </p>
                  <p className="text-sm text-gray-600">
                    Role success analysis and recommendations
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    Calendly Integration
                  </p>
                  <p className="text-sm text-gray-600">
                    Automated interview scheduling
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    Document Management
                  </p>
                  <p className="text-sm text-gray-600">
                    Secure employee document storage
                  </p>
                </div>
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Cost Savings</p>
                  <p className="text-sm text-gray-600">
                    Track recruitment ROI and savings
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all text-lg font-medium"
            >
              Get Started Today
            </button>
          </div>
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sign In to UPhire
                </h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleLogin({
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                Demo credentials: any email/password combination
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPhirePlatform;
