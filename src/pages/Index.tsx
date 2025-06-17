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
  const stageLabels: { [key: string]: string } = {
    shortlisted: "Shortlisted",
    screening_scheduled: "Screening Scheduled",
    screening_completed: "Screening Complete",
    technical_scheduled: "Technical Scheduled",
    technical_completed: "Technical Complete",
    final_scheduled: "Final Interview Scheduled",
    final_completed: "Final Interview Complete",
    offer_made: "Offer Made",
    hired: "Hired",
    rejected: "Rejected",
  };
  return stageLabels[stage] || "Unknown";
};

// Mock Data
const mockRoles: Role[] = [
  {
    id: 1,
    title: "Senior React Developer",
    department: "Engineering",
    location: "London, UK",
    status: "Active",
    candidates: 24,
    shortlisted: 8,
    interviewed: 3,
    created: "2024-01-15",
    salary: "£60,000 - £80,000",
    priority: "High",
    deiScore: 8.5,
    description:
      "We're looking for a Senior React Developer to join our dynamic engineering team.",
    requirements: [
      "5+ years React experience",
      "TypeScript proficiency",
      "Team leadership experience",
    ],
    benefits: ["Flexible working", "Health insurance", "Learning budget"],
    shortlistedCandidates: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        location: "London, UK",
        experience: "5+ years",
        skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
        aiMatch: 92,
        source: "LinkedIn",
        applied: "2024-01-20",
        avatar: "AJ",
        phoneNumber: "+44 20 7946 0958",
        linkedinProfile: "https://linkedin.com/in/alicejohnson",
        githubProfile: "https://github.com/alicejohnson",
        portfolio: "https://alicejohnson.dev",
        notes: "Strong technical background, excellent communication skills.",
        interviewStage: "technical_completed",
        lastUpdated: "2024-01-22",
        interviewHistory: [
          {
            id: 1,
            type: "screening",
            status: "completed",
            date: "2024-01-21",
            interviewer: "HR Team",
            feedback: "Excellent communication, strong cultural fit",
            rating: 9,
          },
          {
            id: 2,
            type: "technical",
            status: "completed",
            date: "2024-01-22",
            interviewer: "Senior Developer",
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
        name: "James Chen",
        email: "james.chen@email.com",
        location: "Leeds, UK",
        experience: "7+ years",
        skills: ["React", "TypeScript", "GraphQL", "AWS", "Microservices"],
        aiMatch: 94,
        source: "LinkedIn",
        applied: "2024-01-17",
        avatar: "JC",
        phoneNumber: "+44 113 496 0058",
        linkedinProfile: "https://linkedin.com/in/jameschen",
        notes: "Senior level experience, architecture expertise",
        interviewStage: "final_scheduled",
        lastUpdated: "2024-01-23",
        interviewHistory: [
          {
            id: 4,
            type: "screening",
            status: "completed",
            date: "2024-01-20",
            interviewer: "HR Team",
            feedback: "Excellent experience and communication",
            rating: 9,
          },
          {
            id: 5,
            type: "technical",
            status: "completed",
            date: "2024-01-22",
            interviewer: "Tech Lead",
            feedback: "Outstanding technical knowledge and problem-solving",
            rating: 10,
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
        location: "Remote, UK",
        experience: "5+ years",
        skills: ["React", "TypeScript", "Next.js", "Tailwind", "Figma"],
        aiMatch: 87,
        source: "AngelList",
        applied: "2024-01-16",
        avatar: "ET",
        phoneNumber: "+44 20 7946 0789",
        portfolio: "https://emmathompson.design",
        notes: "Strong design background, excellent React skills",
        interviewStage: "offer_made",
        lastUpdated: "2024-01-24",
        interviewHistory: [
          {
            id: 7,
            type: "screening",
            status: "completed",
            date: "2024-01-19",
            interviewer: "HR Team",
            feedback: "Great personality, strong motivation",
            rating: 8,
          },
          {
            id: 8,
            type: "technical",
            status: "completed",
            date: "2024-01-21",
            interviewer: "Senior Developer",
            feedback: "Solid technical skills with design flair",
            rating: 8,
          },
          {
            id: 9,
            type: "final",
            status: "completed",
            date: "2024-01-23",
            interviewer: "Engineering Manager",
            feedback: "Perfect fit for the team, recommend hire",
            rating: 9,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    status: "Active",
    candidates: 18,
    shortlisted: 5,
    interviewed: 2,
    created: "2024-01-10",
    salary: "£70,000 - £90,000",
    priority: "Medium",
    deiScore: 9.2,
    description:
      "Join our product team to drive strategic initiatives and user experience improvements.",
    requirements: [
      "Product management experience",
      "Data-driven approach",
      "Stakeholder management",
    ],
    benefits: ["Remote work", "Equity options", "Professional development"],
    shortlistedCandidates: [
      {
        id: 6,
        name: "Michael Foster",
        email: "michael.foster@email.com",
        location: "London, UK",
        experience: "6+ years",
        skills: [
          "Product Strategy",
          "Analytics",
          "User Research",
          "Agile",
          "SQL",
        ],
        aiMatch: 91,
        source: "LinkedIn",
        applied: "2024-01-12",
        avatar: "MF",
        phoneNumber: "+44 20 7946 1234",
        linkedinProfile: "https://linkedin.com/in/michaelfoster",
        notes: "Strong product background at fintech companies",
        interviewStage: "technical_scheduled",
        lastUpdated: "2024-01-21",
        interviewHistory: [
          {
            id: 10,
            type: "screening",
            status: "completed",
            date: "2024-01-19",
            interviewer: "HR Team",
            feedback: "Passionate about product, good cultural fit",
            rating: 8,
          },
          {
            id: 11,
            type: "technical",
            status: "scheduled",
            date: "2024-01-25",
            interviewer: "Senior Product Manager",
          },
        ],
      },
      {
        id: 7,
        name: "Lisa Wang",
        email: "lisa.wang@email.com",
        location: "Edinburgh, UK",
        experience: "4+ years",
        skills: [
          "Product Management",
          "UX Research",
          "Data Analysis",
          "Roadmapping",
        ],
        aiMatch: 88,
        source: "Indeed",
        applied: "2024-01-11",
        avatar: "LW",
        phoneNumber: "+44 131 496 0058",
        notes: "UX background transitioning to product management",
        interviewStage: "screening_completed",
        lastUpdated: "2024-01-20",
        interviewHistory: [
          {
            id: 12,
            type: "screening",
            status: "completed",
            date: "2024-01-20",
            interviewer: "HR Team",
            feedback: "Strong analytical skills, good communication",
            rating: 7,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Manchester, UK",
    status: "Draft",
    candidates: 12,
    shortlisted: 3,
    interviewed: 1,
    created: "2024-01-20",
    salary: "£45,000 - £65,000",
    priority: "Low",
    deiScore: 7.8,
    description:
      "Creative UX Designer needed to enhance our user experience across all platforms.",
    requirements: [
      "UX design portfolio",
      "Figma expertise",
      "User research experience",
    ],
    benefits: [
      "Creative environment",
      "Latest design tools",
      "Conference attendance",
    ],
    shortlistedCandidates: [
      {
        id: 8,
        name: "Carol Williams",
        email: "carol.williams@email.com",
        location: "Birmingham, UK",
        experience: "4+ years",
        skills: [
          "UX Design",
          "Figma",
          "User Research",
          "Prototyping",
          "Design Systems",
        ],
        aiMatch: 85,
        source: "Company Website",
        applied: "2024-01-22",
        avatar: "CW",
        phoneNumber: "+44 121 496 0058",
        portfolio: "https://carolwilliams.design",
        notes: "Creative designer with strong research background",
        interviewStage: "screening_scheduled",
        lastUpdated: "2024-01-23",
        interviewHistory: [
          {
            id: 13,
            type: "screening",
            status: "scheduled",
            date: "2024-01-26",
            interviewer: "Design Manager",
          },
        ],
      },
      {
        id: 9,
        name: "Alex Kumar",
        email: "alex.kumar@email.com",
        location: "Manchester, UK",
        experience: "3+ years",
        skills: ["UI/UX Design", "Adobe Creative Suite", "Sketch", "InVision"],
        aiMatch: 82,
        source: "Dribbble",
        applied: "2024-01-21",
        avatar: "AK",
        portfolio: "https://alexkumar.portfolio.com",
        notes: "Strong visual design skills, junior but promising",
        interviewStage: "shortlisted",
        lastUpdated: "2024-01-21",
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
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    aiMatch: 92,
    status: "Interview Scheduled",
    source: "LinkedIn",
    applied: "2024-01-20",
    avatar: "AJ",
    phoneNumber: "+44 20 7946 0958",
    linkedinProfile: "https://linkedin.com/in/alicejohnson",
    githubProfile: "https://github.com/alicejohnson",
    portfolio: "https://alicejohnson.dev",
    notes: "Strong technical background, excellent communication skills.",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Product Manager",
    email: "bob.smith@email.com",
    location: "Manchester, UK",
    experience: "7+ years",
    skills: [
      "Product Strategy",
      "Agile",
      "Analytics",
      "User Research",
      "Roadmapping",
    ],
    aiMatch: 88,
    status: "Shortlisted",
    source: "Indeed",
    applied: "2024-01-18",
    avatar: "BS",
    phoneNumber: "+44 161 496 0058",
    linkedinProfile: "https://linkedin.com/in/bobsmith",
    notes:
      "Excellent product sense, proven track record of successful launches.",
  },
  {
    id: 3,
    name: "Carol Williams",
    role: "UX Designer",
    email: "carol.williams@email.com",
    location: "Birmingham, UK",
    experience: "4+ years",
    skills: [
      "UX Design",
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    aiMatch: 85,
    status: "Applied",
    source: "Company Website",
    applied: "2024-01-22",
    avatar: "CW",
    phoneNumber: "+44 121 496 0058",
    portfolio: "https://carolwilliams.design",
    notes: "Creative designer with strong research background.",
  },
];

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Sarah Wilson",
    position: "Senior Developer",
    department: "Engineering",
    startDate: "2023-06-15",
    salary: "£75,000",
    manager: "Tech Lead",
    employmentType: "Full-Time",
    probationPeriod: false,
    probationMonths: 6,
    employeeId: "EMP001",
    email: "sarah.wilson@company.com",
    phoneNumber: "+44 20 7946 0123",
    documents: [
      {
        id: 1,
        name: "Employment Contract",
        type: "Contract",
        category: "Employment",
        lastModified: "2023-06-15",
        autoSend: false,
        template: "Standard",
        status: "Signed",
        date: "2023-06-15",
      },
      {
        id: 2,
        name: "ID Verification",
        type: "Identification",
        category: "Verification",
        lastModified: "2023-06-15",
        autoSend: false,
        template: "Standard",
        status: "Complete",
        date: "2023-06-15",
      },
      {
        id: 3,
        name: "Right to Work",
        type: "Legal",
        category: "Compliance",
        lastModified: "2023-06-15",
        autoSend: false,
        template: "Standard",
        status: "Valid",
        date: "2023-06-15",
      },
    ],
  },
  {
    id: 2,
    name: "Mike Chen",
    position: "Junior Developer",
    department: "Engineering",
    startDate: "2024-01-10",
    salary: "£45,000",
    manager: "Senior Developer",
    employmentType: "Full-Time",
    probationPeriod: true,
    probationMonths: 3,
    employeeId: "EMP002",
    email: "mike.chen@company.com",
    phoneNumber: "+44 20 7946 0456",
    documents: [
      {
        id: 4,
        name: "Employment Contract",
        type: "Contract",
        category: "Employment",
        lastModified: "2024-01-10",
        autoSend: false,
        template: "Standard",
        status: "Signed",
        date: "2024-01-10",
      },
      {
        id: 5,
        name: "Medical Certificate",
        type: "Medical",
        category: "Health",
        lastModified: "2024-01-12",
        autoSend: false,
        template: "Standard",
        status: "Pending",
        date: "2024-01-12",
      },
    ],
  },
  {
    id: 3,
    name: "Emma Davis",
    position: "Product Designer",
    department: "Design",
    startDate: "2023-09-01",
    salary: "£55,000",
    manager: "Design Manager",
    employmentType: "Full-Time",
    probationPeriod: false,
    probationMonths: 6,
    employeeId: "EMP003",
    email: "emma.davis@company.com",
    phoneNumber: "+44 20 7946 0789",
    documents: [
      {
        id: 6,
        name: "Employment Contract",
        type: "Contract",
        category: "Employment",
        lastModified: "2023-09-01",
        autoSend: false,
        template: "Standard",
        status: "Signed",
        date: "2023-09-01",
      },
    ],
  },
];

const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Job Description Template",
    type: "Template",
    category: "Recruitment",
    lastModified: "2024-01-15",
    autoSend: false,
    template: "Job Description",
  },
  {
    id: 2,
    name: "Interview Guide",
    type: "Guide",
    category: "Interview",
    lastModified: "2024-01-10",
    autoSend: true,
    template: "Interview",
  },
  {
    id: 3,
    name: "Offer Letter Template",
    type: "Template",
    category: "Offers",
    lastModified: "2024-01-08",
    autoSend: true,
    template: "Offer Letter",
  },
];

// Business Profile Data
const businessProfile = {
  name: "TechVision Solutions",
  industry: "Technology & Software Development",
  location: "London, UK",
  size: "50-200 employees",
  founded: "2018",
  website: "https://techvision.com",
  description:
    "Leading software development company specializing in enterprise solutions and AI-powered applications. We deliver cutting-edge technology solutions that transform businesses and drive digital excellence across multiple industries.",
  mission:
    "To deliver innovative technology solutions that transform businesses and drive digital excellence while fostering a culture of continuous learning and innovation.",
  culture:
    "We foster a collaborative, inclusive environment where creativity thrives and every team member can grow their potential. Our culture emphasizes work-life balance, continuous learning, and meaningful contribution to impactful projects.",
  values: [
    "Innovation",
    "Excellence",
    "Collaboration",
    "Integrity",
    "Growth",
    "Diversity",
  ],
  benefits: {
    health:
      "Comprehensive health insurance including dental and vision coverage for employees and families",
    retirement:
      "Competitive pension scheme with 6% company matching and immediate vesting",
    vacation:
      "25 days annual leave plus bank holidays, with additional days for tenure",
    development:
      "£2,000 annual learning and development budget for courses, conferences, and certifications",
    flexibility:
      "Flexible working hours and hybrid work options with core collaboration hours",
    wellness:
      "Mental health support, wellness programs, and on-site fitness facilities",
    technology:
      "Latest technology and equipment provided including MacBook Pro and choice of peripherals",
    social:
      "Regular team events, quarterly all-hands meetings, and annual company retreats",
    equity: "Employee stock option plan for all permanent employees",
    parentalLeave:
      "Enhanced parental leave policies beyond statutory requirements",
  },
  techStack: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
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

        {sortedCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600">
              {filterStage === "all"
                ? "No candidates have been shortlisted for this role yet."
                : `No candidates in "${stageOptions.find((s) => s.value === filterStage)?.label}" stage.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Market Intelligence Component
const MarketIntelligence = () => {
  const [searchForm, setSearchForm] = useState({
    jobTitle: "",
    location: "London, UK",
  });
  const [lastSearchResults, setLastSearchResults] = useState<MarketData | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const generateRealisticSalary = (title: string) => {
    const salaryRanges: {
      [key: string]: { min: number; max: number; median: number };
    } = {
      "react developer": { min: 45000, max: 85000, median: 65000 },
      "senior react developer": { min: 60000, max: 95000, median: 77500 },
      "product manager": { min: 55000, max: 90000, median: 72500 },
      "ux designer": { min: 40000, max: 70000, median: 55000 },
      "data scientist": { min: 50000, max: 100000, median: 75000 },
      "devops engineer": { min: 55000, max: 95000, median: 75000 },
    };

    const key = title.toLowerCase();
    const match = Object.keys(salaryRanges).find((k) => key.includes(k));
    return match
      ? salaryRanges[match]
      : { min: 40000, max: 80000, median: 60000 };
  };

  const getMarketDemand = (title: string) => {
    const demandLevels = ["Low", "Moderate", "High", "Very High"];
    const trends = ["Declining", "Stable", "Growing", "Rapidly Growing"];
    const timeToFill = Math.floor(Math.random() * 30) + 15;
    const competitionLevels = ["Low", "Moderate", "High", "Very High"];

    return {
      level: demandLevels[Math.floor(Math.random() * demandLevels.length)],
      trend: trends[Math.floor(Math.random() * trends.length)],
      timeToFill,
      competition:
        competitionLevels[Math.floor(Math.random() * competitionLevels.length)],
    };
  };

  const searchMarketData = async () => {
    if (!searchForm.jobTitle.trim()) return;

    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const salary = generateRealisticSalary(searchForm.jobTitle);
    const demand = getMarketDemand(searchForm.jobTitle);

    const skills = {
      required: ["Communication", "Problem Solving", "Teamwork"],
      trending: ["AI/ML", "Cloud Computing", "Remote Collaboration"],
    };

    if (searchForm.jobTitle.toLowerCase().includes("react")) {
      skills.required.push("React", "JavaScript", "HTML/CSS");
      skills.trending.push("Next.js", "TypeScript", "GraphQL");
    } else if (searchForm.jobTitle.toLowerCase().includes("product")) {
      skills.required.push("Product Strategy", "Analytics", "User Research");
      skills.trending.push(
        "Product-Led Growth",
        "Data Analysis",
        "A/B Testing",
      );
    } else if (searchForm.jobTitle.toLowerCase().includes("ux")) {
      skills.required.push("UX Design", "Figma", "User Research");
      skills.trending.push("Design Systems", "Accessibility", "Voice UI");
    }

    const marketData: MarketData = {
      salary,
      demand,
      skills,
    };

    setLastSearchResults(marketData);
    setIsSearching(false);
  };

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <span>ITJobsWatch Market Intelligence</span>
      </h3>

      {/* Quick Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={searchForm.jobTitle}
            onChange={(e) =>
              setSearchForm((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
            placeholder="e.g. Senior React Developer"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            value={searchForm.location}
            onChange={(e) =>
              setSearchForm((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="London, UK">London, UK</option>
            <option value="Manchester, UK">Manchester, UK</option>
            <option value="Birmingham, UK">Birmingham, UK</option>
            <option value="Edinburgh, UK">Edinburgh, UK</option>
            <option value="Remote, UK">Remote, UK</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={searchMarketData}
          disabled={isSearching || !searchForm.jobTitle.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isSearching ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{isSearching ? "Searching..." : "Search Market Data"}</span>
        </button>

        {/* Quick search buttons */}
        {[
          "React Developer",
          "Product Manager",
          "UX Designer",
          "Data Scientist",
        ].map((title) => (
          <button
            key={title}
            onClick={() => {
              setSearchForm((prev) => ({ ...prev, jobTitle: title }));
              setTimeout(() => searchMarketData(), 100);
            }}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {title}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {lastSearchResults && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Market Data for "{searchForm.jobTitle}"
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Salary Range
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                £{lastSearchResults.salary.min.toLocaleString()} - £
                {lastSearchResults.salary.max.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Median: £{lastSearchResults.salary.median.toLocaleString()}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Market Demand
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {lastSearchResults.demand.level}
              </div>
              <div className="text-sm text-gray-600">
                {lastSearchResults.demand.trend} trend
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">
                  Time to Fill
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {lastSearchResults.demand.timeToFill} days
              </div>
              <div className="text-sm text-gray-600">
                Competition: {lastSearchResults.demand.competition}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">
                  Action
                </span>
              </div>
              <button className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors">
                Create Role
              </button>
              <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors ml-2">
                Export
              </button>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                Required Skills
              </h5>
              <div className="flex flex-wrap gap-2">
                {lastSearchResults.skills.required.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-blue-100">
          Welcome to your AI-powered recruitment platform
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
              {mockCandidates.length}
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
    <MarketIntelligence />

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
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {role.title}
                </h3>
                <p className="text-gray-600">
                  {role.department} • {role.location}
                </p>
                <p className="text-green-600 font-medium">{role.salary}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : role.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {role.priority} Priority
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    DEI Score: {role.deiScore}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  role.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : role.status === "Draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {role.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {role.candidates}
                </p>
                <p className="text-sm text-gray-600">Candidates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
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
                  AI Prediction
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
                  AI Recruit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showRecruitModal && (
        <RecruitModal
          showRecruitModal={showRecruitModal}
          setShowRecruitModal={setShowRecruitModal}
          recruitingRoleId={recruitingRoleId}
        />
      )}

      {showPredictionModal && selectedRole && (
        <PredictionModal
          showPredictionModal={showPredictionModal}
          setShowPredictionModal={setShowPredictionModal}
          selectedRole={selectedRole}
        />
      )}

      {showNewRoleModal && (
        <NewRoleModal
          showNewRoleModal={showNewRoleModal}
          setShowNewRoleModal={setShowNewRoleModal}
        />
      )}

      {/* Calendly Modal for Shortlist Interview Scheduling */}
      {showCalendlyModal && schedulingCandidate && (
        <CalendlyModal
          candidate={{
            ...schedulingCandidate,
            role: viewingShortlist?.title || "Unknown Role",
            status: getInterviewStageLabel(schedulingCandidate.interviewStage),
          }}
          isOpen={showCalendlyModal}
          onClose={() => {
            setShowCalendlyModal(false);
            setSchedulingCandidate(null);
          }}
        />
      )}
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

  const filteredCandidates =
    filterStatus === "All"
      ? mockCandidates
      : mockCandidates.filter((c) => c.status === filterStatus);

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
            <option value="Offer Made" className="text-gray-900">
              Offer Made
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
                {mockCandidates.length}
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
                {
                  mockCandidates.filter((c) => c.status === "Shortlisted")
                    .length
                }
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
                  mockCandidates.filter(
                    (c) => c.status === "Interview Scheduled",
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
                {Math.round(
                  mockCandidates.reduce((acc, c) => acc + c.aiMatch, 0) /
                    mockCandidates.length,
                )}
                %
              </p>
            </div>
            <Brain className="w-6 h-6 text-green-600" />
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
                  <p className="text-sm text-gray-500">{candidate.location}</p>
                  <p className="text-sm text-gray-500">
                    {candidate.experience}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  candidate.status === "Interview Scheduled"
                    ? "bg-purple-100 text-purple-800"
                    : candidate.status === "Shortlisted"
                      ? "bg-blue-100 text-blue-800"
                      : candidate.status === "Applied"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-green-100 text-green-800"
                }`}
              >
                {candidate.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  UPhireIQ AI Match Score
                </span>
                <span className="text-sm font-bold text-green-600">
                  {candidate.aiMatch}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    candidate.aiMatch >= 90
                      ? "bg-green-500"
                      : candidate.aiMatch >= 80
                        ? "bg-blue-500"
                        : candidate.aiMatch >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${candidate.aiMatch}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                  +{candidate.skills.length - 3} more
                </span>
              )}
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

      {/* Candidate Details Modal */}
      {showCandidateDetails && selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          isOpen={showCandidateDetails}
          onClose={() => setShowCandidateDetails(false)}
        />
      )}

      {/* Calendly Scheduling Modal */}
      {showCalendlyModal && schedulingCandidate && (
        <CalendlyModal
          candidate={schedulingCandidate}
          isOpen={showCalendlyModal}
          onClose={() => setShowCalendlyModal(false)}
        />
      )}
    </div>
  );
};

// Employees Tab Component
const EmployeesTab = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const employeesOnProbation = mockEmployees.filter(
    (emp) => emp.probationPeriod,
  );
  const fullTimeEmployees = mockEmployees.filter(
    (emp) => emp.employmentType === "Full-Time",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Management</h1>
          <p className="text-blue-100">
            Comprehensive team management and HR records
          </p>
        </div>
        <button
          onClick={() => setShowEmployeeModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {mockEmployees.length}
              </p>
              <p className="text-sm text-green-600">Active workforce</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Probation</p>
              <p className="text-3xl font-bold text-gray-900">
                {employeesOnProbation.length}
              </p>
              <p className="text-sm text-yellow-600">Require review</p>
            </div>
            <Timer className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Full-Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {fullTimeEmployees.length}
              </p>
              <p className="text-sm text-green-600">Permanent staff</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Reviews
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {employeesOnProbation.length + 1}
              </p>
              <p className="text-sm text-purple-600">Action needed</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Employee Directory */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Directory
          </h3>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Search size={16} />
              <span>Search</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockEmployees.map((employee) => {
            const startDate = new Date(employee.startDate);
            const today = new Date();
            const tenure = Math.floor(
              (today.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24 * 30),
            );

            const probationEndDate = new Date(startDate);
            probationEndDate.setMonth(
              probationEndDate.getMonth() + (employee.probationMonths || 6),
            );
            const probationDaysLeft = Math.ceil(
              (probationEndDate.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            return (
              <div
                key={employee.id}
                onClick={() => openEmployeeDetails(employee)}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {employee.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{employee.name}</h4>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <p className="text-xs text-gray-500">
                    {employee.department} • {tenure} months tenure
                  </p>
                  {employee.probationPeriod && (
                    <p className="text-xs text-yellow-600">
                      Probation:{" "}
                      {probationDaysLeft > 0
                        ? `${probationDaysLeft} days left`
                        : "Overdue review"}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {employee.salary}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      employee.probationPeriod
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {employee.probationPeriod ? "Probation" : "Confirmed"}
                  </span>
                  <div className="mt-1 flex space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${employee.documents.length >= 3 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {employee.documents.length} docs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee Modal */}
      {showEmployeeModal && selectedEmployee && (
        <EmployeeModal
          showEmployeeModal={showEmployeeModal}
          setShowEmployeeModal={setShowEmployeeModal}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          setShowDocumentUploadModal={setShowDocumentUploadModal}
        />
      )}

      {/* Document Upload Modal */}
      {showDocumentUploadModal && selectedEmployee && (
        <DocumentUploadModal
          employee={selectedEmployee}
          isOpen={showDocumentUploadModal}
          onClose={() => setShowDocumentUploadModal(false)}
        />
      )}
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-blue-100">
          Comprehensive recruitment and HR analytics
        </p>
      </div>
      <div className="flex space-x-3">
        <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
          <Download size={16} />
          <span>Export</span>
        </button>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Time to Hire</p>
            <p className="text-3xl font-bold text-gray-900">23 days</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowDown className="w-4 h-4 mr-1" />
              -15% vs last month
            </p>
          </div>
          <Clock className="w-8 h-8 text-blue-600" />
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
          <DollarSign className="w-8 h-8 text-green-600" />
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
            <p className="text-sm font-medium text-gray-600">Retention Rate</p>
            <p className="text-3xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              +2% vs last quarter
            </p>
          </div>
          <UserCheck className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>

    {/* Charts and Detailed Analytics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Source Performance
        </h3>
        <div className="space-y-4">
          {[
            { source: "LinkedIn", applications: 156, quality: 8.9, cost: 2100 },
            { source: "Indeed", applications: 89, quality: 7.2, cost: 1800 },
            {
              source: "Company Website",
              applications: 67,
              quality: 9.1,
              cost: 450,
            },
            { source: "Referrals", applications: 23, quality: 9.5, cost: 300 },
            {
              source: "AI Recruitment",
              applications: 45,
              quality: 8.7,
              cost: 1200,
            },
          ].map((source) => (
            <div
              key={source.source}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-900">{source.source}</span>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-blue-600">
                    {source.applications}
                  </p>
                  <p className="text-gray-500">Applications</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-600">{source.quality}</p>
                  <p className="text-gray-500">Quality</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-orange-600">£{source.cost}</p>
                  <p className="text-gray-500">Avg Cost</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Department Performance
        </h3>
        <div className="space-y-4">
          {[
            { dept: "Engineering", time: 21, cost: 2100, satisfaction: 9.1 },
            { dept: "Product", time: 28, cost: 2600, satisfaction: 8.8 },
            { dept: "Design", time: 19, cost: 1900, satisfaction: 9.2 },
            { dept: "Sales", time: 15, cost: 1500, satisfaction: 8.5 },
            { dept: "Marketing", time: 22, cost: 1800, satisfaction: 8.9 },
          ].map((dept) => (
            <div
              key={dept.dept}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-900">{dept.dept}</span>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-blue-600">{dept.time}d</p>
                  <p className="text-gray-500">Avg Time</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-600">£{dept.cost}</p>
                  <p className="text-gray-500">Avg Cost</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-purple-600">
                    {dept.satisfaction}
                  </p>
                  <p className="text-gray-500">Satisfaction</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Hiring Funnel Analysis */}
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Hiring Funnel Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">100%</div>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-600">423</p>
            <p className="text-sm text-gray-600">Screened</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">34%</div>
        </div>
        <div className="text-center">
          <div className="bg-yellow-100 rounded-lg p-4">
            <p className="text-2xl font-bold text-yellow-600">156</p>
            <p className="text-sm text-gray-600">Interviewed</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">12.5%</div>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-600">45</p>
            <p className="text-sm text-gray-600">Offers Made</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">3.6%</div>
        </div>
        <div className="text-center">
          <div className="bg-orange-100 rounded-lg p-4">
            <p className="text-2xl font-bold text-orange-600">38</p>
            <p className="text-sm text-gray-600">Hired</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">3.0%</div>
        </div>
      </div>
    </div>
  </div>
);

// Documents Tab Component
const DocumentsTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Documents</h1>
        <p className="text-blue-100">
          Manage templates, contracts, and recruitment documents
        </p>
      </div>
      <div className="flex space-x-3">
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium">
          <Plus size={20} />
          <span>New Template</span>
        </button>
        <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
          <Upload size={16} />
          <span>Upload</span>
        </button>
      </div>
    </div>

    {/* Document Categories */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
            <p className="text-sm text-gray-600">Reusable document templates</p>
          </div>
        </div>
        <div className="space-y-3">
          {mockDocuments
            .filter((doc) => doc.type === "Template")
            .map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.template}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Guides</h3>
            <p className="text-sm text-gray-600">
              Interview and process guides
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {mockDocuments
            .filter((doc) => doc.type === "Guide")
            .map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.category}</p>
                  {doc.autoSend && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      Auto-send enabled
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Communications
            </h3>
            <p className="text-sm text-gray-600">Email templates and letters</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Welcome Email</p>
              <p className="text-sm text-gray-500">New hire welcome message</p>
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                Auto-send enabled
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-gray-200 rounded">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Send className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Rejection Letter</p>
              <p className="text-sm text-gray-500">
                Candidate rejection template
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-gray-200 rounded">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Send className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Documents */}
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Documents
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Document
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Type
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Category
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Last Modified
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockDocuments.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {doc.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{doc.type}</td>
                <td className="py-3 px-4 text-gray-600">{doc.category}</td>
                <td className="py-3 px-4 text-gray-600">{doc.lastModified}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Savings Tab Component
const SavingsTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Cost Savings</h1>
        <p className="text-blue-100">
          Track your recruitment cost savings and ROI
        </p>
      </div>
      <div className="flex space-x-3">
        <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
          <Download size={16} />
          <span>Export Report</span>
        </button>
      </div>
    </div>

    {/* Savings Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Savings</p>
            <p className="text-3xl font-bold text-green-600">£47,320</p>
            <p className="text-sm text-green-600">This quarter</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Agency Fees Saved
            </p>
            <p className="text-3xl font-bold text-blue-600">£28,500</p>
            <p className="text-sm text-gray-600">vs traditional agencies</p>
          </div>
          <Building className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Time Savings</p>
            <p className="text-3xl font-bold text-purple-600">156 hrs</p>
            <p className="text-sm text-gray-600">Automated processes</p>
          </div>
          <Clock className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">ROI</p>
            <p className="text-3xl font-bold text-orange-600">340%</p>
            <p className="text-sm text-gray-600">Return on investment</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
      </div>
    </div>

    {/* Detailed Savings Breakdown */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cost Comparison
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Traditional Agencies</p>
              <p className="text-sm text-gray-600">Average cost per hire</p>
            </div>
            <p className="text-2xl font-bold text-red-600">£5,500</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">UPhire Platform</p>
              <p className="text-sm text-gray-600">Average cost per hire</p>
            </div>
            <p className="text-2xl font-bold text-green-600">£2,340</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div>
              <p className="font-medium text-gray-900">Savings per Hire</p>
              <p className="text-sm text-gray-600">Cost reduction achieved</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">£3,160</p>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Savings Trend
        </h3>
        <div className="space-y-4">
          {[
            { month: "January", savings: 12500, hires: 4 },
            { month: "February", savings: 15800, hires: 5 },
            { month: "March", savings: 19020, hires: 6 },
            { month: "April", savings: 18900, hires: 6 },
          ].map((data) => (
            <div
              key={data.month}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{data.month}</p>
                <p className="text-sm text-gray-600">
                  {data.hires} hires completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  £{data.savings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">saved</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Savings Sources */}
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Savings Sources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <Building className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">
            Reduced Agency Fees
          </h4>
          <p className="text-2xl font-bold text-green-600 mb-2">£28,500</p>
          <p className="text-sm text-gray-600">
            No more 15-20% agency commissions
          </p>
        </div>

        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Time Efficiency</h4>
          <p className="text-2xl font-bold text-blue-600 mb-2">£12,480</p>
          <p className="text-sm text-gray-600">
            Automated screening and scheduling
          </p>
        </div>

        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">
            Better Quality Hires
          </h4>
          <p className="text-2xl font-bold text-purple-600 mb-2">£6,340</p>
          <p className="text-sm text-gray-600">
            Reduced turnover and re-hiring costs
          </p>
        </div>
      </div>
    </div>
  </div>
);

// My Business Tab Component
const MyBusinessTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(businessProfile);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log("Saving business profile:", formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Business</h1>
          <p className="text-blue-100">
            Manage your company profile and information
          </p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium"
        >
          <Edit size={20} />
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Company Overview */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Founded
                    </label>
                    <input
                      type="text"
                      value={formData.founded}
                      onChange={(e) =>
                        setFormData({ ...formData, founded: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {formData.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Certifications & Awards
              </h4>
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">{cert}</span>
                  </div>
                ))}
                {formData.awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Company Description
              </h4>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                readOnly={!isEditing}
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Mission Statement
              </h4>
              <textarea
                value={formData.mission}
                onChange={(e) =>
                  setFormData({ ...formData, mission: e.target.value })
                }
                readOnly={!isEditing}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Company Culture
              </h4>
              <textarea
                value={formData.culture}
                onChange={(e) =>
                  setFormData({ ...formData, culture: e.target.value })
                }
                readOnly={!isEditing}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Core Values</h4>
              <div className="flex flex-wrap gap-2">
                {formData.values.map((value, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Client Base</h4>
              <div className="space-y-2">
                {formData.clients.map((client, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{client}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Benefits Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(formData.benefits).map(([key, value]) => (
            <div key={key} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-sm text-gray-600">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Modal Components

// Employee Modal Component
const EmployeeModal = ({
  showEmployeeModal,
  setShowEmployeeModal,
  selectedEmployee,
  setSelectedEmployee,
  setShowDocumentUploadModal,
}: {
  showEmployeeModal: boolean;
  setShowEmployeeModal: (show: boolean) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  setShowDocumentUploadModal: (show: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  if (!showEmployeeModal || !selectedEmployee) return null;

  const startDate = new Date(selectedEmployee.startDate);
  const today = new Date();
  const tenure = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );

  const probationEndDate = new Date(startDate);
  probationEndDate.setMonth(
    probationEndDate.getMonth() + (selectedEmployee.probationMonths || 6),
  );
  const probationDaysLeft = Math.ceil(
    (probationEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      Signed: "bg-green-100 text-green-800",
      Complete: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Valid: "bg-green-100 text-green-800",
      Active: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const closeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
    setIsEditing(false);
    setActiveTab("overview");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {selectedEmployee.avatar || selectedEmployee.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedEmployee.name}
                </h2>
                <p className="text-gray-600">{selectedEmployee.position}</p>
                <p className="text-sm text-gray-500">
                  {selectedEmployee.department} • Employee ID: #
                  {selectedEmployee.employeeId}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedEmployee.probationPeriod
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedEmployee.probationPeriod
                      ? "On Probation"
                      : "Confirmed Employee"}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {selectedEmployee.employmentType}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "probation", label: "Probation & Reviews", icon: Timer },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "performance", label: "Performance", icon: Award },
              { id: "personal", label: "Personal Info", icon: UserCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Employment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedEmployee.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tenure:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {tenure} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Salary:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedEmployee.salary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Manager:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedEmployee.manager}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Employment Type:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedEmployee.employmentType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Mail size={16} />
                      <span className="text-sm">Send Email</span>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Calendar size={16} />
                      <span className="text-sm">Schedule Meeting</span>
                    </button>
                    <button
                      onClick={() => setShowDocumentUploadModal(true)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <FileText size={16} />
                      <span className="text-sm">Add Document</span>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Award size={16} />
                      <span className="text-sm">Performance Review</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Contract signed
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedEmployee.startDate)}
                      </p>
                    </div>
                  </div>
                  {selectedEmployee.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.type} - {doc.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.date ? formatDate(doc.date) : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "probation" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Timer className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Probation Status
                  </h3>
                </div>

                {selectedEmployee.probationPeriod ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Probation Period
                        </p>
                        <p className="text-xl font-bold text-yellow-600">
                          {selectedEmployee.probationMonths} months
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatDate(probationEndDate.toISOString())}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">Days Remaining</p>
                        <p
                          className={`text-xl font-bold ${
                            probationDaysLeft <= 7
                              ? "text-red-600"
                              : probationDaysLeft <= 30
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {probationDaysLeft > 0
                            ? probationDaysLeft
                            : "Overdue"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Probation Checklist
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            Contract signed
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            Induction completed
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedEmployee.documents.some(
                            (doc) =>
                              doc.type === "Medical" &&
                              doc.status === "Complete",
                          ) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            Medical certificate submitted
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {probationDaysLeft <= 30 ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">
                            Probation review scheduled
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                      Schedule Probation Review
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Probation Completed
                    </h4>
                    <p className="text-gray-600">
                      This employee has successfully completed their probation
                      period.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Employee Documents
                </h3>
                <button
                  onClick={() => setShowDocumentUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {selectedEmployee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          {doc.type} • {doc.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last modified: {doc.lastModified}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getDocumentStatusBadge(doc.status || "Complete")}`}
                      >
                        {doc.status || "Complete"}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">8.7</p>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">4</p>
                  <p className="text-sm text-gray-600">Reviews Completed</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-gray-600">Goals Achieved</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Performance History
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Q4 2023 Review
                      </p>
                      <p className="text-sm text-gray-600">
                        Annual performance review
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          8.5/10
                        </p>
                        <p className="text-xs text-gray-500">Excellent</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Schedule Performance Review
              </button>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>{isEditing ? "Save" : "Edit"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedEmployee.name}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={selectedEmployee.email}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={selectedEmployee.phoneNumber}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedEmployee.position}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedEmployee.department}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedEmployee.manager}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recruitment Modal Component
const RecruitModal = ({
  showRecruitModal,
  setShowRecruitModal,
  recruitingRoleId,
}: {
  showRecruitModal: boolean;
  setShowRecruitModal: (show: boolean) => void;
  recruitingRoleId: number | null;
}) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  if (!showRecruitModal) return null;

  const stages = [
    {
      id: 1,
      name: "AI Search",
      description: "Search across multiple platforms",
      platforms: [
        "LinkedIn",
        "Indeed",
        "GitHub",
        "AngelList",
        "Stack Overflow",
      ],
    },
    {
      id: 2,
      name: "Outreach",
      description: "Send personalized messages",
      details: "AI-generated personalized outreach messages",
    },
    {
      id: 3,
      name: "Interest Collection",
      description: "Track responses",
      details: "Monitor candidate responses and engagement",
    },
    {
      id: 4,
      name: "Ranking",
      description: "AI ranking and selection",
      details: "AI analyzes and ranks top 5 candidates",
    },
  ];

  const startRecruitment = () => {
    setIsSearching(true);
    setCurrentStage(1);

    // Simulate AI recruitment process
    setTimeout(() => {
      setCurrentStage(2);
      setTimeout(() => {
        setCurrentStage(3);
        setTimeout(() => {
          setCurrentStage(4);
          setSearchResults([
            { name: "Sarah Mitchell", platform: "LinkedIn", match: 94 },
            { name: "James Rodriguez", platform: "GitHub", match: 91 },
            { name: "Emily Chen", platform: "Indeed", match: 89 },
            { name: "David Kumar", platform: "Stack Overflow", match: 87 },
            { name: "Lisa Anderson", platform: "AngelList", match: 85 },
          ]);
          setIsSearching(false);
        }, 2000);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              AI Recruitment Automation
            </h2>
            <button
              onClick={() => setShowRecruitModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stage Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStage >= stage.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stage.id}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`w-16 h-1 ml-2 ${
                        currentStage > stage.id ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Stage {currentStage}: {stages[currentStage - 1]?.name}
              </h3>
              <p className="text-gray-600">
                {stages[currentStage - 1]?.description}
              </p>
            </div>
          </div>

          {/* Stage Content */}
          {currentStage === 1 && !isSearching && (
            <div className="text-center space-y-4">
              <Brain className="w-16 h-16 mx-auto text-blue-600" />
              <p className="text-gray-600">
                AI will search across multiple platforms to find the best
                candidates for this role.
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {stages[0].platforms.map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                  >
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{platform}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={startRecruitment}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Start AI Recruitment
              </button>
            </div>
          )}

          {isSearching && currentStage === 1 && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">
                Searching across platforms for qualified candidates...
              </p>
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                {stages[0].platforms.map((platform, index) => (
                  <div
                    key={platform}
                    className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                      index < currentStage
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${index < currentStage ? "text-green-600" : "text-gray-400"}`}
                    />
                    <span className="text-sm">{platform}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSearching && currentStage === 2 && (
            <div className="text-center space-y-4">
              <Send className="w-16 h-16 mx-auto text-purple-600" />
              <p className="text-gray-600">
                Sending personalized outreach messages to potential
                candidates...
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  AI is crafting personalized messages based on candidate
                  profiles and role requirements.
                </p>
              </div>
            </div>
          )}

          {isSearching && currentStage === 3 && (
            <div className="text-center space-y-4">
              <MessageSquare className="w-16 h-16 mx-auto text-green-600" />
              <p className="text-gray-600">
                Collecting responses and tracking candidate interest...
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Monitoring response rates and engagement levels from outreach
                  campaigns.
                </p>
              </div>
            </div>
          )}

          {currentStage === 4 && !isSearching && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recruitment Complete!
                </h3>
                <p className="text-gray-600">
                  AI has identified and ranked the top 5 candidates based on
                  skills, experience, and cultural fit.
                </p>
              </div>

              {searchResults.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Top Candidates
                  </h4>
                  <div className="space-y-3">
                    {searchResults.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {candidate.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Found on {candidate.platform}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-green-600">
                            {candidate.match}% match
                          </span>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRecruitModal(false)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  View All Candidates
                </button>
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Start Interviews
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// AI Success Prediction Modal Component
const PredictionModal = ({
  showPredictionModal,
  setShowPredictionModal,
  selectedRole,
}: {
  showPredictionModal: boolean;
  setShowPredictionModal: (show: boolean) => void;
  selectedRole: Role | null;
}) => {
  if (!showPredictionModal || !selectedRole) return null;

  // Generate realistic prediction data
  const prediction: PredictionData = {
    successRate: Math.floor(Math.random() * 30) + 70, // 70-100%
    confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
    factors: {
      positive: [
        "Clear role requirements defined",
        "Competitive salary range",
        "Strong company profile",
        "High market demand for role",
        "Comprehensive benefits package",
      ],
      risks: [
        "High competition for candidates",
        "Specialized skill requirements",
        "Current market conditions",
      ],
    },
    recommendations: [
      "Optimize job description with specific technology skills",
      "Emphasize growth opportunities and company culture",
      "Consider using additional platforms like GitHub for technical roles",
      "Highlight unique benefits to stand out from competitors",
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  UPhireIQ AI Success Prediction
                </h2>
                <p className="text-gray-600">
                  Analysis for: {selectedRole.title} • {selectedRole.department}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPredictionModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Success Rate Overview */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Success Rate
                  </h3>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {prediction.successRate}%
                </div>
                <p className="text-gray-600">
                  Based on role requirements, market conditions, and historical
                  data
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confidence Level
                  </h3>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {prediction.confidence}%
                </div>
                <p className="text-gray-600">
                  AI model confidence in this prediction
                </p>
              </div>
            </div>
          </div>

          {/* Market Analysis Integration */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Market Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Salary Competitiveness
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  Above Market
                </div>
                <div className="text-sm text-gray-600">
                  {selectedRole.salary}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Market Demand
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">High</div>
                <div className="text-sm text-gray-600">Growing trend</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Expected Time to Fill
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  18-25 days
                </div>
                <div className="text-sm text-gray-600">
                  Based on similar roles
                </div>
              </div>
            </div>
          </div>

          {/* Success Factors */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Success Factors Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Positive Factors
                </h4>
                <div className="space-y-2">
                  {prediction.factors.positive.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-green-50 rounded"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {prediction.factors.risks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-yellow-50 rounded"
                    >
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{risk}</span>
                    </div>
                  ))}
                  {prediction.successRate < 70 && (
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Below average success rate
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI Recommendations
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-3">
                {prediction.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Recommendation {index + 1}
                      </p>
                      <p className="text-sm text-gray-600">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Analysis generated by AI • Data sources: Market research,
              historical success rates
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPredictionModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Role Modal Component
const NewRoleModal = ({
  showNewRoleModal,
  setShowNewRoleModal,
}: {
  showNewRoleModal: boolean;
  setShowNewRoleModal: (show: boolean) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [roleFormData, setRoleFormData] = useState({
    title: "",
    department: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    priority: "Medium",
    description: "",
    requirements: [] as string[],
    benefits: [] as string[],
    employmentType: "Full-Time",
    experienceLevel: "Mid-Level",
  });

  if (!showNewRoleModal) return null;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Here you would typically save the role
    console.log("Creating role:", roleFormData);
    setShowNewRoleModal(false);
    setCurrentStep(1);
    setRoleFormData({
      title: "",
      department: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      priority: "Medium",
      description: "",
      requirements: [],
      benefits: [],
      employmentType: "Full-Time",
      experienceLevel: "Mid-Level",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Role
            </h2>
            <button
              onClick={() => setShowNewRoleModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 ml-2 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={roleFormData.title}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. Senior React Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={roleFormData.department}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        department: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    value={roleFormData.location}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Manchester, UK">Manchester, UK</option>
                    <option value="Birmingham, UK">Birmingham, UK</option>
                    <option value="Remote, UK">Remote, UK</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={roleFormData.priority}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        priority: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={roleFormData.employmentType}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        employmentType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={roleFormData.experienceLevel}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        experienceLevel: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Entry-Level">Entry-Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior-Level">Senior-Level</option>
                    <option value="Lead/Principal">Lead/Principal</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Min (£) *
                  </label>
                  <input
                    type="number"
                    value={roleFormData.salaryMin}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        salaryMin: e.target.value,
                      })
                    }
                    placeholder="45000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Max (£) *
                  </label>
                  <input
                    type="number"
                    value={roleFormData.salaryMax}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        salaryMax: e.target.value,
                      })
                    }
                    placeholder="65000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Job Description & Requirements
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  value={roleFormData.description}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder={`We are looking for a ${roleFormData.title} to join our ${roleFormData.department} team at ${businessProfile.name}...`}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  AI will help optimize this description based on market best
                  practices
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Requirements
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="e.g. 5+ years of React experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        setRoleFormData({
                          ...roleFormData,
                          requirements: [
                            ...roleFormData.requirements,
                            e.currentTarget.value.trim(),
                          ],
                        });
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {roleFormData.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{req}</span>
                        <button
                          onClick={() => {
                            const newReqs = roleFormData.requirements.filter(
                              (_, i) => i !== index,
                            );
                            setRoleFormData({
                              ...roleFormData,
                              requirements: newReqs,
                            });
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Press Enter to add each requirement
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefits & Perks
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {Object.entries(businessProfile.benefits)
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={roleFormData.benefits.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRoleFormData({
                                ...roleFormData,
                                benefits: [...roleFormData.benefits, key],
                              });
                            } else {
                              setRoleFormData({
                                ...roleFormData,
                                benefits: roleFormData.benefits.filter(
                                  (b) => b !== key,
                                ),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Review & Create
              </h3>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Role Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-900">
                      {roleFormData.title}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Department:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {roleFormData.department}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-900">
                      {roleFormData.location}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Salary:</span>
                    <span className="ml-2 text-gray-900">
                      £{roleFormData.salaryMin} - £{roleFormData.salaryMax}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Priority:</span>
                    <span className="ml-2 text-gray-900">
                      {roleFormData.priority}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-900">
                      {roleFormData.employmentType}
                    </span>
                  </div>
                </div>

                {roleFormData.requirements.length > 0 && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-700">
                      Requirements:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {roleFormData.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900">
                      AI Optimization Available
                    </h5>
                    <p className="text-sm text-blue-700">
                      After creating this role, you can use AI to generate
                      success predictions and start automated recruitment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewRoleModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Create Role & Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Candidate Details Modal Component
const CandidateDetailsModal = ({
  candidate,
  isOpen,
  onClose,
}: {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {candidate.avatar}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidate.name}
                </h2>
                <p className="text-gray-600">{candidate.role}</p>
                <p className="text-sm text-gray-500">
                  {candidate.location} • {candidate.experience}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      candidate.status === "Interview Scheduled"
                        ? "bg-purple-100 text-purple-800"
                        : candidate.status === "Shortlisted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {candidate.status}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {candidate.aiMatch}% AI Match
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "experience", label: "Experience" },
              { id: "skills", label: "Skills" },
              { id: "contact", label: "Contact" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Application Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Applied For:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {candidate.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Application Date:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {candidate.applied}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Source:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {candidate.source}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        AI Match Score:
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {candidate.aiMatch}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Mail size={16} />
                      <span className="text-sm">Send Email</span>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Phone size={16} />
                      <span className="text-sm">Call</span>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Calendar size={16} />
                      <span className="text-sm">Schedule</span>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Star size={16} />
                      <span className="text-sm">Shortlist</span>
                    </button>
                  </div>
                </div>
              </div>

              {candidate.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notes
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">{candidate.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Skill Match Analysis
                  </h4>
                  <div className="space-y-3">
                    {candidate.skills.slice(0, 5).map((skill, index) => {
                      const matchScore = Math.floor(Math.random() * 30) + 70;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700">{skill}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${matchScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {matchScore}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Experience Level
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {candidate.experience}
                      </p>
                      <p className="text-sm text-gray-600">Total Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                    {candidate.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Phone
                          </p>
                          <p className="text-sm text-gray-600">
                            {candidate.phoneNumber}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Location
                        </p>
                        <p className="text-sm text-gray-600">
                          {candidate.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Online Profiles
                  </h3>
                  <div className="space-y-3">
                    {candidate.linkedinProfile && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                        <a
                          href={candidate.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          LinkedIn Profile
                        </a>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    {candidate.githubProfile && (
                      <div className="flex items-center space-x-3">
                        <Github className="w-5 h-5 text-gray-900" />
                        <a
                          href={candidate.githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          GitHub Profile
                        </a>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    {candidate.portfolio && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <a
                          href={candidate.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Portfolio Website
                        </a>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Profile last updated: {candidate.applied}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendly Integration Modal Component
const CalendlyModal = ({
  candidate,
  isOpen,
  onClose,
}: {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedInterviewType, setSelectedInterviewType] = useState("");
  const [showCalendlyWidget, setShowCalendlyWidget] = useState(false);

  if (!isOpen) return null;

  const interviewTypes = [
    {
      id: "initial",
      label: "Initial Screening",
      duration: "30 min",
      description: "Basic screening and cultural fit assessment",
    },
    {
      id: "technical",
      label: "Technical Interview",
      duration: "60 min",
      description: "Technical skills and problem-solving assessment",
    },
    {
      id: "cultural",
      label: "Cultural Fit",
      duration: "45 min",
      description: "Team fit and values alignment discussion",
    },
    {
      id: "final",
      label: "Final Interview",
      duration: "60 min",
      description: "Final assessment with senior team members",
    },
  ];

  const openCalendlyScheduling = (type: string) => {
    setSelectedInterviewType(type);
    setShowCalendlyWidget(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Schedule Interview
              </h2>
              <p className="text-gray-600">
                Interview with {candidate.name} for {candidate.role}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showCalendlyWidget ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Interview Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => openCalendlyScheduling(type.id)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {type.label}
                        </h4>
                        <span className="text-sm text-blue-600 font-medium">
                          {type.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900">
                      Calendly Integration
                    </h5>
                    <p className="text-sm text-blue-700">
                      Interviews will be automatically scheduled using your
                      Calendly account. Invitations will be sent to both you and
                      the candidate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Bulk Scheduling Options
                </h4>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Schedule Multiple Interviews
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Interview Panel Setup
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {
                      interviewTypes.find((t) => t.id === selectedInterviewType)
                        ?.label
                    }
                  </h3>
                  <p className="text-gray-600">
                    Select your available time slot
                  </p>
                </div>
                <button
                  onClick={() => setShowCalendlyWidget(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Calendly Widget Placeholder */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Calendly Calendar Widget
                </h4>
                <p className="text-gray-600 mb-4">
                  Your Calendly calendar would be embedded here, showing
                  available time slots for the selected interview type.
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {[
                    "9:00 AM",
                    "10:30 AM",
                    "2:00 PM",
                    "3:30 PM",
                    "4:00 PM",
                    "5:00 PM",
                  ].map((time) => (
                    <button
                      key={time}
                      className="p-2 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Demo: Click any time slot to schedule the interview
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-green-900">
                      Automatic Notifications
                    </h5>
                    <p className="text-sm text-green-700">
                      Both you and {candidate.name} will receive calendar
                      invitations and reminder emails automatically when the
                      interview is scheduled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Powered by Calendly integration
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              {showCalendlyWidget && (
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Confirm Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Document Upload Modal Component
const DocumentUploadModal = ({
  employee,
  isOpen,
  onClose,
}: {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");

  if (!isOpen) return null;

  const documentTypes = [
    "Contract",
    "Identification",
    "Medical Certificate",
    "References",
    "Qualifications",
    "Right to Work",
    "Bank Details",
    "Emergency Contact",
  ];

  const documentCategories = [
    "Employment",
    "Legal",
    "Medical",
    "Financial",
    "Personal",
    "Compliance",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && documentType && documentCategory) {
      // Here you would typically upload the file
      console.log("Uploading document:", {
        file: selectedFile.name,
        type: documentType,
        category: documentCategory,
        employee: employee.name,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Document
              </h2>
              <p className="text-gray-600">Add document for {employee.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {documentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <FileText className="w-12 h-12 text-green-600 mx-auto" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-medium text-gray-900">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900">Document Security</h5>
                <p className="text-sm text-blue-700">
                  All documents are encrypted and stored securely. Access is
                  logged and monitored for compliance purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !documentType || !documentCategory}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main UPhire Platform Component
const UPhirePlatform = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    initials: "",
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for breadcrumb navigation
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "savings", label: "Savings", icon: TrendingUp },
    { id: "business", label: "My Business", icon: Factory },
  ];

  useEffect(() => {
    // Update breadcrumbs based on active tab
    const segments = ["Home"];
    if (activeTab !== "dashboard") {
      segments.push(activeTab.charAt(0).toUpperCase() + activeTab.slice(1));
    }
    setBreadcrumbs(segments);
  }, [activeTab]);

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Simulate login
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
                The AI-powered recruitment platform that revolutionizes how you
                find, engage, and hire top talent with advanced automation and
                market intelligence.
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
