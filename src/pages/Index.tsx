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

interface VRScenario {
  id: string;
  name: string;
  department: string;
  description: string;
  duration: number; // minutes
  environment: string;
  skills: string[];
  metrics: string[];
}

interface VRPerformance {
  candidateId: number;
  scenarioId: string;
  completedAt: string;
  duration: number; // actual time taken
  overallScore: number; // 0-100
  competencyScores: {
    problemSolving: number;
    communication: number;
    leadership: number;
    decisionMaking: number;
    emotionalIntelligence: number;
    technicalSkills: number;
  };
  behavioralMetrics: {
    stressLevel: number;
    confidenceLevel: number;
    adaptability: number;
    teamwork: number;
  };
  keyMoments: {
    timestamp: number;
    event: string;
    score: number;
    note: string;
  }[];
  npcsInteracted: number;
  errorsCommitted: number;
  decisionsCount: number;
  replay: {
    available: boolean;
    highlights: string[];
  };
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

// VR Scenarios Data
const vrScenarios: VRScenario[] = [
  {
    id: "customer-service-01",
    name: "Customer Support Centre",
    department: "Customer Service",
    description: "Handle multiple customer inquiries in a virtual call centre environment with simulated clients expressing various concerns and emotions.",
    duration: 15,
    environment: "Call Centre Desk",
    skills: ["Communication", "Empathy", "Problem Solving", "Multi-tasking"],
    metrics: ["Response Time", "Customer Satisfaction", "Issue Resolution", "Emotional Intelligence"]
  },
  {
    id: "logistics-warehouse-01",
    name: "Warehouse Operations",
    department: "Logistics",
    description: "Navigate a 3D warehouse environment, optimize routing, manage inventory, and coordinate with team members under time pressure.",
    duration: 20,
    environment: "Virtual Warehouse",
    skills: ["Spatial Awareness", "Time Management", "Decision Making", "Process Optimization"],
    metrics: ["Efficiency Score", "Safety Compliance", "Team Coordination", "Problem Resolution"]
  },
  {
    id: "tech-debugging-01",
    name: "Code Debugging Challenge",
    department: "Engineering",
    description: "Debug complex code issues in a virtual development environment with multiple systems and realistic production scenarios.",
    duration: 25,
    environment: "Virtual Terminal",
    skills: ["Technical Problem Solving", "Analytical Thinking", "Code Quality", "System Understanding"],
    metrics: ["Bug Detection Rate", "Solution Quality", "Code Efficiency", "Documentation Skills"]
  },
  {
    id: "leadership-boardroom-01",
    name: "Executive Decision Making",
    department: "Management",
    description: "Lead a virtual boardroom meeting, manage conflicting stakeholders, and make strategic decisions under pressure.",
    duration: 30,
    environment: "Executive Boardroom",
    skills: ["Leadership", "Negotiation", "Strategic Thinking", "Conflict Resolution"],
    metrics: ["Team Engagement", "Decision Quality", "Stakeholder Management", "Crisis Handling"]
  },
  {
    id: "sales-presentation-01",
    name: "Client Pitch Simulation",
    department: "Sales",
    description: "Present to virtual clients in various scenarios, handle objections, and close deals in realistic business environments.",
    duration: 18,
    environment: "Corporate Meeting Room",
    skills: ["Presentation", "Persuasion", "Relationship Building", "Adaptability"],
    metrics: ["Presentation Quality", "Objection Handling", "Client Engagement", "Closing Rate"]
  },
  {
    id: "healthcare-emergency-01",
    name: "Medical Emergency Response",
    department: "Healthcare",
    description: "Respond to medical emergencies in a virtual hospital environment, coordinate with medical team, and make critical decisions.",
    duration: 22,
    environment: "Virtual Hospital",
    skills: ["Medical Knowledge", "Quick Decision Making", "Team Coordination", "Stress Management"],
    metrics: ["Response Time", "Medical Accuracy", "Team Communication", "Patient Care Quality"]
  }
];

// Mock VR Performance Data
const mockVRPerformances: VRPerformance[] = [
  {
    candidateId: 1, // Alice Johnson
    scenarioId: "tech-debugging-01",
    completedAt: "2024-01-22",
    duration: 22,
    overallScore: 87,
    competencyScores: {
      problemSolving: 92,
      communication: 78,
      leadership: 65,
      decisionMaking: 88,
      emotionalIntelligence: 75,
      technicalSkills: 95
    },
    behavioralMetrics: {
      stressLevel: 25, // Lower is better
      confidenceLevel: 88,
      adaptability: 82,
      teamwork: 70
    },
    keyMoments: [
      { timestamp: 5, event: "Identified critical bug", score: 95, note: "Excellent pattern recognition" },
      { timestamp: 12, event: "Implemented solution", score: 90, note: "Clean, efficient code" },
      { timestamp: 18, event: "Documented findings", score: 85, note: "Thorough documentation" }
    ],
    npcsInteracted: 3,
    errorsCommitted: 2,
    decisionsCount: 8,
    replay: {
      available: true,
      highlights: ["Bug identification at 5:23", "Solution implementation at 12:45", "Code review at 18:30"]
    }
  },
  {
    candidateId: 6, // Michael Chen
    scenarioId: "leadership-boardroom-01",
    completedAt: "2024-01-15",
    duration: 28,
    overallScore: 91,
    competencyScores: {
      problemSolving: 85,
      communication: 94,
      leadership: 96,
      decisionMaking: 89,
      emotionalIntelligence: 93,
      technicalSkills: 72
    },
    behavioralMetrics: {
      stressLevel: 18,
      confidenceLevel: 95,
      adaptability: 90,
      teamwork: 97
    },
    keyMoments: [
      { timestamp: 8, event: "Managed stakeholder conflict", score: 96, note: "Excellent mediation skills" },
      { timestamp: 15, event: "Strategic decision made", score: 92, note: "Data-driven approach" },
      { timestamp: 25, event: "Team consensus achieved", score: 94, note: "Strong leadership presence" }
    ],
    npcsInteracted: 7,
    errorsCommitted: 1,
    decisionsCount: 12,
    replay: {
      available: true,
      highlights: ["Conflict resolution at 8:15", "Strategic decision at 15:20", "Team alignment at 25:10"]
    }
  }
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

// Employee Details Modal Component
const EmployeeDetailsModal = ({
  employee,
  isOpen,
  onClose,
}: {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!employee || !isOpen) return null;

  // Calculate probation details
  const startDate = new Date(employee.startDate);
  const probationEndDate = new Date(startDate);
  probationEndDate.setMonth(startDate.getMonth() + employee.probationMonths);
  const today = new Date();
  const daysInProbation = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const probationDaysRemaining = employee.probationPeriod
    ? Math.max(
        0,
        Math.ceil(
          (probationEndDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;
  const totalProbationDays = employee.probationMonths * 30;
  const probationProgress = employee.probationPeriod
    ? Math.min(100, (daysInProbation / totalProbationDays) * 100)
    : 100;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "probation", label: "Probation & Reviews", icon: Clock },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "personal", label: "Personal Info", icon: Users },
  ];

  const formatSalary = (salary: string) => {
    // Convert salary to number and format as sterling
    const numericSalary = parseInt(salary.replace(/[£,]/g, ""));
    return `£${numericSalary.toLocaleString()}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {employee.avatar ||
                    employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {employee.name}
                </h2>
                <p className="text-lg text-gray-600">{employee.position}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {employee.employeeId}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {employee.employmentType}
                  </span>
                  {employee.probationPeriod && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      Probation
                    </span>
                  )}
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Employment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Start Date:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDateForDisplay(employee.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Department:
                      </span>
                      <span className="text-sm text-gray-900">
                        {employee.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Manager:
                      </span>
                      <span className="text-sm text-gray-900">
                        {employee.manager}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Employment Type:
                      </span>
                      <span className="text-sm text-gray-900">
                        {employee.employmentType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Annual Salary:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {formatSalary(employee.salary)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {employee.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {employee.email}
                        </span>
                      </div>
                    )}
                    {employee.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {employee.phoneNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {employee.department} Department
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time with Company */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Time with Company
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.ceil(
                        (today.getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Days with Company</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor(
                        (today.getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24 * 30),
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Months Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {employee.probationPeriod ? "In Progress" : "Completed"}
                    </p>
                    <p className="text-sm text-gray-600">Probation Status</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "probation" && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Probation Period
                </h3>
                {employee.probationPeriod ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Progress:
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {probationDaysRemaining} days remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${probationProgress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Date:</p>
                        <p className="font-medium">
                          {formatDateForDisplay(employee.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date:</p>
                        <p className="font-medium">
                          {formatDateForDisplay(
                            probationEndDate.toISOString().split("T")[0],
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">
                      Probation Period Completed
                    </p>
                    <p className="text-sm text-gray-600">
                      Successfully completed on schedule
                    </p>
                  </div>
                )}
              </div>

              {/* Review Schedule */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          30-Day Review
                        </p>
                        <p className="text-xs text-gray-600">
                          Initial performance assessment
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {daysInProbation >= 30 ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          60-Day Review
                        </p>
                        <p className="text-xs text-gray-600">
                          Mid-probation evaluation
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        daysInProbation >= 60
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {daysInProbation >= 60 ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Final Review
                        </p>
                        <p className="text-xs text-gray-600">
                          Probation completion assessment
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        !employee.probationPeriod
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {!employee.probationPeriod ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Employee Documents
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Upload size={16} />
                  <span>Upload Document</span>
                </button>
              </div>

              {employee.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employee.documents.map((document) => (
                    <div
                      key={document.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {document.name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {document.type} • {document.category}
                            </p>
                            <p className="text-xs text-gray-500">
                              Modified: {document.lastModified}
                            </p>
                            {document.status && (
                              <span className="mt-1 inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {document.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                          View
                        </button>
                        <button className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upload First Document
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">8.7</p>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">94%</p>
                    <p className="text-sm text-gray-600">Goal Achievement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">15</p>
                    <p className="text-sm text-gray-600">Projects Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Successfully completed probation period
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Led 3 major project deliveries
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Exceeded quarterly targets by 15%
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Full Name
                      </label>
                      <p className="text-sm text-gray-900">{employee.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Employee ID
                      </label>
                      <p className="text-sm text-gray-900">
                        {employee.employeeId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email Address
                      </label>
                      <p className="text-sm text-gray-900">
                        {employee.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone Number
                      </label>
                      <p className="text-sm text-gray-900">
                        {employee.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Start Date
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDateForDisplay(employee.startDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Department
                      </label>
                      <p className="text-sm text-gray-900">
                        {employee.department}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-md font-semibold text-yellow-900">
                    Privacy Notice
                  </h4>
                </div>
                <p className="text-sm text-yellow-800">
                  Personal information is protected under GDPR regulations.
                  Access is restricted to authorized HR personnel only.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          isOpen={showEmployeeModal}
          onClose={() => {
            setShowEmployeeModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

// Market Intelligence Component with ITJobsWatch API Integration
const MarketIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchResults, setLastSearchResults] = useState<MarketData | null>(
    null,
  );
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Mock ITJobsWatch API responses (in production, these would be real API calls)
  const mockSalaryData: {
    [key: string]: { min: number; max: number; median: number };
  } = {
    "react developer": { min: 45000, max: 85000, median: 65000 },
    "senior react developer": { min: 60000, max: 95000, median: 77500 },
    "product manager": { min: 55000, max: 90000, median: 72500 },
    "ux designer": { min: 40000, max: 65000, median: 52500 },
    "frontend developer": { min: 35000, max: 70000, median: 52500 },
    "backend developer": { min: 45000, max: 80000, median: 62500 },
    "fullstack developer": { min: 50000, max: 85000, median: 67500 },
    "data scientist": { min: 55000, max: 95000, median: 75000 },
    "devops engineer": { min: 60000, max: 100000, median: 80000 },
    "software engineer": { min: 45000, max: 90000, median: 67500 },
  };

  const searchMarketData = async (role: string) => {
    setIsSearching(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const normalizedRole = role.toLowerCase();
    const salaryData =
      mockSalaryData[normalizedRole] || mockSalaryData["software engineer"];

    // Mock market intelligence data from ITJobsWatch
    const marketData: MarketData = {
      salary: salaryData,
      demand: {
        level:
          salaryData.median > 70000
            ? "High"
            : salaryData.median > 55000
              ? "Medium"
              : "Low",
        trend: Math.random() > 0.5 ? "Increasing" : "Stable",
        timeToFill: Math.floor(Math.random() * 20) + 15, // 15-35 days
        competition: salaryData.median > 70000 ? "High" : "Medium",
      },
      skills: {
        required: normalizedRole.includes("react")
          ? ["React", "JavaScript", "HTML", "CSS", "Git"]
          : normalizedRole.includes("product")
            ? [
                "Product Strategy",
                "Analytics",
                "Agile",
                "Stakeholder Management",
              ]
            : normalizedRole.includes("ux")
              ? ["Figma", "User Research", "Prototyping", "Design Systems"]
              : ["JavaScript", "Problem Solving", "Git", "Testing"],
        trending: normalizedRole.includes("react")
          ? [
              "TypeScript",
              "Next.js",
              "GraphQL",
              "React Native",
              "Testing Library",
            ]
          : normalizedRole.includes("product")
            ? ["Data Analysis", "User Research", "A/B Testing", "Roadmapping"]
            : normalizedRole.includes("ux")
              ? [
                  "Design Systems",
                  "Accessibility",
                  "User Research",
                  "Prototyping",
                ]
              : ["TypeScript", "Cloud Platforms", "Docker", "Microservices"],
      },
    };

    setLastSearchResults(marketData);
    setSearchHistory((prev) => [
      role,
      ...prev.filter((h) => h !== role).slice(0, 4),
    ]);
    setIsSearching(false);
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() =>
              searchTerm.trim() && searchMarketData(searchTerm.trim())
            }
            disabled={isSearching || !searchTerm.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSearching ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isSearching ? "Searching..." : "Search"}</span>
          </button>
        </div>

        {/* Quick Search Buttons */}
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

        {/* Search History */}
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
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            Fetching latest market data from ITJobsWatch...
          </p>
        </div>
      )}

      {/* Search Results */}
      {lastSearchResults && !isSearching && (
        <div className="space-y-6">
          {/* Salary Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-medium">
                Minimum Salary
              </p>
              <p className="text-2xl font-bold text-blue-800">
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
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-600 font-medium">
                Maximum Salary
              </p>
              <p className="text-2xl font-bold text-purple-800">
                £{lastSearchResults.salary.max.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Market Demand & Competition */}
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
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full relative"
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
                Based on {Math.floor(Math.random() * 500) + 100} recent job
                postings in the UK market
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => alert("Market report exported successfully!")}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                Export Report
              </button>
              <button
                onClick={() =>
                  alert("Redirecting to create role with market data...")
                }
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                Create Role
              </button>
              <button
                onClick={() => alert("Market data exported to CSV!")}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors ml-2"
              >
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

      {/* Trending Market Information */}
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

          {/* Trending Roles */}
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
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      DevOps Engineer
                    </p>
                    <p className="text-xs text-gray-600">
                      +18% demand increase
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-700">£80k</p>
                    <p className="text-xs text-gray-600">median</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Data Scientist
                    </p>
                    <p className="text-xs text-gray-600">
                      +15% demand increase
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-700">£75k</p>
                    <p className="text-xs text-gray-600">median</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-orange-600 mr-2" />
                Trending Skills
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      TypeScript
                    </span>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
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
                <div className="flex items-center justify-between p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Kubernetes
                    </span>
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
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

          {/* Market Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Market Overview</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">89%</p>
                <p className="text-sm text-gray-600">Market Activity</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 5% vs last month
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">21d</p>
                <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                <p className="text-xs text-green-600 mt-1">
                  ↓ 2 days vs last month
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">£68k</p>
                <p className="text-sm text-gray-600">Avg. Tech Salary</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 3% vs last quarter
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">1,247</p>
                <p className="text-sm text-gray-600">Active Job Postings</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% vs last week
                </p>
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
  const [showVRSimulation, setShowVRSimulation] = useState(false);
  const [selectedVRCandidate, setSelectedVRCandidate] = useState<ShortlistedCandidate | null>(null);
  const [selectedVRScenario, setSelectedVRScenario] = useState<VRScenario | null>(null);
  const [showVRPerformance, setShowVRPerformance] = useState(false);
  const [selectedVRPerformance, setSelectedVRPerformance] = useState<VRPerformance | null>(null);

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

  const sendVRInvite = (candidate: ShortlistedCandidate) => {
    // Find appropriate VR scenario for the role
    const scenario = vrScenarios.find(s =>
      s.department.toLowerCase() === role.department.toLowerCase()
    ) || vrScenarios[0]; // Default to first scenario if no match

    setSelectedVRCandidate(candidate);
    setSelectedVRScenario(scenario);
    setShowVRSimulation(true);
  };

  const viewVRPerformance = (candidate: ShortlistedCandidate) => {
    const performance = mockVRPerformances.find(p => p.candidateId === candidate.id);
    if (performance) {
      setSelectedVRCandidate(candidate);
      setSelectedVRPerformance(performance);
      setShowVRPerformance(true);
    } else {
      alert("No VR performance data available for this candidate");
    }
  };

  const hasVRPerformance = (candidateId: number) => {
    return mockVRPerformances.some(p => p.candidateId === candidateId);
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

                    {hasVRPerformance(candidate.id) ? (
                      <button
                        onClick={() => viewVRPerformance(candidate)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center space-x-2"
                      >
                        <VideoIcon size={16} />
                        <span>View VR Results</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => sendVRInvite(candidate)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center space-x-2"
                      >
                        <VideoIcon size={16} />
                        <span>VR Simulation Invite</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        alert(`Viewing detailed profile for ${candidate.name}`)
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        alert(`Opening message composer for ${candidate.name}`)
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
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
              <button
                onClick={() => alert("Opening job description editor...")}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Job Description
              </button>
              <button
                onClick={() =>
                  alert("Viewing all applications for this role...")
                }
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Applications
              </button>
              <button
                onClick={() => alert("Job posting link copied to clipboard!")}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Share Job Posting
              </button>
              <button
                onClick={() =>
                  confirm("Are you sure you want to close this position?") &&
                  alert("Position closed successfully")
                }
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close Position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// VR Simulation Portal Component
const VRSimulationPortal = ({
  isOpen,
  onClose,
  candidate,
  scenario
}: {
  isOpen: boolean;
  onClose: () => void;
  candidate: ShortlistedCandidate;
  scenario: VRScenario;
}) => {
  const [simulationStage, setSimulationStage] = useState<'invite' | 'preparation' | 'running' | 'completed'>('invite');
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [useVRHeadset, setUseVRHeadset] = useState(false);

  useEffect(() => {
    // Check for WebXR VR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(setIsVRSupported);
    }
  }, []);

  const startSimulation = async () => {
    setSimulationStage('preparation');
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSimulationStage('running');

    // Simulate VR scenario progression
    const tasks = [
      "Initializing virtual environment...",
      "Loading scenario assets...",
      "Calibrating user interactions...",
      "Starting NPC interactions...",
      "Recording performance metrics...",
      "Processing behavioral analysis..."
    ];

    for (let i = 0; i < tasks.length; i++) {
      setCurrentTask(tasks[i]);
      setProgress((i / tasks.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    setProgress(100);
    setCurrentTask("Simulation completed!");

    // Save performance data (in real app, this would be actual VR data)
    const newPerformance: VRPerformance = {
      candidateId: candidate.id,
      scenarioId: scenario.id,
      completedAt: new Date().toISOString().split('T')[0],
      duration: scenario.duration - Math.floor(Math.random() * 5),
      overallScore: Math.floor(Math.random() * 20) + 75,
      competencyScores: {
        problemSolving: Math.floor(Math.random() * 25) + 75,
        communication: Math.floor(Math.random() * 25) + 70,
        leadership: Math.floor(Math.random() * 30) + 65,
        decisionMaking: Math.floor(Math.random() * 25) + 75,
        emotionalIntelligence: Math.floor(Math.random() * 25) + 70,
        technicalSkills: Math.floor(Math.random() * 25) + 75
      },
      behavioralMetrics: {
        stressLevel: Math.floor(Math.random() * 30) + 15,
        confidenceLevel: Math.floor(Math.random() * 25) + 70,
        adaptability: Math.floor(Math.random() * 25) + 70,
        teamwork: Math.floor(Math.random() * 25) + 75
      },
      keyMoments: [
        { timestamp: 5, event: "Initial task engagement", score: Math.floor(Math.random() * 20) + 80, note: "Strong initial approach" },
        { timestamp: 12, event: "Problem solving phase", score: Math.floor(Math.random() * 20) + 75, note: "Effective methodology" },
        { timestamp: 18, event: "Final completion", score: Math.floor(Math.random() * 20) + 85, note: "Successful task completion" }
      ],
      npcsInteracted: Math.floor(Math.random() * 5) + 2,
      errorsCommitted: Math.floor(Math.random() * 3),
      decisionsCount: Math.floor(Math.random() * 10) + 5,
      replay: {
        available: true,
        highlights: ["Key decision point", "Problem resolution", "Final outcome"]
      }
    };

    mockVRPerformances.push(newPerformance);

    setTimeout(() => {
      setSimulationStage('completed');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">VR Interview Simulation</h2>
                <p className="text-gray-600">{scenario.name} • {scenario.duration} minutes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {simulationStage === 'invite' && (
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Welcome, {candidate.name}!</h3>
                <p className="text-blue-700 text-sm">
                  You've been invited to participate in a VR simulation to demonstrate your skills in a realistic work environment.
                </p>
              </div>

              {/* Scenario Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Simulation Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Environment</p>
                      <p className="text-gray-900">{scenario.environment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-gray-900">{scenario.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Department</p>
                      <p className="text-gray-900">{scenario.department}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Skills Assessed</p>
                    <div className="flex flex-wrap gap-2">
                      {scenario.skills.map((skill, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                  <p className="text-gray-700">{scenario.description}</p>
                </div>
              </div>

              {/* VR Setup Options */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">VR Setup Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="browser"
                      name="vrMode"
                      checked={!useVRHeadset}
                      onChange={() => setUseVRHeadset(false)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="browser" className="flex-1">
                      <div className="font-medium text-gray-900">Browser Mode (Recommended)</div>
                      <div className="text-sm text-gray-600">Use your mouse and keyboard for navigation</div>
                    </label>
                  </div>

                  {isVRSupported && (
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="vr"
                        name="vrMode"
                        checked={useVRHeadset}
                        onChange={() => setUseVRHeadset(true)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="vr" className="flex-1">
                        <div className="font-medium text-gray-900">VR Headset Mode</div>
                        <div className="text-sm text-gray-600">Immersive experience with VR headset</div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startSimulation}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2"
                >
                  <Play size={20} />
                  <span>Start VR Simulation</span>
                </button>
              </div>
            </div>
          )}

          {simulationStage === 'preparation' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <VideoIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Preparing Your VR Environment</h3>
                <p className="text-gray-600">Setting up the simulation workspace...</p>
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          )}

          {simulationStage === 'running' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulation in Progress</h3>
                <p className="text-gray-600">{currentTask}</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="bg-black rounded-lg p-6 text-green-400 font-mono text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>VR SIMULATION ACTIVE</span>
                </div>
                <div className="space-y-1">
                  <p>→ Environment: {scenario.environment}</p>
                  <p>→ Tracking: Behavioral metrics, decision patterns</p>
                  <p>→ NPCs: Active and responsive</p>
                  <p>→ Progress: {Math.round(progress)}% complete</p>
                </div>
              </div>
            </div>
          )}

          {simulationStage === 'completed' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulation Completed!</h3>
                <p className="text-gray-600">Your performance has been recorded and analyzed</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">What Happens Next?</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✓ Your VR performance data has been sent to the hiring team</p>
                  <p>✓ AI analysis of your decision-making patterns is complete</p>
                  <p>✓ Behavioral metrics and competency scores have been recorded</p>
                  <p>✓ The recruitment team will review your results shortly</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Complete Simulation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create New Role Modal Component
const CreateNewRoleModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    priority: "Medium",
    description: "",
    requirements: [""],
    benefits: [""],
  });

  const [showDescriptionGenerator, setShowDescriptionGenerator] =
    useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [runPredictionOnCreate, setRunPredictionOnCreate] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map(
        (item: string, i: number) => (i === index ? value : item),
      ),
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], ""],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter(
        (_: string, i: number) => i !== index,
      ),
    }));
  };

  const generateJobDescription = async () => {
    if (!formData.title || !formData.department) {
      alert("Please enter job title and department first");
      return;
    }

    setGeneratingDescription(true);
    setShowDescriptionGenerator(true);

    // Simulate AI generation with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate job description using company profile data
    const generatedDescription = `Join ${businessProfile.companyName}, a leading ${businessProfile.industry.toLowerCase()} company founded in ${businessProfile.founded}, as a ${formData.title}.

About Us:
${businessProfile.description}

Our Mission: ${businessProfile.mission}

Role Overview:
We are seeking a talented ${formData.title} to join our ${formData.department} team. In this role, you will contribute to our continued growth and innovation while working with cutting-edge technologies including ${businessProfile.technologies.slice(0, 5).join(", ")}, and more.

What You'll Do:
• Drive impactful projects for our diverse client base including ${businessProfile.clients.slice(0, 3).join(", ")}
• Collaborate with our team of ${businessProfile.employees} professionals
• Work on ${businessProfile.services.slice(0, 3).join(", ")}
• Contribute to our award-winning culture (${businessProfile.awards.slice(0, 2).join(", ")})

Why Join Us:
At ${businessProfile.companyName}, we foster a culture built on our core values: ${businessProfile.values.join(", ")}. We're committed to providing an inclusive environment where innovation thrives and every team member can grow their career.

Company Highlights:
• Industry certifications: ${businessProfile.certifications.join(", ")}
• Recognized as ${businessProfile.awards[0]}
• Headquarters in ${businessProfile.headquarters}
• Serving clients across multiple industries including healthcare, finance, and government sectors`;

    const suggestedRequirements = [
      `Bachelor's degree in ${formData.department === "Engineering" ? "Computer Science, Engineering, or related field" : formData.department === "Design" ? "Design, HCI, or related field" : formData.department === "Product" ? "Business, Product Management, or related field" : "relevant field"}`,
      formData.department === "Engineering"
        ? "Experience with modern development frameworks and cloud technologies"
        : formData.department === "Design"
          ? "Proficiency in design tools and user research methodologies"
          : "Strong analytical and problem-solving skills",
      "Excellent communication and collaboration abilities",
      "Passion for innovation and continuous learning",
      `Experience working in ${businessProfile.industry.toLowerCase()} or similar industries preferred`,
    ];

    const suggestedBenefits = [
      "Competitive salary with performance-based bonuses",
      "Comprehensive health and dental coverage",
      "Flexible working arrangements and remote options",
      "Professional development budget and conference attendance",
      "Stock options and equity participation",
      "25 days annual leave plus bank holidays",
      "State-of-the-art office facilities in London",
      "Team building activities and company events",
      "Mentorship programs and career advancement opportunities",
    ];

    setFormData((prev) => ({
      ...prev,
      description: generatedDescription,
      requirements: suggestedRequirements,
      benefits: suggestedBenefits,
    }));

    setGeneratingDescription(false);
  };

  const runAIPrediction = () => {
    if (!formData.title || !formData.department) {
      alert("Please enter job title and department first to run AI prediction");
      return;
    }
    setShowPredictionModal(true);
  };

  const createRoleFromForm = (): Role => {
    return {
      id: mockRoles.length + 1,
      title: formData.title,
      department: formData.department,
      location: formData.location,
      status: "Active",
      candidates: 0,
      shortlisted: 0,
      interviewed: 0,
      created: new Date().toISOString().split("T")[0],
      salary: formData.salary,
      priority: formData.priority,
      deiScore: Math.floor(Math.random() * 20) + 80,
      description: formData.description,
      requirements: formData.requirements.filter((req) => req.trim() !== ""),
      benefits: formData.benefits.filter((benefit) => benefit.trim() !== ""),
      shortlistedCandidates: [],
    };
  };

  const publishToBroadbean = async (role: Role) => {
    // Simulate Broadbean API integration
    const broadbeanPayload = {
      apiKey: "UPHIRE_BROADBEAN_KEY_2024",
      clientId: businessProfile.companyName.replace(/\s+/g, "_").toUpperCase(),
      role: {
        title: role.title,
        description: role.description,
        requirements: role.requirements,
        benefits: role.benefits,
        salary: role.salary,
        location: role.location,
        department: role.department,
        companyName: businessProfile.companyName,
        companyDescription: businessProfile.description,
        companyWebsite: businessProfile.website,
        industry: businessProfile.industry,
        companySize: businessProfile.employees,
        postToJobBoards: [
          "Indeed",
          "LinkedIn",
          "Monster",
          "Totaljobs",
          "Reed",
          "CV-Library",
          "JobSite",
          "Glassdoor",
        ],
        postToCompanyWebsite: true,
        autoRepost: true,
        targetAudience: "professional",
      },
    };

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      jobPostId: `BB_${Date.now()}`,
      publishedTo: broadbeanPayload.role.postToJobBoards,
      companyWebsiteUrl: `${businessProfile.website}/careers/${role.title.toLowerCase().replace(/\s+/g, "-")}`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.department ||
      !formData.location ||
      !formData.salary
    ) {
      alert(
        "Please fill in all required fields (Title, Department, Location, Salary)",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new role object
      const newRole: Role = {
        id: mockRoles.length + 1,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        status: "Active",
        candidates: 0,
        shortlisted: 0,
        interviewed: 0,
        created: new Date().toISOString().split("T")[0],
        salary: formData.salary,
        priority: formData.priority,
        deiScore: Math.floor(Math.random() * 20) + 80, // Random score 80-100
        description: formData.description,
        requirements: formData.requirements.filter((req) => req.trim() !== ""),
        benefits: formData.benefits.filter((benefit) => benefit.trim() !== ""),
        shortlistedCandidates: [],
      };

      // Add to local roles list
      mockRoles.push(newRole);

      // Publish to Broadbean (job boards + company website)
      const publishResult = await publishToBroadbean(newRole);

      // Reset form state
      setFormData({
        title: "",
        department: "",
        location: "",
        salary: "",
        priority: "Medium",
        description: "",
        requirements: [""],
        benefits: [""],
      });

      // Reset generator state
      setShowDescriptionGenerator(false);
      setGeneratingDescription(false);
      setIsSubmitting(false);

      // Close modal
      onClose();

      // Show detailed success message
      let successMessage = `✅ Role "${newRole.title}" created successfully!\n\n📢 Published to Job Boards:\n${publishResult.publishedTo.join(", ")}\n\n🌐 Company Website:\n${publishResult.companyWebsiteUrl}\n\n📊 Broadbean Job ID: ${publishResult.jobPostId}`;

      // Run AI prediction if requested
      if (runPredictionOnCreate) {
        // Add a small delay to show the role was created first
        setTimeout(() => {
          setShowPredictionModal(true);
        }, 500);
        successMessage +=
          "\n\n🧠 UPhireIQ AI prediction will open automatically...";
      }

      alert(successMessage);
    } catch (error) {
      setIsSubmitting(false);
      alert("Error creating role. Please try again.");
      console.error("Role creation error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Role
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Senior React Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. London, UK or Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.salary}
                    onChange={(e) =>
                      handleInputChange("salary", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. £60,000 - £85,000"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <button
                    type="button"
                    onClick={generateJobDescription}
                    disabled={
                      !formData.title ||
                      !formData.department ||
                      generatingDescription
                    }
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {generatingDescription ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Brain size={12} />
                        <span>AI Generate</span>
                      </>
                    )}
                  </button>
                </div>

                {showDescriptionGenerator && (
                  <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                        alt="UPhireIQ AI"
                        className="h-4 w-auto"
                      />
                      <span className="text-xs font-medium text-purple-800">
                        UPhireIQ AI Job Description Generator
                      </span>
                    </div>
                    <p className="text-xs text-purple-700">
                      Using company profile from {businessProfile.companyName} •{" "}
                      {businessProfile.industry} • Founded{" "}
                      {businessProfile.founded}
                    </p>
                  </div>
                )}

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the role, responsibilities, and what you're looking for... or click 'AI Generate' to create from company profile"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("requirements", index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 5+ years of React development experience"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("requirements", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("requirements")}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                >
                  <Plus size={16} />
                  <span>Add Requirement</span>
                </button>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) =>
                        handleArrayChange("benefits", index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Competitive salary and equity package"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("benefits", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("benefits")}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                >
                  <Plus size={16} />
                  <span>Add Benefit</span>
                </button>
              </div>
            </div>

            {/* AI Prediction Panel */}
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                    alt="UPhireIQ AI"
                    className="h-6 w-auto flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 text-sm">
                      UPhireIQ AI Success Prediction
                    </h4>
                    <p className="text-purple-700 text-xs mt-1">
                      Get AI-powered insights on hiring success probability,
                      market competitiveness, and optimization recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={runAIPrediction}
                    disabled={!formData.title || !formData.department}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <Brain size={12} />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="runPrediction"
                  checked={runPredictionOnCreate}
                  onChange={(e) => setRunPredictionOnCreate(e.target.checked)}
                  className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="runPrediction"
                  className="text-xs text-purple-700"
                >
                  Run AI prediction automatically after creating role
                </label>
              </div>
            </div>

            {/* Broadbean Integration Info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 text-sm">
                    Automated Job Board Publishing
                  </h4>
                  <p className="text-blue-700 text-xs mt-1">
                    Role will be automatically published via Broadbean.com to:
                    Indeed, LinkedIn, Monster, Totaljobs, Reed, CV-Library, and
                    your company website
                  </p>
                </div>
                <div className="text-blue-600 text-xs font-medium bg-blue-100 px-2 py-1 rounded">
                  Broadbean API
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 mt-6 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Create & Publish Role</span>
                    <ExternalLink size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* AI Prediction Modal */}
      <AIPredictionModal
        isOpen={showPredictionModal}
        onClose={() => setShowPredictionModal(false)}
        role={
          formData.title && formData.department ? createRoleFromForm() : null
        }
      />
    </div>
  );
};

// VR Performance Dashboard Component
const VRPerformanceDashboard = ({
  isOpen,
  onClose,
  candidate,
  performance
}: {
  isOpen: boolean;
  onClose: () => void;
  candidate: ShortlistedCandidate;
  performance: VRPerformance | null;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'competencies' | 'behavioral' | 'timeline' | 'replay'>('overview');

  const scenario = vrScenarios.find(s => s.id === performance?.scenarioId);

  if (!isOpen || !performance || !scenario) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{candidate.avatar}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{candidate.name} - VR Performance</h2>
                <p className="text-gray-600">{scenario.name} • Completed {performance.completedAt}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${getScoreBg(performance.overallScore)}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(performance.overallScore)}`}>
                    {performance.overallScore}
                  </div>
                  <div className="text-xs text-gray-600">Overall Score</div>
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

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'competencies', label: 'Competencies', icon: Target },
                { id: 'behavioral', label: 'Behavioral', icon: Users },
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'replay', label: 'Replay', icon: Play }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{performance.duration}m</div>
                  <div className="text-sm text-blue-700">Duration</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{performance.npcsInteracted}</div>
                  <div className="text-sm text-green-700">NPCs Interacted</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{performance.decisionsCount}</div>
                  <div className="text-sm text-purple-700">Decisions Made</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{performance.errorsCommitted}</div>
                  <div className="text-sm text-orange-700">Errors</div>
                </div>
              </div>

              {/* Performance Heatmap */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Heatmap</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(performance.competencyScores).map(([key, score]) => (
                    <div key={key} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competencies' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(performance.competencyScores).map(([key, score]) => (
                  <div key={key} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className={`h-3 rounded-full ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {score >= 85 ? 'Excellent performance with strong capabilities demonstrated' :
                       score >= 70 ? 'Good performance with room for development' :
                       'Needs improvement with additional training recommended'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'behavioral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(performance.behavioralMetrics).map(([key, value]) => (
                  <div key={key} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className={`text-xl font-bold ${
                        key === 'stressLevel'
                          ? value <= 30 ? 'text-green-600' : value <= 50 ? 'text-yellow-600' : 'text-red-600'
                          : value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {value}{key === 'stressLevel' ? '' : '/100'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className={`h-3 rounded-full ${
                          key === 'stressLevel'
                            ? value <= 30 ? 'bg-green-500' : value <= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            : value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${key === 'stressLevel' ? 100 - value : value}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {key === 'stressLevel'
                        ? value <= 30 ? 'Low stress levels - excellent composure' :
                          value <= 50 ? 'Moderate stress - manageable under pressure' :
                          'High stress levels - may need stress management training'
                        : value >= 80 ? 'Strong demonstration of this behavioral trait' :
                          value >= 60 ? 'Adequate demonstration with room for growth' :
                          'Needs development in this behavioral area'
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Performance Moments</h3>
              <div className="space-y-4">
                {performance.keyMoments.map((moment, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-sm font-medium text-gray-600">{moment.timestamp}min</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{moment.event}</h4>
                        <span className={`text-sm font-bold ${getScoreColor(moment.score)}`}>
                          {moment.score}/100
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{moment.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'replay' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <VideoIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">VR Session Replay</h3>
                <p className="text-blue-700 mb-4">Review key moments from the candidate's VR simulation</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Launch VR Replay Viewer
                </button>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Highlight Moments</h4>
                <div className="space-y-3">
                  {performance.replay.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
                      <span className="text-gray-700">{highlight}</span>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        View Clip
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Recruitment Modal Component
const AIRecruitmentModal = ({
  isOpen,
  onClose,
  roleId,
  onViewCandidates,
}: {
  isOpen: boolean;
  onClose: () => void;
  roleId: number | null;
  onViewCandidates: (role: Role) => void;
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [completed, setCompleted] = useState(false);

  const role = mockRoles.find((r) => r.id === roleId);

  const startRecruitment = async () => {
    setIsRunning(true);
    setProgress(0);
    setCompleted(false);

    const steps = [
      { label: "Analyzing job requirements...", duration: 1000 },
      { label: "Searching LinkedIn for candidates...", duration: 1500 },
      { label: "Scanning Indeed profiles...", duration: 1200 },
      { label: "Processing GitHub profiles...", duration: 1000 },
      { label: "Running UPhireIQ AI matching...", duration: 2000 },
      { label: "Generating candidate reports...", duration: 800 },
      { label: "Finalizing recruitment pipeline...", duration: 500 },
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].label);
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      setProgress(((i + 1) / steps.length) * 100);
    }

    setCurrentStep("Recruitment completed!");
    setCompleted(true);
    setIsRunning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              UPhireIQ AI Recruitment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {role && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {role.title}
              </h3>
              <p className="text-gray-600">
                {role.department} • {role.location}
              </p>
            </div>
          )}

          {!isRunning && !completed && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                    alt="UPhireIQ AI"
                    className="h-8 w-auto"
                  />
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      AI-Powered Candidate Search
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Intelligent sourcing across multiple platforms
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    LinkedIn Professional Network
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Indeed Job Portal
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    GitHub Developer Profiles
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Stack Overflow Community
                  </span>
                </div>
              </div>

              <button
                onClick={startRecruitment}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Play size={20} />
                <span>Start AI Recruitment</span>
              </button>
            </div>
          )}

          {isRunning && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">{currentStep}</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600">
                {Math.round(progress)}% Complete
              </p>
            </div>
          )}

          {completed && (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800">
                  Recruitment Complete!
                </h3>
                <p className="text-green-700">Found 28 potential candidates</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-800">AI Matches</p>
                  <p className="text-blue-600">8 candidates (85%+ match)</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-semibold text-purple-800">
                    Auto-Shortlisted
                  </p>
                  <p className="text-purple-600">5 top candidates</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (role) {
                    onViewCandidates(role);
                  }
                  onClose();
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View Candidates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// AI Prediction Modal Component
const AIPredictionModal = ({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);

  const generatePrediction = async () => {
    setIsAnalyzing(true);
    setPrediction(null);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockPrediction: PredictionData = {
      successRate: Math.floor(Math.random() * 20) + 75, // 75-95%
      confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
      factors: {
        positive: [
          "Strong market demand for this role",
          "Competitive salary range",
          "Attractive benefits package",
          "Growing company reputation",
          "Flexible working arrangements",
        ],
        risks: [
          "High competition from other companies",
          "Limited candidate pool in current market",
          "Skill requirements may be too specific",
        ],
      },
      recommendations: [
        "Consider expanding location requirements",
        "Highlight career growth opportunities",
        "Emphasize company culture and values",
        "Optimize job posting for better visibility",
      ],
    };

    setPrediction(mockPrediction);
    setIsAnalyzing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              UPhireIQ AI Success Prediction
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {role && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {role.title}
              </h3>
              <p className="text-gray-600">
                {role.department} • {role.location}
              </p>
            </div>
          )}

          {!isAnalyzing && !prediction && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                    alt="UPhireIQ AI"
                    className="h-8 w-auto"
                  />
                  <div>
                    <h4 className="font-semibold text-purple-900">
                      AI Success Prediction
                    </h4>
                    <p className="text-purple-700 text-sm">
                      Advanced analytics for hiring success
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Market demand analysis
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Salary competitiveness assessment
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Role attractiveness scoring
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Success probability calculation
                  </span>
                </div>
              </div>

              <button
                onClick={generatePrediction}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Brain size={20} />
                <span>Generate AI Prediction</span>
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">
                Analyzing role success factors...
              </p>
              <p className="text-sm text-gray-600">
                Processing market data and historical performance
              </p>
            </div>
          )}

          {prediction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {prediction.successRate}%
                  </p>
                  <p className="text-green-800 font-medium">Success Rate</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {prediction.confidence}%
                  </p>
                  <p className="text-blue-800 font-medium">AI Confidence</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Positive Factors</span>
                  </h4>
                  <ul className="space-y-1">
                    {prediction.factors.positive.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-700 pl-4">
                        • {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Risk Factors</span>
                  </h4>
                  <ul className="space-y-1">
                    {prediction.factors.risks.map((risk, index) => (
                      <li key={index} className="text-sm text-gray-700 pl-4">
                        • {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span>AI Recommendations</span>
                  </h4>
                  <ul className="space-y-1">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 pl-4">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Apply Recommendations
              </button>
            </div>
          )}
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

      {/* Modals */}
      <CreateNewRoleModal
        isOpen={showNewRoleModal}
        onClose={() => setShowNewRoleModal(false)}
      />

      <AIRecruitmentModal
        isOpen={showRecruitModal}
        onClose={() => setShowRecruitModal(false)}
        roleId={recruitingRoleId}
        onViewCandidates={(role) => {
          setViewingShortlist(role);
          setShowRecruitModal(false);
        }}
      />

      <AIPredictionModal
        isOpen={showPredictionModal}
        onClose={() => setShowPredictionModal(false)}
        role={selectedRole}
      />

      {showCalendlyModal && schedulingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Schedule Interview
                </h2>
                <button
                  onClick={() => setShowCalendlyModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Schedule an interview with{" "}
                  <strong>{schedulingCandidate.name}</strong>
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🎯 UPhireIQ AI Match:{" "}
                    <strong>{schedulingCandidate.aiMatch}%</strong>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Skills: {schedulingCandidate.skills.join(", ")}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowCalendlyModal(false);
                      // In a real app, this would open Calendly or similar
                      alert("Interview scheduled successfully!");
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm Schedule
                  </button>
                  <button
                    onClick={() => setShowCalendlyModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
          <button
            onClick={() => alert("Opening advanced candidate search...")}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
          >
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
                <button
                  onClick={() =>
                    alert(`Opening message composer for ${candidate.name}`)
                  }
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Send Message
                </button>
                <button
                  onClick={() =>
                    alert(`Preparing offer for ${candidate.name}...`)
                  }
                  className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
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

// Analytics Tab Component
const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-blue-100">
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
        <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
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
          <DollarSign className="w-8 h-8 text-blue-600" />
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
            <p className="text-sm text-blue-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              LinkedIn leading
            </p>
          </div>
          <Target className="w-8 h-8 text-purple-600" />
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
              className="bg-blue-500 h-3 rounded-full"
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
              className="bg-purple-500 h-3 rounded-full"
              style={{ width: "67%" }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Offers</span>
            <span className="text-sm font-bold text-gray-900">89 (31%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full"
              style={{ width: "31%" }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Hires</span>
            <span className="text-sm font-bold text-gray-900">47 (53%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full"
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
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Linkedin className="w-5 h-5 text-blue-600" />
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

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Github className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">GitHub</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">89 hires</p>
              <p className="text-xs text-gray-600">£2,800 avg cost</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-orange-600" />
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
                  className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
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

const EmployeesTab = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

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
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Full-Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {fullTimeEmployees.length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900">4</p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Probation Alerts */}
      {employeesOnProbation.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">
              Probation Period Alerts
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employeesOnProbation.map((employee) => {
              const startDate = new Date(employee.startDate);
              const probationEndDate = new Date(startDate);
              probationEndDate.setMonth(
                startDate.getMonth() + employee.probationMonths,
              );
              const today = new Date();
              const daysRemaining = Math.ceil(
                (probationEndDate.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={employee.id}
                  className="bg-white rounded-lg p-4 border border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {employee.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-700">
                        {daysRemaining} days
                      </p>
                      <p className="text-xs text-gray-600">remaining</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Employee Directory */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Directory
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={() => alert("Opening employee search...")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
            <button
              onClick={() => alert("Opening employee filters...")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockEmployees.map((employee) => (
            <div
              key={employee.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">
                      {employee.avatar ||
                        employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {employee.name}
                      </h4>
                      {employee.probationPeriod && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Probation
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{employee.position}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <Building className="w-4 h-4 inline mr-1" />
                          {employee.department}
                        </p>
                        <p className="text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Started: {employee.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          {employee.salary}
                        </p>
                        <p className="text-gray-600">
                          <User className="w-4 h-4 inline mr-1" />
                          {employee.manager}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openEmployeeDetails(employee)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() =>
                    alert(`Opening documents for ${employee.name}...`)
                  }
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Documents
                </button>
                <button
                  onClick={() =>
                    alert(`Opening performance review for ${employee.name}...`)
                  }
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Performance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocumentsTab = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const documentCategories = [
    "All",
    "Contracts",
    "Handbooks",
    "Legal",
    "Templates",
    "Policies",
  ];

  const filteredDocuments =
    selectedCategory === "All"
      ? mockDocuments
      : mockDocuments.filter((doc) => doc.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Document Management</h1>
          <p className="text-blue-100">
            Manage contracts, handbooks, and HR documents
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium"
          >
            <Upload size={20} />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => alert("Opening template creator...")}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Documents
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {mockDocuments.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Auto-Send Enabled
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {mockDocuments.filter((doc) => doc.autoSend).length}
              </p>
            </div>
            <Send className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Templates</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockDocuments.filter((doc) => doc.type === "Template").length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Legal Documents
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {mockDocuments.filter((doc) => doc.category === "Legal").length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Document Library
          </h3>
          <div className="flex space-x-2">
            {documentCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {document.name}
                    </h4>
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          document.category === "Legal"
                            ? "bg-red-100 text-red-800"
                            : document.category === "HR"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {document.category}
                      </span>
                      <span className="text-xs text-gray-600">
                        {document.type}
                      </span>
                      {document.autoSend && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Auto-Send
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Template: {document.template}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last modified: {document.lastModified}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => alert(`Viewing document: ${doc.name}`)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => alert(`Downloading: ${doc.name}`)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => alert(`Opening editor for: ${doc.name}`)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() =>
                    confirm(`Delete ${doc.name}?`) && alert("Document deleted")
                  }
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents found in this category</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => alert("Opening contract templates library...")}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-blue-900">Contract Templates</h4>
            <p className="text-sm text-blue-700">
              Employment contracts, NDAs, offer letters
            </p>
          </button>

          <button
            onClick={() => alert("Configuring auto-send document settings...")}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <Send className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-green-900">
              Auto-Send Documents
            </h4>
            <p className="text-sm text-green-700">
              Automatically send docs to new hires
            </p>
          </button>

          <button
            onClick={() => alert("Opening template editor...")}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <Edit className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-purple-900">Template Editor</h4>
            <p className="text-sm text-purple-700">
              Create and customize document templates
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

const SavingsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last12months");

  // Mock savings data
  const savingsData = {
    totalSavings: 247500,
    avgCostPerHire: 2340,
    previousAvgCost: 4200,
    timeSaved: 156, // hours
    efficiencyGain: 44, // percentage
    automationSavings: 89000,
    sourcingSavings: 67500,
    processSavings: 91000,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cost Savings & ROI</h1>
          <p className="text-blue-100">
            Track recruitment cost efficiency and return on investment
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            <option value="last3months" className="text-gray-900">
              Last 3 Months
            </option>
            <option value="last6months" className="text-gray-900">
              Last 6 Months
            </option>
            <option value="last12months" className="text-gray-900">
              Last 12 Months
            </option>
          </select>
          <button
            onClick={() =>
              alert("ROI and savings report exported successfully!")
            }
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Savings Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-3xl font-bold text-green-600">
                £{savingsData.totalSavings.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                vs traditional methods
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost per Hire</p>
              <p className="text-3xl font-bold text-blue-600">
                £{savingsData.avgCostPerHire.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowDown className="w-4 h-4 mr-1" />
                -44% vs industry avg
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Saved</p>
              <p className="text-3xl font-bold text-purple-600">
                {savingsData.timeSaved}h
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                per hire
              </p>
            </div>
            <Timer className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Efficiency Gain
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {savingsData.efficiencyGain}%
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                improvement
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Savings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Savings Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    UPhireIQ AI Automation
                  </p>
                  <p className="text-sm text-gray-600">
                    Automated screening & matching
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  £{savingsData.automationSavings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">36% of total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Sourcing Efficiency
                  </p>
                  <p className="text-sm text-gray-600">
                    Multi-platform integration
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  £{savingsData.sourcingSavings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">27% of total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Process Optimization
                  </p>
                  <p className="text-sm text-gray-600">Streamlined workflows</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">
                  £{savingsData.processSavings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">37% of total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ROI Comparison
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Before UPhire
                </span>
                <span className="text-lg font-bold text-red-600">
                  £{savingsData.previousAvgCost.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Average cost per hire
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  With UPhire
                </span>
                <span className="text-lg font-bold text-green-600">
                  £{savingsData.avgCostPerHire.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: "56%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Current cost per hire
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Cost Reduction
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                £
                {(
                  savingsData.previousAvgCost - savingsData.avgCostPerHire
                ).toLocaleString()}
              </p>
              <p className="text-sm text-green-700">savings per hire</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Savings Trend */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Savings Trend
        </h3>
        <div className="grid grid-cols-6 gap-4">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => {
            const savings = [15000, 18500, 22000, 19500, 24000, 21500];
            const height = (savings[index] / 24000) * 100;
            return (
              <div key={month} className="text-center">
                <div className="h-32 flex items-end justify-center mb-2">
                  <div
                    className="w-12 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t flex items-end justify-center pb-2"
                    style={{ height: `${height}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      £{(savings[index] / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{month}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Average monthly savings:{" "}
            <span className="font-bold text-green-600">
              £
              {(
                (15000 + 18500 + 22000 + 19500 + 24000 + 21500) /
                6
              ).toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Return on Investment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-blue-600">347%</p>
            <p className="text-sm text-gray-600">ROI in Year 1</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-600">8.2 months</p>
            <p className="text-sm text-gray-600">Payback Period</p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-purple-600">£428k</p>
            <p className="text-sm text-gray-600">Projected Annual Savings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
                <p>Welcome to UPhire - MVP</p>
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
