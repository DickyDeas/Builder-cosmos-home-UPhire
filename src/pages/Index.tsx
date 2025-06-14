import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
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
  MessageSquare,
  Download,
  Menu,
  X,
  Globe,
  Share2,
  ExternalLink,
  Clock,
  Target,
  Brain,
  Send,
  ThumbsUp,
  Trophy,
  Radar,
  ArrowRight,
  ChevronRight,
  Activity,
  CalendarDays,
  Video,
  MapPin as LocationIcon,
  Link,
  FileText,
  AlertTriangle,
  Heart,
  Shield,
  Calendar as CalendarIcon,
  Briefcase,
  GraduationCap,
  Settings,
  FileCheck,
  UserX,
  Timer,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Edit,
  Save,
  Lock,
  Bell,
  CreditCard,
  HelpCircle,
  Factory,
  Cpu,
  TrendingDown,
  Database,
  Lightbulb,
  BarChart2,
  PieChart,
  LineChart,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface Document {
  id: number;
  name: string;
  type: string;
  category: string;
  lastModified: string;
  autoSend: boolean;
  template: string;
}

const UPhirePlatform = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [roles, setRoles] = useState<Role[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitmentProcess, setRecruitmentProcess] = useState({
    stage: "idle", // idle, searching, outreach, ranking, complete
    searchResults: [],
    interestedCandidates: [],
    topCandidates: [],
    progress: 0,
  });
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [candidatesView, setCandidatesView] = useState({
    role: null,
    type: "", // "candidates", "shortlisted", "interviewed"
    candidates: [],
  });
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);

  // Authentication and User Profile
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    initials: "",
    role: "",
    company: "",
  });

  // Business Profile
  const [businessProfile, setBusinessProfile] = useState({
    companyName: "",
    industry: "",
    description: "",
    location: "",
    size: "",
    foundedYear: "",
    website: "",
    culture: "",
    benefits: "",
    mission: "",
    values: "",
  });

  // ML Predictions and Market Data
  const [rolePredicton, setRolePrediction] = useState(null);
  const [marketData, setMarketData] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);

  useEffect(() => {
    const mockRoles: Role[] = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "Remote/London",
        status: "active",
        candidates: 24,
        shortlisted: 5,
        interviewed: 2,
        created: "2025-06-01",
        salary: "£60,000 - £80,000",
        priority: "high",
        deiScore: 85,
      },
      {
        id: 2,
        title: "Product Manager",
        department: "Product",
        location: "London",
        status: "active",
        candidates: 18,
        shortlisted: 3,
        interviewed: 1,
        created: "2025-06-05",
        salary: "£70,000 - £90,000",
        priority: "medium",
        deiScore: 92,
      },
      {
        id: 3,
        title: "UX Designer",
        department: "Design",
        location: "Hybrid/London",
        status: "active",
        candidates: 12,
        shortlisted: 4,
        interviewed: 1,
        created: "2025-06-08",
        salary: "£45,000 - £65,000",
        priority: "medium",
        deiScore: 78,
      },
    ];

    const mockCandidates: Candidate[] = [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Senior Frontend Developer",
        email: "sarah.j@email.com",
        location: "London",
        experience: "5 years",
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        aiMatch: 94,
        status: "shortlisted",
        source: "LinkedIn",
        applied: "2025-06-10",
        avatar: "👩‍💻",
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "Senior Frontend Developer",
        email: "m.chen@email.com",
        location: "Manchester",
        experience: "7 years",
        skills: ["Vue.js", "JavaScript", "Python", "Docker"],
        aiMatch: 87,
        status: "interviewed",
        source: "Indeed",
        applied: "2025-06-08",
        avatar: "👨‍💻",
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        role: "UX Designer",
        email: "emma.r@email.com",
        location: "London",
        experience: "4 years",
        skills: ["Figma", "Sketch", "User Research", "Prototyping"],
        aiMatch: 91,
        status: "shortlisted",
        source: "Dribbble",
        applied: "2025-06-12",
        avatar: "👩‍🎨",
      },
    ];

    const mockDocuments: Document[] = [
      {
        id: 1,
        name: "Standard Offer Letter",
        type: "offer_letter",
        category: "Offers",
        lastModified: "2025-06-10",
        autoSend: true,
        template:
          "Dear {{candidate_name}}, We are delighted to offer you the position of {{role_title}} at {{company_name}}. Your starting salary will be {{salary}} and your start date is {{start_date}}.",
      },
      {
        id: 2,
        name: "Employment Contract",
        type: "contract",
        category: "Contracts",
        lastModified: "2025-06-08",
        autoSend: true,
        template:
          "EMPLOYMENT CONTRACT - Employee: {{candidate_name}}, Position: {{role_title}}, Start Date: {{start_date}}. This contract outlines the terms and conditions of employment.",
      },
      {
        id: 3,
        name: "Welcome Package",
        type: "welcome_package",
        category: "Onboarding",
        lastModified: "2025-06-05",
        autoSend: true,
        template:
          "Welcome to {{company_name}}, {{candidate_name}}! We are excited to have you join our {{department}} team as a {{role_title}}.",
      },
    ];

    const mockEmployees = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@company.com",
        avatar: "👩‍💻",
        position: "Senior Frontend Developer",
        department: "Engineering",
        startDate: "2024-03-15",
        probationEndDate: "2024-09-15",
        isProbationComplete: true,
        status: "active",
        location: "London",
        salary: "£75,000",
        manager: "Mike Chen",
        employeeId: "EMP001",
        documents: [
          {
            id: 1,
            type: "contract",
            name: "Employment Contract",
            uploadDate: "2024-03-15",
            category: "Legal",
          },
          {
            id: 2,
            type: "medical",
            name: "Health Assessment",
            uploadDate: "2024-03-20",
            category: "Medical",
          },
          {
            id: 3,
            type: "training",
            name: "Security Training Certificate",
            uploadDate: "2024-04-01",
            category: "Training",
          },
        ],
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@company.com",
        avatar: "👨‍💻",
        position: "Engineering Manager",
        department: "Engineering",
        startDate: "2023-01-10",
        probationEndDate: "2023-07-10",
        isProbationComplete: true,
        status: "active",
        location: "Manchester",
        salary: "£95,000",
        manager: "James Wilson",
        employeeId: "EMP002",
        documents: [
          {
            id: 4,
            type: "contract",
            name: "Employment Contract",
            uploadDate: "2023-01-10",
            category: "Legal",
          },
          {
            id: 5,
            type: "performance",
            name: "Annual Review 2024",
            uploadDate: "2024-01-15",
            category: "Performance",
          },
          {
            id: 6,
            type: "training",
            name: "Leadership Development",
            uploadDate: "2023-06-01",
            category: "Training",
          },
        ],
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        email: "emma.r@company.com",
        avatar: "👩‍🎨",
        position: "UX Designer",
        department: "Design",
        startDate: "2024-11-01",
        probationEndDate: "2025-05-01",
        isProbationComplete: false,
        status: "probation",
        location: "Birmingham",
        salary: "£55,000",
        manager: "Sophie Williams",
        employeeId: "EMP003",
        documents: [
          {
            id: 7,
            type: "contract",
            name: "Employment Contract",
            uploadDate: "2024-11-01",
            category: "Legal",
          },
          {
            id: 8,
            type: "medical",
            name: "Pre-employment Medical",
            uploadDate: "2024-10-28",
            category: "Medical",
          },
        ],
      },
      {
        id: 4,
        name: "James Wilson",
        email: "james.w@company.com",
        avatar: "👨‍💼",
        position: "Product Manager",
        department: "Product",
        startDate: "2024-08-01",
        probationEndDate: "2025-02-01",
        isProbationComplete: false,
        status: "probation",
        location: "London",
        salary: "£85,000",
        manager: "David Kim",
        employeeId: "EMP004",
        documents: [
          {
            id: 9,
            type: "contract",
            name: "Employment Contract",
            uploadDate: "2024-08-01",
            category: "Legal",
          },
          {
            id: 10,
            type: "disciplinary",
            name: "Verbal Warning",
            uploadDate: "2024-10-15",
            category: "Disciplinary",
          },
          {
            id: 11,
            type: "training",
            name: "Product Management Certification",
            uploadDate: "2024-09-01",
            category: "Training",
          },
        ],
      },
      {
        id: 5,
        name: "Priya Patel",
        email: "priya.p@company.com",
        avatar: "👩‍💻",
        position: "Senior Backend Developer",
        department: "Engineering",
        startDate: "2022-05-20",
        probationEndDate: "2022-11-20",
        isProbationComplete: true,
        status: "active",
        location: "Remote",
        salary: "£82,000",
        manager: "Mike Chen",
        employeeId: "EMP005",
        documents: [
          {
            id: 12,
            type: "contract",
            name: "Employment Contract",
            uploadDate: "2022-05-20",
            category: "Legal",
          },
          {
            id: 13,
            type: "medical",
            name: "Annual Health Check",
            uploadDate: "2024-05-20",
            category: "Medical",
          },
          {
            id: 14,
            type: "performance",
            name: "Promotion Review",
            uploadDate: "2024-05-15",
            category: "Performance",
          },
        ],
      },
    ];

    setRoles(mockRoles);
    setCandidates(mockCandidates);
    setDocuments(mockDocuments);
    setEmployees(mockEmployees);

    // Initialize demo user (in real app, this would come from authentication)
    setUser({
      name: "John Smith",
      email: "john.smith@techstartup.com",
      initials: "JS",
      role: "HR Director",
      company: "TechStartup Ltd",
    });

    // Initialize demo business profile
    setBusinessProfile({
      companyName: "TechStartup Ltd",
      industry: "Technology",
      description:
        "We're a cutting-edge technology company specializing in AI-powered solutions that help businesses scale efficiently. Our team is passionate about innovation and creating products that make a real difference in people's lives.",
      location: "London, UK",
      size: "50-100 employees",
      foundedYear: "2019",
      website: "www.techstartup.com",
      culture:
        "We foster a collaborative, innovative environment where creativity thrives. Our culture emphasizes work-life balance, continuous learning, and making a positive impact.",
      benefits:
        "Competitive salary, equity options, flexible working arrangements, comprehensive health insurance, £2000 learning budget, 25 days holiday plus bank holidays, mental health support, and regular team events.",
      mission:
        "To democratize AI technology and make it accessible to businesses of all sizes, helping them achieve their goals through intelligent automation.",
      values: "Innovation, Integrity, Collaboration, Excellence, Impact",
    });

    // Set logged in state for demo
    setIsLoggedIn(true);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Building },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "business", label: "My Business", icon: Factory },
    { id: "savings", label: "Savings", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  // Calendly API Integration
  const calendlyConfig = {
    apiKey: "demo_api_key", // In production, use import.meta.env.VITE_CALENDLY_API_KEY
    baseUrl: "https://api.calendly.com",
    webhookUrl: "https://your-app.com/api/calendly-webhook",
    eventTypes: {
      technical: "technical-interview-45min",
      cultural: "cultural-fit-interview-30min",
      final: "final-interview-60min",
      initial: "initial-screening-15min",
    },
  };

  const createCalendlyEventType = async (interviewType, duration) => {
    // Simulate Calendly API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uri: `https://api.calendly.com/event_types/${calendlyConfig.eventTypes[interviewType]}`,
          scheduling_url: `https://calendly.com/uphire-interviews/${calendlyConfig.eventTypes[interviewType]}`,
          name: `${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview`,
          duration: duration,
          active: true,
        });
      }, 500);
    });
  };

  const scheduleCalendlyInterview = async (candidate, interviewDetails) => {
    // Simulate Calendly API integration
    return new Promise((resolve) => {
      setTimeout(() => {
        const interview = {
          id: Date.now(),
          candidate: candidate,
          interviewer: interviewDetails.interviewer,
          type: interviewDetails.type,
          duration: interviewDetails.duration,
          schedulingUrl: `https://calendly.com/uphire-interviews/${calendlyConfig.eventTypes[interviewDetails.type]}?prefill_name=${encodeURIComponent(candidate.name)}&prefill_email=${encodeURIComponent(candidate.email)}`,
          status: "scheduled",
          createdAt: new Date().toISOString(),
          meetingDetails: {
            platform: interviewDetails.platform,
            location: interviewDetails.location,
            instructions: interviewDetails.instructions,
          },
        };

        setScheduledInterviews((prev) => [...prev, interview]);
        resolve(interview);
      }, 1000);
    });
  };

  const sendInterviewInvitation = async (interview) => {
    // Simulate sending invitation email with Calendly link
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          emailSent: true,
          calendlyLinkSent: true,
          confirmationId: `CONF_${Date.now()}`,
        });
      }, 500);
    });
  };

  // Market Data API Integration (simulated for ITJobsWatch.com)
  const fetchMarketData = async (jobTitle, location, department) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const marketInsights = {
          salary: {
            min: generateSalaryRange(jobTitle, department).min,
            max: generateSalaryRange(jobTitle, department).max,
            median: generateSalaryRange(jobTitle, department).median,
            percentile90: generateSalaryRange(jobTitle, department)
              .percentile90,
          },
          demand: {
            level: getDemandLevel(jobTitle, department),
            trend: getTrendDirection(jobTitle),
            competition: getCompetitionLevel(jobTitle, location),
            timeToFill: getTimeToFill(jobTitle, department),
          },
          skills: {
            required: getRequiredSkills(jobTitle, department),
            emerging: getEmergingSkills(jobTitle),
            rare: getRareSkills(jobTitle),
          },
          location: {
            hotspots: getLocationHotspots(jobTitle),
            remoteAvailability: getRemoteAvailability(jobTitle),
            relocationWillingness: getRelocationData(jobTitle),
          },
        };
        resolve(marketInsights);
      }, 1500);
    });
  };

  // ML Prediction Engine
  const predictRoleSuccess = async (roleData, marketData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const factors = analyzeSuccessFactors(roleData, marketData);
        const prediction = {
          successRate: factors.overallScore,
          confidence: factors.confidence,
          factors: factors.breakdown,
          recommendations: generateRecommendations(factors),
          alternatives: generateAlternatives(roleData, factors),
          risks: identifyRisks(factors),
          timeline: predictTimeline(factors),
        };
        resolve(prediction);
      }, 2000);
    });
  };

  // Helper functions for ML predictions
  const generateSalaryRange = (title, department) => {
    const baseSalaries = {
      "Senior Frontend Developer": { min: 55000, max: 85000, median: 70000 },
      "Product Manager": { min: 65000, max: 95000, median: 80000 },
      "UX Designer": { min: 40000, max: 70000, median: 55000 },
      "Backend Developer": { min: 50000, max: 80000, median: 65000 },
      "Data Scientist": { min: 60000, max: 100000, median: 80000 },
    };

    const base = baseSalaries[title] || {
      min: 35000,
      max: 65000,
      median: 50000,
    };
    return {
      ...base,
      percentile90: Math.round(base.max * 1.15),
    };
  };

  const getDemandLevel = (title, department) => {
    const demandLevels = {
      "Senior Frontend Developer": "High",
      "Product Manager": "Very High",
      "UX Designer": "Medium",
      "Data Scientist": "Very High",
      "Backend Developer": "High",
    };
    return demandLevels[title] || "Medium";
  };

  const getTrendDirection = (title) => {
    const trends = {
      "Senior Frontend Developer": "Growing",
      "Product Manager": "Stable",
      "UX Designer": "Growing",
      "Data Scientist": "Rapidly Growing",
      "Backend Developer": "Stable",
    };
    return trends[title] || "Stable";
  };

  const getCompetitionLevel = (title, location) => {
    if (location?.includes("London")) return "Very High";
    if (location?.includes("Manchester") || location?.includes("Birmingham"))
      return "High";
    return "Medium";
  };

  const getTimeToFill = (title, department) => {
    const timeframes = {
      "Senior Frontend Developer": 35,
      "Product Manager": 45,
      "UX Designer": 28,
      "Data Scientist": 52,
      "Backend Developer": 38,
    };
    return timeframes[title] || 30;
  };

  const getRequiredSkills = (title, department) => {
    const skillSets = {
      "Senior Frontend Developer": [
        "React",
        "TypeScript",
        "JavaScript",
        "CSS",
        "Git",
      ],
      "Product Manager": [
        "Strategy",
        "Analytics",
        "Agile",
        "Stakeholder Management",
      ],
      "UX Designer": [
        "Figma",
        "User Research",
        "Prototyping",
        "Design Systems",
      ],
      "Data Scientist": ["Python", "Machine Learning", "SQL", "Statistics"],
      "Backend Developer": ["Node.js", "Python", "Databases", "APIs", "Cloud"],
    };
    return skillSets[title] || ["Communication", "Problem Solving", "Teamwork"];
  };

  const getEmergingSkills = (title) => {
    const emerging = {
      "Senior Frontend Developer": ["Next.js", "Svelte", "WebAssembly"],
      "Product Manager": ["AI/ML Understanding", "Web3", "Blockchain"],
      "UX Designer": ["AR/VR Design", "Voice UI", "AI-Assisted Design"],
      "Data Scientist": ["MLOps", "Computer Vision", "NLP"],
      "Backend Developer": ["Kubernetes", "Serverless", "GraphQL"],
    };
    return emerging[title] || ["AI Tools", "Automation"];
  };

  const getRareSkills = (title) => {
    return ["Leadership", "Mentoring", "Cross-functional Collaboration"];
  };

  const getLocationHotspots = (title) => {
    return ["London", "Manchester", "Edinburgh", "Bristol", "Remote"];
  };

  const getRemoteAvailability = (title) => {
    const remoteRates = {
      "Senior Frontend Developer": 85,
      "Product Manager": 70,
      "UX Designer": 75,
      "Data Scientist": 80,
      "Backend Developer": 90,
    };
    return remoteRates[title] || 60;
  };

  const getRelocationData = (title) => {
    return 45; // 45% willing to relocate
  };

  const analyzeSuccessFactors = (roleData, marketData) => {
    let totalScore = 0;
    let factors = {};

    // Salary competitiveness (25% weight)
    const salaryRange =
      parseFloat(roleData.salary?.split("-")[1]?.replace(/[£,]/g, "")) || 50000;
    const marketMedian = marketData.salary?.median || 50000;
    const salaryScore = Math.min(100, (salaryRange / marketMedian) * 100);
    factors.salary = {
      score: salaryScore,
      weight: 0.25,
      impact:
        salaryScore >= 90
          ? "Positive"
          : salaryScore >= 70
            ? "Neutral"
            : "Negative",
    };
    totalScore += salaryScore * 0.25;

    // Location attractiveness (20% weight)
    const locationScore = roleData.location?.includes("London")
      ? 85
      : roleData.location?.includes("Remote")
        ? 90
        : roleData.location?.includes("Manchester")
          ? 75
          : 70;
    factors.location = {
      score: locationScore,
      weight: 0.2,
      impact: locationScore >= 80 ? "Positive" : "Neutral",
    };
    totalScore += locationScore * 0.2;

    // Market demand (20% weight)
    const demandScore =
      marketData.demand?.level === "Very High"
        ? 95
        : marketData.demand?.level === "High"
          ? 85
          : marketData.demand?.level === "Medium"
            ? 70
            : 55;
    factors.demand = {
      score: demandScore,
      weight: 0.2,
      impact: demandScore >= 80 ? "Positive" : "Neutral",
    };
    totalScore += demandScore * 0.2;

    // Company profile completeness (15% weight)
    const profileScore = businessProfile.description ? 85 : 60;
    factors.profile = {
      score: profileScore,
      weight: 0.15,
      impact: profileScore >= 80 ? "Positive" : "Neutral",
    };
    totalScore += profileScore * 0.15;

    // Skills alignment (10% weight)
    const skillsScore = roleData.skills ? 80 : 60;
    factors.skills = {
      score: skillsScore,
      weight: 0.1,
      impact: skillsScore >= 75 ? "Positive" : "Neutral",
    };
    totalScore += skillsScore * 0.1;

    // Experience requirements (10% weight)
    const experienceScore = roleData.experience ? 75 : 70;
    factors.experience = {
      score: experienceScore,
      weight: 0.1,
      impact: "Neutral",
    };
    totalScore += experienceScore * 0.1;

    return {
      overallScore: Math.round(totalScore),
      confidence: totalScore >= 80 ? 95 : totalScore >= 60 ? 85 : 70,
      breakdown: factors,
    };
  };

  const generateRecommendations = (factors) => {
    const recommendations = [];

    if (factors.breakdown.salary.score < 70) {
      recommendations.push({
        type: "salary",
        priority: "high",
        title: "Increase Salary Range",
        description:
          "Current salary is below market rate. Consider increasing by 15-20%.",
        impact: "+12% success rate",
      });
    }

    if (factors.breakdown.location.score < 75) {
      recommendations.push({
        type: "location",
        priority: "medium",
        title: "Add Remote Option",
        description:
          "Consider hybrid/remote work to attract wider talent pool.",
        impact: "+8% success rate",
      });
    }

    if (factors.breakdown.profile.score < 80) {
      recommendations.push({
        type: "profile",
        priority: "medium",
        title: "Enhance Job Description",
        description: "Add company culture and benefits information.",
        impact: "+5% success rate",
      });
    }

    return recommendations;
  };

  const generateAlternatives = (roleData, factors) => {
    if (factors.overallScore >= 70) return [];

    return [
      {
        title: `Junior ${roleData.title}`,
        reason: "Lower experience requirements increase candidate pool",
        expectedSuccess: factors.overallScore + 15,
        changes: [
          "Reduce experience requirement",
          "Adjust salary range",
          "Add training program",
        ],
      },
      {
        title: `${roleData.title} (Contract)`,
        reason: "Contract roles often fill faster with higher rates",
        expectedSuccess: factors.overallScore + 12,
        changes: [
          "Convert to contract position",
          "Increase daily rate",
          "Shorter commitment",
        ],
      },
      {
        title: `Remote ${roleData.title}`,
        reason: "Remote positions attract 3x more candidates",
        expectedSuccess: factors.overallScore + 20,
        changes: [
          "Make fully remote",
          "Expand location reach",
          "Add remote-first culture",
        ],
      },
    ];
  };

  const identifyRisks = (factors) => {
    const risks = [];

    if (factors.breakdown.salary.score < 60) {
      risks.push({
        level: "high",
        factor: "Salary",
        description:
          "Below-market salary will significantly reduce applications",
        mitigation: "Increase salary or add equity/benefits",
      });
    }

    if (factors.breakdown.demand.score > 90) {
      risks.push({
        level: "medium",
        factor: "High Competition",
        description: "Very competitive market with many similar roles",
        mitigation: "Highlight unique benefits and fast hiring process",
      });
    }

    return risks;
  };

  const predictTimeline = (factors) => {
    const baseTime = 30; // days
    let adjustedTime = baseTime;

    if (factors.breakdown.salary.score < 70) adjustedTime += 10;
    if (factors.breakdown.demand.score > 90) adjustedTime += 7;
    if (factors.breakdown.location.score < 75) adjustedTime += 5;

    return {
      estimated: adjustedTime,
      confidence: factors.confidence,
      factors: [
        {
          name: "Market Competition",
          impact: factors.breakdown.demand.score > 90 ? "+7 days" : "Neutral",
        },
        {
          name: "Salary Competitiveness",
          impact: factors.breakdown.salary.score < 70 ? "+10 days" : "Neutral",
        },
        {
          name: "Location Appeal",
          impact: factors.breakdown.location.score < 75 ? "+5 days" : "Neutral",
        },
      ],
    };
  };

  const generateMockCandidatesForRole = (role: Role, type: string) => {
    const candidatePool = [
      {
        name: "Sarah Johnson",
        avatar: "👩‍💻",
        email: "sarah.j@email.com",
        location: "London",
        experience: "5 years",
        skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
        source: "LinkedIn",
        applied: "2025-06-10",
        notes: "Excellent portfolio showcasing modern React applications",
        lastContact: "2025-06-12",
      },
      {
        name: "Michael Chen",
        avatar: "👨‍💻",
        email: "m.chen@email.com",
        location: "Manchester",
        experience: "7 years",
        skills: ["Vue.js", "JavaScript", "Python", "Docker", "Kubernetes"],
        source: "Indeed",
        applied: "2025-06-08",
        notes: "Strong background in full-stack development and DevOps",
        lastContact: "2025-06-11",
      },
      {
        name: "Emma Rodriguez",
        avatar: "👩‍🎨",
        email: "emma.r@email.com",
        location: "Birmingham",
        experience: "4 years",
        skills: ["Figma", "Sketch", "User Research", "Prototyping", "CSS"],
        source: "Dribbble",
        applied: "2025-06-12",
        notes: "Award-winning UX designer with enterprise experience",
        lastContact: "2025-06-13",
      },
      {
        name: "James Wilson",
        avatar: "👨‍💼",
        email: "james.w@email.com",
        location: "Edinburgh",
        experience: "6 years",
        skills: ["Product Management", "Agile", "Analytics", "Strategy"],
        source: "LinkedIn",
        applied: "2025-06-09",
        notes: "Led product teams at high-growth startups",
        lastContact: "2025-06-14",
      },
      {
        name: "Priya Patel",
        avatar: "👩‍💻",
        email: "priya.p@email.com",
        location: "London",
        experience: "8 years",
        skills: ["React", "Angular", "TypeScript", "Testing", "CI/CD"],
        source: "GitHub",
        applied: "2025-06-07",
        notes: "Open source contributor with 50+ repositories",
        lastContact: "2025-06-10",
      },
      {
        name: "Alex Thompson",
        avatar: "👨‍💻",
        email: "alex.t@email.com",
        location: "Bristol",
        experience: "5 years",
        skills: ["React", "Next.js", "Tailwind", "Vercel", "Stripe"],
        source: "AngelList",
        applied: "2025-06-11",
        notes: "Former startup founder with strong technical skills",
        lastContact: "2025-06-13",
      },
      {
        name: "Sophie Williams",
        avatar: "👩‍💼",
        email: "sophie.w@email.com",
        location: "Glasgow",
        experience: "9 years",
        skills: ["Sales", "CRM", "Salesforce", "Lead Generation", "Analytics"],
        source: "Indeed",
        applied: "2025-06-06",
        notes: "Consistently exceeded sales targets by 150%",
        lastContact: "2025-06-12",
      },
      {
        name: "David Kim",
        avatar: "👨‍💻",
        email: "david.k@email.com",
        location: "Leeds",
        experience: "4 years",
        skills: ["React", "Redux", "Jest", "Cypress", "Webpack"],
        source: "Stack Overflow",
        applied: "2025-06-13",
        notes: "Active community contributor with high reputation",
        lastContact: "2025-06-14",
      },
    ];

    let count = 0;
    let statusType = "applied";

    switch (type) {
      case "candidates":
        count = role.candidates;
        statusType = "applied";
        break;
      case "shortlisted":
        count = role.shortlisted;
        statusType = "shortlisted";
        break;
      case "interviewed":
        count = role.interviewed;
        statusType = "interviewed";
        break;
    }

    const selectedCandidates = candidatePool
      .slice(0, count)
      .map((candidate, index) => ({
        id: Date.now() + index,
        ...candidate,
        role: role.title,
        status: statusType,
        aiMatch: Math.floor(Math.random() * 15) + 85, // 85-100% match
      }));

    // Sort by AI match score (highest first)
    return selectedCandidates.sort((a, b) => b.aiMatch - a.aiMatch);
  };

  const handleViewCandidates = (role: Role, type: string) => {
    const candidates = generateMockCandidatesForRole(role, type);
    setCandidatesView({
      role,
      type,
      candidates,
    });
    setShowCandidatesModal(true);
  };

  const calculateTenure = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`;
    }
  };

  const calculateProbationRemaining = (probationEndDate: string) => {
    const end = new Date(probationEndDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return "Complete";
    } else if (diffDays < 30) {
      return `${diffDays} days remaining`;
    } else {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return `${months} month${months > 1 ? "s" : ""}${remainingDays > 0 ? `, ${remainingDays} day${remainingDays > 1 ? "s" : ""}` : ""} remaining`;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "contract":
        return "📝";
      case "medical":
        return "🏥";
      case "disciplinary":
        return "⚠️";
      case "performance":
        return "📊";
      case "training":
        return "🎓";
      case "legal":
        return "⚖️";
      default:
        return "📄";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "probation":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "notice":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const DocumentModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      type: "offer_letter",
      category: "Offers",
      template: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newDocument: Document = {
        id: documents.length + 1,
        ...formData,
        lastModified: new Date().toISOString().split("T")[0],
        autoSend: true,
      };
      setDocuments([...documents, newDocument]);
      setShowDocumentModal(false);
      setFormData({
        name: "",
        type: "offer_letter",
        category: "Offers",
        template: "",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Document Template
            </h2>
            <button
              onClick={() => setShowDocumentModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Senior Developer Offer Letter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="offer_letter">Offer Letter</option>
                <option value="contract">Contract</option>
                <option value="nda">NDA</option>
                <option value="welcome_package">Welcome Package</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Content
              </label>
              <textarea
                required
                rows={6}
                value={formData.template}
                onChange={(e) =>
                  setFormData({ ...formData, template: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Use variables like {{candidate_name}}, {{role_title}}, {{company_name}}, {{salary}}, {{start_date}}"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowDocumentModal(false)}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const LoginModal = () => {
    const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
    });

    const handleLogin = () => {
      // In real app, this would authenticate with backend
      const userData = {
        name: "John Smith",
        email: loginForm.email,
        initials: loginForm.email
          .split("@")[0]
          .split(".")
          .map((part) => part[0].toUpperCase())
          .join(""),
        role: "HR Director",
        company: "TechStartup Ltd",
      };

      setUser(userData);
      setIsLoggedIn(true);
      setShowLoginModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md">
          <div className="p-6">
            <div className="text-center mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fe3ae173b79f74e84b0580a7f82f9aa6c%2Fa30864f8cb98481d9e88e08c10e577ec?format=webp&width=800"
                alt="UPhire"
                className="h-12 w-auto mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to UPhire
              </h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Sign In
              </button>

              <p className="text-center text-sm text-gray-600">
                Demo: Use any email and password
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsModal = () => {
    const [settingsTab, setSettingsTab] = useState("profile");
    const [profileForm, setProfileForm] = useState(user);

    const settingsTabs = [
      { id: "profile", label: "Profile", icon: User },
      { id: "security", label: "Security", icon: Lock },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "billing", label: "Billing", icon: CreditCard },
    ];

    const handleSaveProfile = () => {
      setUser(profileForm);
      alert("Profile updated successfully!");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex">
            <div className="w-1/4 bg-gray-50 p-4">
              <nav className="space-y-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsTab(tab.id)}
                      className={cn(
                        "w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        settingsTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex-1 p-6">
              {settingsTab === "profile" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileForm.role}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            company: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}

              {settingsTab === "security" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Change Password</p>
                          <p className="text-sm text-gray-600">
                            Update your account password
                          </p>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security
                          </p>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === "notifications" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">
                          Receive updates via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="toggle"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">New Candidate Alerts</p>
                        <p className="text-sm text-gray-600">
                          Get notified when new candidates apply
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === "billing" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Billing & Subscription
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-green-800">
                          Growth Plan
                        </p>
                        <p className="text-sm text-green-600">
                          £650/month - Active
                        </p>
                      </div>
                      <button className="text-green-700 hover:text-green-800 font-medium">
                        Manage Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PredictionModal = () => {
    if (!currentPrediction) return null;

    const getSuccessColor = (rate) => {
      if (rate >= 80) return "text-green-600";
      if (rate >= 60) return "text-yellow-600";
      return "text-red-600";
    };

    const getSuccessIcon = (rate) => {
      if (rate >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
      if (rate >= 60)
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      return <XCircle className="w-5 h-5 text-red-600" />;
    };

    const getRiskColor = (level) => {
      switch (level) {
        case "high":
          return "bg-red-100 text-red-800 border-red-200";
        case "medium":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "low":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Success Prediction
                </h2>
                <p className="text-sm text-gray-600">
                  Machine learning analysis for role success
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPredictionModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Prediction */}
              <div className="lg:col-span-2 space-y-6">
                {/* Success Rate */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Success Prediction
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getSuccessIcon(currentPrediction.successRate)}
                      <span
                        className={`text-2xl font-bold ${getSuccessColor(currentPrediction.successRate)}`}
                      >
                        {currentPrediction.successRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${currentPrediction.successRate >= 80 ? "bg-green-500" : currentPrediction.successRate >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${currentPrediction.successRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Confidence: {currentPrediction.confidence}% • Timeline:{" "}
                    {currentPrediction.timeline.estimated} days
                  </p>
                </div>

                {/* Success Factors Breakdown */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Success Factors Analysis
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(currentPrediction.factors).map(
                      ([key, factor]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="font-medium capitalize">
                              {key}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                factor.impact === "Positive"
                                  ? "bg-green-100 text-green-800"
                                  : factor.impact === "Negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {factor.impact}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${factor.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">
                              {Math.round(factor.score)}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {currentPrediction.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <span>AI Recommendations</span>
                    </h3>
                    <div className="space-y-3">
                      {currentPrediction.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-blue-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {rec.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rec.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {rec.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {rec.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {rec.impact}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative Suggestions */}
                {currentPrediction.alternatives.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span>Alternative Role Suggestions</span>
                    </h3>
                    <div className="space-y-3">
                      {currentPrediction.alternatives.map((alt, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-yellow-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {alt.title}
                            </h4>
                            <span className="text-lg font-bold text-green-600">
                              {alt.expectedSuccess}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {alt.reason}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {alt.changes.map((change, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {change}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Market Data */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span>Market Insights</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        Market Salary Range
                      </p>
                      <p className="font-medium">
                        £{marketData.salary?.min.toLocaleString()} - £
                        {marketData.salary?.max.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Median: £{marketData.salary?.median.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Demand Level</p>
                      <p className="font-medium">{marketData.demand?.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Average Time to Fill
                      </p>
                      <p className="font-medium">
                        {marketData.demand?.timeToFill} days
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Remote Availability
                      </p>
                      <p className="font-medium">
                        {marketData.location?.remoteAvailability}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risks */}
                {currentPrediction.risks.length > 0 && (
                  <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span>Risk Assessment</span>
                    </h3>
                    <div className="space-y-3">
                      {currentPrediction.risks.map((risk, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-3 border ${getRiskColor(risk.level)}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium">{risk.factor}</p>
                            <span className="text-xs uppercase tracking-wide">
                              {risk.level}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{risk.description}</p>
                          <p className="text-xs font-medium">
                            Mitigation: {risk.mitigation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Prediction */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Timeline Forecast</span>
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-blue-600">
                      {currentPrediction.timeline.estimated}
                    </p>
                    <p className="text-sm text-gray-600">days to fill</p>
                  </div>
                  <div className="space-y-2">
                    {currentPrediction.timeline.factors.map((factor, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{factor.name}</span>
                        <span
                          className={
                            factor.impact === "Neutral"
                              ? "text-gray-500"
                              : "text-red-600"
                          }
                        >
                          {factor.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Powered by AI analysis of market data from ITJobsWatch, Indeed,
                LinkedIn, and internal metrics
              </p>
              <button
                onClick={() => setShowPredictionModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DocumentUploadModal = () => {
    const [uploadForm, setUploadForm] = useState({
      type: "medical",
      name: "",
      category: "Medical",
      file: null,
      notes: "",
    });

    const documentTypes = [
      { value: "medical", label: "Medical Record", category: "Medical" },
      {
        value: "disciplinary",
        label: "Disciplinary Action",
        category: "Disciplinary",
      },
      {
        value: "performance",
        label: "Performance Review",
        category: "Performance",
      },
      {
        value: "training",
        label: "Training Certificate",
        category: "Training",
      },
      { value: "legal", label: "Legal Document", category: "Legal" },
      { value: "contract", label: "Contract Amendment", category: "Legal" },
      {
        value: "personal",
        label: "Personal Information",
        category: "Personal",
      },
    ];

    const handleUpload = () => {
      const newDocument = {
        id: Date.now(),
        type: uploadForm.type,
        name: uploadForm.name,
        uploadDate: new Date().toISOString().split("T")[0],
        category: uploadForm.category,
        notes: uploadForm.notes,
      };

      // Update employee's documents
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee?.id
            ? { ...emp, documents: [...emp.documents, newDocument] }
            : emp,
        ),
      );

      setShowDocumentUploadModal(false);
      setUploadForm({
        type: "medical",
        name: "",
        category: "Medical",
        file: null,
        notes: "",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
            <button
              onClick={() => setShowDocumentUploadModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => {
                  const selectedType = documentTypes.find(
                    (t) => t.value === e.target.value,
                  );
                  setUploadForm({
                    ...uploadForm,
                    type: e.target.value,
                    category: selectedType?.category || "General",
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter document name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      file: e.target.files?.[0] || null,
                    })
                  }
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <FileText className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </label>
              </div>
              {uploadForm.file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {uploadForm.file.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={uploadForm.notes}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, notes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t">
            <button
              onClick={() => setShowDocumentUploadModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadForm.name || !uploadForm.file}
              className={cn(
                "px-6 py-2 rounded-lg transition-all",
                uploadForm.name && uploadForm.file
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg"
                  : "bg-gray-400 text-white cursor-not-allowed",
              )}
            >
              Upload Document
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EmployeeDetailModal = () => {
    if (!selectedEmployee) return null;

    const tenure = calculateTenure(selectedEmployee.startDate);
    const probationStatus = selectedEmployee.isProbationComplete
      ? "Complete"
      : calculateProbationRemaining(selectedEmployee.probationEndDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{selectedEmployee.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedEmployee.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedEmployee.position} • {selectedEmployee.employeeId}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEmployeeModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Employee Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">
                        {selectedEmployee.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedEmployee.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">
                        {selectedEmployee.startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tenure</p>
                      <p className="font-medium">{tenure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Manager</p>
                      <p className="font-medium">{selectedEmployee.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Documents ({selectedEmployee.documents.length})
                    </h3>
                    <button
                      onClick={() => setShowDocumentUploadModal(true)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Plus size={14} />
                      <span>Add Document</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedEmployee.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white rounded-lg p-4 border"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {getDocumentIcon(doc.type)}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{doc.category}</span>
                                <span>Uploaded: {doc.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm">
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getStatusColor(selectedEmployee.status),
                        )}
                      >
                        {selectedEmployee.status.charAt(0).toUpperCase() +
                          selectedEmployee.status.slice(1)}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Probation Status
                      </p>
                      <div className="flex items-center space-x-2">
                        {selectedEmployee.isProbationComplete ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Timer className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className="text-sm font-medium">
                          {probationStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-100 rounded-lg">
                      <Mail size={16} />
                      <span>Send Email</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-100 rounded-lg">
                      <Calendar size={16} />
                      <span>Schedule Meeting</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-100 rounded-lg">
                      <BarChart3 size={16} />
                      <span>Performance Review</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-100 rounded-lg">
                      <Settings size={16} />
                      <span>Edit Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InterviewSchedulingModal = () => {
    const [interviewForm, setInterviewForm] = useState({
      type: "technical",
      duration: 45,
      interviewer: "",
      platform: "zoom",
      location: "",
      instructions: "",
      sendCalendly: true,
      autoReminder: true,
    });
    const [isScheduling, setIsScheduling] = useState(false);
    const [schedulingComplete, setSchedulingComplete] = useState(false);
    const [calendlyLink, setCalendlyLink] = useState("");

    const interviewTypes = [
      {
        value: "initial",
        label: "Initial Screening",
        duration: 15,
        description: "Quick fit assessment",
      },
      {
        value: "technical",
        label: "Technical Interview",
        duration: 45,
        description: "Skills and coding assessment",
      },
      {
        value: "cultural",
        label: "Cultural Fit",
        duration: 30,
        description: "Team fit and values alignment",
      },
      {
        value: "final",
        label: "Final Interview",
        duration: 60,
        description: "Leadership and decision making",
      },
    ];

    const platforms = [
      { value: "zoom", label: "Zoom", icon: "🎥" },
      { value: "teams", label: "Microsoft Teams", icon: "📺" },
      { value: "meet", label: "Google Meet", icon: "📹" },
      { value: "phone", label: "Phone Call", icon: "��" },
      { value: "in-person", label: "In Person", icon: "🏢" },
    ];

    const handleScheduleInterview = async () => {
      setIsScheduling(true);

      try {
        // Create Calendly event type
        const eventType = await createCalendlyEventType(
          interviewForm.type,
          interviewForm.duration,
        );

        // Schedule the interview
        const interview = await scheduleCalendlyInterview(selectedCandidate, {
          ...interviewForm,
          calendlyEventType: eventType.uri,
        });

        // Send invitation
        await sendInterviewInvitation(interview);

        setCalendlyLink(interview.schedulingUrl);
        setSchedulingComplete(true);

        // Update candidate status if it's their first interview
        if (selectedCandidate.status === "shortlisted") {
          // Update the candidate's status to interviewed
          console.log("Candidate status updated to interviewed");
        }
      } catch (error) {
        console.error("Failed to schedule interview:", error);
      } finally {
        setIsScheduling(false);
      }
    };

    const resetModal = () => {
      setInterviewForm({
        type: "technical",
        duration: 45,
        interviewer: "",
        platform: "zoom",
        location: "",
        instructions: "",
        sendCalendly: true,
        autoReminder: true,
      });
      setIsScheduling(false);
      setSchedulingComplete(false);
      setCalendlyLink("");
    };

    const handleClose = () => {
      setShowInterviewModal(false);
      resetModal();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Schedule Interview
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedCandidate?.name} • {selectedCandidate?.role}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            {!schedulingComplete ? (
              <div className="space-y-6">
                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {interviewTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() =>
                          setInterviewForm({
                            ...interviewForm,
                            type: type.value,
                            duration: type.duration,
                          })
                        }
                        className={cn(
                          "p-4 rounded-lg border-2 text-left transition-all",
                          interviewForm.type === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <div className="font-medium text-gray-900">
                          {type.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {type.duration} minutes
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {type.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interviewer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interviewer
                  </label>
                  <select
                    value={interviewForm.interviewer}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        interviewer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Interviewer</option>
                    <option value="sarah.johnson@company.com">
                      Sarah Johnson - Engineering Manager
                    </option>
                    <option value="mike.chen@company.com">
                      Mike Chen - Senior Developer
                    </option>
                    <option value="emma.wilson@company.com">
                      Emma Wilson - HR Director
                    </option>
                    <option value="james.brown@company.com">
                      James Brown - CTO
                    </option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Meeting Platform
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.value}
                        onClick={() =>
                          setInterviewForm({
                            ...interviewForm,
                            platform: platform.value,
                          })
                        }
                        className={cn(
                          "p-3 rounded-lg border-2 text-center transition-all",
                          interviewForm.platform === platform.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <div className="text-2xl mb-1">{platform.icon}</div>
                        <div className="text-sm font-medium">
                          {platform.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location (for in-person) */}
                {interviewForm.platform === "in-person" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Location
                    </label>
                    <input
                      type="text"
                      value={interviewForm.location}
                      onChange={(e) =>
                        setInterviewForm({
                          ...interviewForm,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. London Office, Conference Room A"
                    />
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={interviewForm.instructions}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        instructions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any specific instructions for the candidate..."
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="sendCalendly"
                      type="checkbox"
                      checked={interviewForm.sendCalendly}
                      onChange={(e) =>
                        setInterviewForm({
                          ...interviewForm,
                          sendCalendly: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sendCalendly"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Send Calendly scheduling link to candidate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="autoReminder"
                      type="checkbox"
                      checked={interviewForm.autoReminder}
                      onChange={(e) =>
                        setInterviewForm({
                          ...interviewForm,
                          autoReminder: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="autoReminder"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Send automatic reminders (24h and 1h before)
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Interview Scheduled Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Calendly link has been sent to {selectedCandidate?.name}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CalendarDays className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium text-green-800">
                        {
                          interviewTypes.find(
                            (t) => t.value === interviewForm.type,
                          )?.label
                        }
                      </p>
                      <p className="text-sm text-green-600">
                        {interviewForm.duration} minutes •{" "}
                        {
                          platforms.find(
                            (p) => p.value === interviewForm.platform,
                          )?.label
                        }
                      </p>
                      <p className="text-sm text-green-600">
                        Interviewer:{" "}
                        {interviewForm.interviewer
                          .split("@")[0]
                          .replace(".", " ")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-medium text-blue-800">
                        Calendly Scheduling Link
                      </p>
                      <p className="text-sm text-blue-600">
                        Candidate can pick their preferred time
                      </p>
                    </div>
                    <a
                      href={calendlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Link size={16} />
                      <span>View Link</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {schedulingComplete ? "Close" : "Cancel"}
              </button>

              {!schedulingComplete && (
                <button
                  onClick={handleScheduleInterview}
                  disabled={isScheduling || !interviewForm.interviewer}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-2 rounded-lg transition-all",
                    isScheduling || !interviewForm.interviewer
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg",
                  )}
                >
                  {isScheduling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <CalendarDays size={16} />
                      <span>Schedule Interview</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CandidatesDetailModal = () => {
    const getStatusBadgeColor = (status: string) => {
      switch (status) {
        case "applied":
          return "bg-blue-100 text-blue-800";
        case "shortlisted":
          return "bg-yellow-100 text-yellow-800";
        case "interviewed":
          return "bg-green-100 text-green-800";
        case "hired":
          return "bg-purple-100 text-purple-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getTypeTitle = (type: string) => {
      switch (type) {
        case "candidates":
          return "All Candidates";
        case "shortlisted":
          return "Shortlisted Candidates";
        case "interviewed":
          return "Interviewed Candidates";
        default:
          return "Candidates";
      }
    };

    const getTypeDescription = (type: string, count: number) => {
      switch (type) {
        case "candidates":
          return `${count} total candidates have applied for this role`;
        case "shortlisted":
          return `${count} candidates have been shortlisted for review`;
        case "interviewed":
          return `${count} candidates have completed interviews`;
        default:
          return `${count} candidates`;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getTypeTitle(candidatesView.type)} -{" "}
                {candidatesView.role?.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {getTypeDescription(
                  candidatesView.type,
                  candidatesView.candidates.length,
                )}{" "}
                • Ranked by AI match score
              </p>
            </div>
            <button
              onClick={() => setShowCandidatesModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            {candidatesView.candidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No candidates found for this category.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidatesView.candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div className="text-3xl">{candidate.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {candidate.name}
                            </h3>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                getStatusBadgeColor(candidate.status),
                              )}
                            >
                              {candidate.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {candidate.role}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Mail size={14} />
                              <span>{candidate.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>{candidate.location}</span>
                            </span>
                            <span>{candidate.experience}</span>
                            <span>Applied: {candidate.applied}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {candidate.aiMatch}%
                        </div>
                        <p className="text-xs text-gray-500">AI Match</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Skills & Technologies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {candidate.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span>{" "}
                          {candidate.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        <span>Source: {candidate.source}</span>
                        {candidate.lastContact && (
                          <span className="ml-4">
                            Last contact: {candidate.lastContact}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                          <Eye size={14} />
                          <span>View Full Profile</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm">
                          <Mail size={14} />
                          <span>Send Message</span>
                        </button>
                        {candidatesView.type === "candidates" &&
                          candidate.status === "applied" && (
                            <button className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                              <Star size={14} />
                              <span>Shortlist</span>
                            </button>
                          )}
                        {candidatesView.type === "shortlisted" &&
                          candidate.status === "shortlisted" && (
                            <button
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowInterviewModal(true);
                              }}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Calendar size={14} />
                              <span>Schedule Interview</span>
                            </button>
                          )}
                        {(candidatesView.type === "candidates" ||
                          candidatesView.type === "interviewed") && (
                          <button
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setShowInterviewModal(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Calendar size={14} />
                            <span>Schedule Interview</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {candidatesView.candidates.length} candidates • Sorted
                by AI match score (highest first)
              </div>
              <button
                onClick={() => setShowCandidatesModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RecruitModal = () => {
    const startRecruitment = () => {
      setRecruitmentProcess({
        stage: "searching",
        searchResults: [],
        interestedCandidates: [],
        topCandidates: [],
        progress: 0,
      });

      // Stage 1: AI-powered candidate search
      setTimeout(() => {
        const mockSearchResults = [
          {
            id: 101,
            name: "Alex Thompson",
            title: "Senior React Developer",
            company: "TechCorp",
            location: "London",
            experience: "6 years",
            skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
            source: "LinkedIn",
            aiMatch: 96,
            avatar: "👨‍💻",
            email: "alex.thompson@email.com",
          },
          {
            id: 102,
            name: "Priya Patel",
            title: "Frontend Engineering Lead",
            company: "FinanceApp",
            location: "Manchester",
            experience: "7 years",
            skills: ["React", "Vue.js", "TypeScript", "Docker", "Kubernetes"],
            source: "Indeed",
            aiMatch: 94,
            avatar: "👩‍💻",
            email: "priya.patel@email.com",
          },
          {
            id: 103,
            name: "James Wilson",
            title: "Full Stack Developer",
            company: "StartupXYZ",
            location: "Birmingham",
            experience: "5 years",
            skills: ["React", "Python", "Django", "PostgreSQL", "Redis"],
            source: "GitHub",
            aiMatch: 91,
            avatar: "👨‍💼",
            email: "james.wilson@email.com",
          },
          {
            id: 104,
            name: "Sophie Chen",
            title: "Senior Software Engineer",
            company: "E-commerce Ltd",
            location: "Remote",
            experience: "8 years",
            skills: ["React", "TypeScript", "Microservices", "AWS", "MongoDB"],
            source: "AngelList",
            aiMatch: 93,
            avatar: "👩‍💻",
            email: "sophie.chen@email.com",
          },
          {
            id: 105,
            name: "Marcus Johnson",
            title: "Frontend Architect",
            company: "Digital Agency",
            location: "London",
            experience: "9 years",
            skills: ["React", "Next.js", "TypeScript", "Webpack", "Jest"],
            source: "Stack Overflow",
            aiMatch: 89,
            avatar: "👨‍💻",
            email: "marcus.johnson@email.com",
          },
          {
            id: 106,
            name: "Elena Rodriguez",
            title: "React Developer",
            company: "Consulting Firm",
            location: "Edinburgh",
            experience: "4 years",
            skills: ["React", "JavaScript", "Redux", "Material-UI", "Firebase"],
            source: "Dribbble",
            aiMatch: 87,
            avatar: "👩‍🎨",
            email: "elena.rodriguez@email.com",
          },
          {
            id: 107,
            name: "David Kim",
            title: "Senior UI Developer",
            company: "Media Company",
            location: "Glasgow",
            experience: "6 years",
            skills: [
              "React",
              "TypeScript",
              "Styled Components",
              "Storybook",
              "Cypress",
            ],
            source: "Behance",
            aiMatch: 85,
            avatar: "👨‍💻",
            email: "david.kim@email.com",
          },
          {
            id: 108,
            name: "Rachel Brown",
            title: "Frontend Developer",
            company: "Healthcare Tech",
            location: "Bristol",
            experience: "5 years",
            skills: ["React", "Vue.js", "Sass", "Webpack", "PWA"],
            source: "Glassdoor",
            aiMatch: 88,
            avatar: "👩‍💻",
            email: "rachel.brown@email.com",
          },
        ];

        setRecruitmentProcess((prev) => ({
          ...prev,
          searchResults: mockSearchResults,
          progress: 25,
        }));

        // Stage 2: Automated outreach
        setTimeout(() => {
          setRecruitmentProcess((prev) => ({
            ...prev,
            stage: "outreach",
            progress: 50,
          }));

          // Stage 3: Collect interested candidates
          setTimeout(() => {
            const interestedCandidates = mockSearchResults.filter(
              (_, index) => [0, 1, 2, 3, 5, 7].includes(index), // 6 out of 8 show interest
            );

            setRecruitmentProcess((prev) => ({
              ...prev,
              interestedCandidates,
              progress: 75,
            }));

            // Stage 4: Rank and select top 5
            setTimeout(() => {
              const rankedCandidates = [...interestedCandidates]
                .sort((a, b) => b.aiMatch - a.aiMatch)
                .slice(0, 5);

              setRecruitmentProcess((prev) => ({
                ...prev,
                stage: "complete",
                topCandidates: rankedCandidates,
                progress: 100,
              }));
            }, 2000);
          }, 3000);
        }, 2000);
      }, 2500);
    };

    const resetRecruitment = () => {
      setRecruitmentProcess({
        stage: "idle",
        searchResults: [],
        interestedCandidates: [],
        topCandidates: [],
        progress: 0,
      });
    };

    const getStageIcon = (stage: string) => {
      switch (stage) {
        case "searching":
          return <Radar className="w-5 h-5 text-blue-600 animate-spin" />;
        case "outreach":
          return <Send className="w-5 h-5 text-purple-600" />;
        case "ranking":
          return <Brain className="w-5 h-5 text-orange-600" />;
        case "complete":
          return <Trophy className="w-5 h-5 text-green-600" />;
        default:
          return <Target className="w-5 h-5 text-gray-400" />;
      }
    };

    const getStageDescription = (stage: string) => {
      switch (stage) {
        case "searching":
          return "AI scanning LinkedIn, job boards, and tech platforms...";
        case "outreach":
          return "Sending personalized outreach messages to candidates...";
        case "ranking":
          return "Analyzing responses and ranking candidates...";
        case "complete":
          return "Recruitment process completed successfully!";
        default:
          return "Ready to start automated candidate recruitment";
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI Recruitment for {selectedRole?.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Automated candidate sourcing and outreach
              </p>
            </div>
            <button
              onClick={() => {
                setShowRecruitModal(false);
                resetRecruitment();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            {/* Process Overview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recruitment Process
                </h3>
                <div className="text-sm text-gray-600">
                  {recruitmentProcess.progress}% Complete
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${recruitmentProcess.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    recruitmentProcess.stage === "searching"
                      ? "border-blue-500 bg-blue-50"
                      : recruitmentProcess.progress >= 25
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Radar
                      className={cn(
                        "w-5 h-5",
                        recruitmentProcess.stage === "searching"
                          ? "text-blue-600 animate-spin"
                          : recruitmentProcess.progress >= 25
                            ? "text-green-600"
                            : "text-gray-400",
                      )}
                    />
                    <span className="font-medium text-sm">AI Search</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Scan platforms for matching candidates
                  </p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    recruitmentProcess.stage === "outreach"
                      ? "border-purple-500 bg-purple-50"
                      : recruitmentProcess.progress >= 50
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Send
                      className={cn(
                        "w-5 h-5",
                        recruitmentProcess.stage === "outreach"
                          ? "text-purple-600"
                          : recruitmentProcess.progress >= 50
                            ? "text-green-600"
                            : "text-gray-400",
                      )}
                    />
                    <span className="font-medium text-sm">Outreach</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Send personalized messages
                  </p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    recruitmentProcess.stage === "ranking"
                      ? "border-orange-500 bg-orange-50"
                      : recruitmentProcess.progress >= 75
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain
                      className={cn(
                        "w-5 h-5",
                        recruitmentProcess.stage === "ranking"
                          ? "text-orange-600"
                          : recruitmentProcess.progress >= 75
                            ? "text-green-600"
                            : "text-gray-400",
                      )}
                    />
                    <span className="font-medium text-sm">Ranking</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Analyze and rank responses
                  </p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    recruitmentProcess.stage === "complete"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy
                      className={cn(
                        "w-5 h-5",
                        recruitmentProcess.stage === "complete"
                          ? "text-green-600"
                          : "text-gray-400",
                      )}
                    />
                    <span className="font-medium text-sm">Complete</span>
                  </div>
                  <p className="text-xs text-gray-600">Top candidates ready</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStageIcon(recruitmentProcess.stage)}
                <div>
                  <p className="font-medium text-gray-900">
                    {recruitmentProcess.stage === "idle"
                      ? "Ready to Start"
                      : recruitmentProcess.stage === "searching"
                        ? "Searching Candidates"
                        : recruitmentProcess.stage === "outreach"
                          ? "Outreach in Progress"
                          : recruitmentProcess.stage === "ranking"
                            ? "Ranking Candidates"
                            : "Process Complete"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getStageDescription(recruitmentProcess.stage)}
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {recruitmentProcess.searchResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Results ({recruitmentProcess.searchResults.length}{" "}
                  candidates found)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recruitmentProcess.searchResults.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{candidate.avatar}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {candidate.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {candidate.title} at {candidate.company}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{candidate.location}</span>
                            <span>{candidate.experience}</span>
                            <span>{candidate.source}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills
                                .slice(0, 3)
                                .map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {candidate.skills.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{candidate.skills.length - 3} more
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-blue-600">
                              {candidate.aiMatch}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interested Candidates */}
            {recruitmentProcess.interestedCandidates.length > 0 && (
              <div className="mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {recruitmentProcess.interestedCandidates.length}{" "}
                      candidates expressed interest!
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Response rate:{" "}
                    {Math.round(
                      (recruitmentProcess.interestedCandidates.length /
                        recruitmentProcess.searchResults.length) *
                        100,
                    )}
                    %
                  </p>
                </div>
              </div>
            )}

            {/* Top 5 Candidates */}
            {recruitmentProcess.topCandidates.length > 0 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top 5 Candidates for Interview
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {recruitmentProcess.topCandidates.map(
                      (candidate, index) => (
                        <div
                          key={candidate.id}
                          className="bg-white rounded-lg p-4 border shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold">
                                {index + 1}
                              </div>
                              <div className="text-2xl">{candidate.avatar}</div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {candidate.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {candidate.title} at {candidate.company}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                  <span>{candidate.location}</span>
                                  <span>{candidate.experience}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {candidate.aiMatch}%
                              </div>
                              <p className="text-xs text-gray-500">AI Match</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills
                                .slice(0, 4)
                                .map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowInterviewModal(true);
                              }}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              <Calendar size={14} />
                              <span>Schedule Interview</span>
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => {
                  setShowRecruitModal(false);
                  resetRecruitment();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>

              <div className="flex space-x-3">
                {recruitmentProcess.stage === "idle" && (
                  <button
                    onClick={startRecruitment}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Target size={16} />
                    <span>Start AI Recruitment</span>
                  </button>
                )}

                {recruitmentProcess.stage === "complete" && (
                  <button
                    onClick={() => {
                      alert("Top 5 candidates added to role pipeline!");
                      setShowRecruitModal(false);
                      resetRecruitment();
                    }}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    <CheckCircle size={16} />
                    <span>Add to Pipeline</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NewRoleModal = () => {
    const [activeModalTab, setActiveModalTab] = useState("details");
    const [formData, setFormData] = useState({
      title: "",
      department: "",
      location: "",
      salary: "",
      description: "",
      experience: "",
      skills: "",
      benefits: "",
    });
    const [generatedDescription, setGeneratedDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [postingStatus, setPostingStatus] = useState({
      website: "pending", // pending, posting, success, error
      broadbean: "pending",
      jobBoards: [],
    });
    const [isPosting, setIsPosting] = useState(false);

    const generateJobDescription = () => {
      if (!formData.title || !formData.department) {
        alert("Please fill in at least the job title and department first.");
        return;
      }

      setIsGenerating(true);

      // Simulate AI generation with a delay
      setTimeout(() => {
        const description = `
## Position Overview
We are seeking a talented ${formData.title} to join our ${formData.department} team${formData.location ? ` in ${formData.location}` : ""}. ${businessProfile.description || "This is an excellent opportunity for a professional looking to make a significant impact in a dynamic, fast-growing organization."}

## Key Responsibilities
• Lead and execute ${formData.department.toLowerCase()} initiatives that drive business growth
• Collaborate with cross-functional teams to deliver high-quality solutions
• Mentor junior team members and contribute to team development
• Stay current with industry trends and best practices
• Participate in strategic planning and project management activities

## Required Qualifications
• ${formData.experience || "3-5 years"} of relevant experience in ${formData.department.toLowerCase()}
• Strong analytical and problem-solving skills
• Excellent communication and interpersonal abilities
• Proven track record of delivering results in fast-paced environments
• Bachelor's degree in relevant field or equivalent experience

## Preferred Skills
${
  formData.skills
    ? `• ${formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .join("\n• ")}`
    : `• Proficiency in industry-standard tools and technologies
• Experience with agile methodologies
• Leadership and project management experience`
}

## What We Offer
${
  businessProfile.benefits ||
  formData.benefits ||
  `• Competitive salary range${formData.salary ? `: ${formData.salary}` : ""}
• Comprehensive health and wellness benefits
• Professional development opportunities
• Flexible working arrangements
• Dynamic and inclusive work environment
• Career growth and advancement opportunities`
}

## About ${businessProfile.companyName || "Our Company"}
${businessProfile.mission || "We are a forward-thinking organization committed to excellence and innovation."}

${businessProfile.culture ? `### Our Culture\n${businessProfile.culture}` : ""}

${businessProfile.values ? `### Our Values\n${businessProfile.values}` : ""}

${businessProfile.location ? `### Location\nBased in ${businessProfile.location}` : ""}

Ready to join our team? Apply now and let's shape the future together!
        `.trim();

        setGeneratedDescription(description);
        setFormData({ ...formData, description });
        setIsGenerating(false);
      }, 2000);
    };

    const postAdvert = async () => {
      if (!generatedDescription) {
        alert("Please generate a job description first.");
        return;
      }

      setIsPosting(true);
      setPostingStatus({
        website: "posting",
        broadbean: "posting",
        jobBoards: [],
      });

      // Simulate posting to company website
      setTimeout(() => {
        setPostingStatus((prev) => ({
          ...prev,
          website: "success",
        }));
      }, 1500);

      // Simulate Broadbean API call
      setTimeout(() => {
        const mockJobBoards = [
          {
            name: "Indeed",
            status: "success",
            url: "https://indeed.com/job/12345",
          },
          {
            name: "LinkedIn",
            status: "success",
            url: "https://linkedin.com/jobs/view/67890",
          },
          {
            name: "Glassdoor",
            status: "success",
            url: "https://glassdoor.com/job/54321",
          },
          {
            name: "Reed",
            status: "success",
            url: "https://reed.co.uk/jobs/98765",
          },
          {
            name: "Totaljobs",
            status: "success",
            url: "https://totaljobs.com/job/13579",
          },
          {
            name: "CV Library",
            status: "success",
            url: "https://cv-library.co.uk/job/24680",
          },
        ];

        setPostingStatus((prev) => ({
          ...prev,
          broadbean: "success",
          jobBoards: mockJobBoards,
        }));
        setIsPosting(false);
      }, 4000);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRole: Role = {
        id: roles.length + 1,
        ...formData,
        status: "active",
        candidates: 0,
        shortlisted: 0,
        interviewed: 0,
        created: new Date().toISOString().split("T")[0],
        priority: "medium",
        deiScore: 85,
      };
      setRoles([...roles, newRole]);
      setShowNewRoleModal(false);
      resetModal();
    };

    const resetModal = () => {
      setFormData({
        title: "",
        department: "",
        location: "",
        salary: "",
        description: "",
        experience: "",
        skills: "",
        benefits: "",
      });
      setGeneratedDescription("");
      setActiveModalTab("details");
      setPostingStatus({
        website: "pending",
        broadbean: "pending",
        jobBoards: [],
      });
      setIsPosting(false);
    };

    const modalTabs = [
      { id: "details", label: "Role Details", icon: Building },
      { id: "description", label: "Job Description", icon: MessageSquare },
      {
        id: "post",
        label: "Post Advert",
        icon: Share2,
        disabled: !generatedDescription,
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Role
            </h2>
            <button
              onClick={() => {
                setShowNewRoleModal(false);
                resetModal();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            {modalTabs.map((tab) => {
              const Icon = tab.icon;
              const isDisabled = tab.disabled;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveModalTab(tab.id)}
                  disabled={isDisabled}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors",
                    isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : activeModalTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {isDisabled && <Clock size={12} className="text-gray-300" />}
                </button>
              );
            })}
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeModalTab === "details" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Senior Software Engineer"
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
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. London, Remote, Hybrid"
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
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. £50,000 - £70,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 3-5 years"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Skills
                    </label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. React, TypeScript, Node.js"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits & Perks
                  </label>
                  <textarea
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) =>
                      setFormData({ ...formData, benefits: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List key benefits and perks..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("description")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Zap size={16} />
                      <span>Generate Job Description</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!formData.title || !formData.department) {
                          alert(
                            "Please fill in job title and department first.",
                          );
                          return;
                        }
                        setIsAnalyzing(true);
                        const market = await fetchMarketData(
                          formData.title,
                          formData.location,
                          formData.department,
                        );
                        setMarketData(market);
                        const prediction = await predictRoleSuccess(
                          formData,
                          market,
                        );
                        setCurrentPrediction(prediction);
                        setIsAnalyzing(false);
                        setShowPredictionModal(true);
                      }}
                      disabled={isAnalyzing}
                      className={cn(
                        "text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1",
                        isAnalyzing && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {isAnalyzing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      ) : (
                        <Brain size={16} />
                      )}
                      <span>
                        {isAnalyzing ? "Analyzing..." : "AI Success Prediction"}
                      </span>
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewRoleModal(false);
                        resetModal();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Create Role
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeModalTab === "description" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI-Generated Job Description
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create a tailored job description based on your role
                      details
                    </p>
                  </div>
                  <button
                    onClick={generateJobDescription}
                    disabled={isGenerating}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isGenerating
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg",
                    )}
                  >
                    <Zap size={16} />
                    <span>
                      {isGenerating ? "Generating..." : "Generate Description"}
                    </span>
                  </button>
                </div>

                {isGenerating && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                      Creating your job description...
                    </span>
                  </div>
                )}

                {generatedDescription && !isGenerating && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Job description generated successfully!
                        </span>
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="whitespace-pre-wrap text-sm text-gray-700">
                        {generatedDescription}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setActiveModalTab("details")}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        ← Back to Details
                      </button>
                      <div className="flex space-x-3">
                        <button
                          onClick={generateJobDescription}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={() => setActiveModalTab("post")}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Continue to Post Advert
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!generatedDescription && !isGenerating && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Fill out the role details first, then generate a tailored
                      job description with AI.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeModalTab === "post" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Post Job Advert
                    </h3>
                    <p className="text-sm text-gray-600">
                      Publish your role to company website and job boards via
                      Broadbean
                    </p>
                  </div>
                  <button
                    onClick={postAdvert}
                    disabled={isPosting || !generatedDescription}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isPosting || !generatedDescription
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg",
                    )}
                  >
                    <Share2 size={16} />
                    <span>
                      {isPosting ? "Publishing..." : "Publish Advert"}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Website */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Globe className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Company Website
                        </h4>
                        <p className="text-sm text-gray-600">
                          careers.company.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {postingStatus.website === "pending" && (
                        <>
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                          <span className="text-sm text-gray-600">
                            Ready to publish
                          </span>
                        </>
                      )}
                      {postingStatus.website === "posting" && (
                        <>
                          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                          <span className="text-sm text-yellow-600">
                            Publishing to website...
                          </span>
                        </>
                      )}
                      {postingStatus.website === "success" && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Published successfully
                          </span>
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                          >
                            <ExternalLink size={12} />
                            <span>View</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Broadbean Integration */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Broadbean API
                        </h4>
                        <p className="text-sm text-gray-600">
                          Multi-board distribution
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {postingStatus.broadbean === "pending" && (
                        <>
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                          <span className="text-sm text-gray-600">
                            Ready to distribute
                          </span>
                        </>
                      )}
                      {postingStatus.broadbean === "posting" && (
                        <>
                          <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                          <span className="text-sm text-orange-600">
                            Distributing via Broadbean...
                          </span>
                        </>
                      )}
                      {postingStatus.broadbean === "success" && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Distributed to {postingStatus.jobBoards.length} job
                            boards
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Board Results */}
                {postingStatus.jobBoards.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Successfully Posted to Job Boards</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {postingStatus.jobBoards.map((board, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-900">
                                {board.name}
                              </span>
                            </div>
                            <a
                              href={board.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                            >
                              <ExternalLink size={12} />
                              <span>View</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => setActiveModalTab("description")}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    ← Back to Description
                  </button>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewRoleModal(false);
                        resetModal();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Create Role & Finish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MyBusinessTab = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(businessProfile);

    const handleSave = () => {
      setBusinessProfile(editForm);
      setIsEditing(false);
      alert(
        "Business profile updated! This information will enhance AI job descriptions.",
      );
    };

    const handleCancel = () => {
      setEditForm(businessProfile);
      setIsEditing(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">My Business</h2>
            <p className="text-blue-100">
              Manage your company information to enhance AI-powered job
              descriptions
            </p>
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all"
          >
            {isEditing ? <Save size={16} /> : <Edit size={16} />}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {businessProfile.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={(e) =>
                        setEditForm({ ...editForm, industry: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {businessProfile.industry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {businessProfile.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.size}
                      onChange={(e) =>
                        setEditForm({ ...editForm, size: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select size</option>
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-100 employees">51-100 employees</option>
                      <option value="101-500 employees">
                        101-500 employees
                      </option>
                      <option value="500+ employees">500+ employees</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {businessProfile.size}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.foundedYear}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          foundedYear: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="YYYY"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {businessProfile.foundedYear}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) =>
                        setEditForm({ ...editForm, website: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  ) : (
                    <a
                      href={businessProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {businessProfile.website}
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about your company..."
                  />
                ) : (
                  <p className="text-gray-700">{businessProfile.description}</p>
                )}
              </div>
            </div>

            {/* Culture & Values */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Culture & Values
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editForm.mission}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mission: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What is your company's mission?"
                    />
                  ) : (
                    <p className="text-gray-700">{businessProfile.mission}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Values
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.values}
                      onChange={(e) =>
                        setEditForm({ ...editForm, values: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Innovation, Integrity, Collaboration..."
                    />
                  ) : (
                    <p className="text-gray-700">{businessProfile.values}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Culture
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editForm.culture}
                      onChange={(e) =>
                        setEditForm({ ...editForm, culture: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your workplace culture..."
                    />
                  ) : (
                    <p className="text-gray-700">{businessProfile.culture}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits & Perks
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={editForm.benefits}
                      onChange={(e) =>
                        setEditForm({ ...editForm, benefits: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List your employee benefits and perks..."
                    />
                  ) : (
                    <p className="text-gray-700">{businessProfile.benefits}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Enhancement Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🤖 AI Enhancement
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Company description
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Culture & values
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Benefits package
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Location details
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This information helps our AI create more personalized and
                compelling job descriptions that reflect your unique company
                culture.
              </p>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Completeness
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Profile Complete</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  A complete profile generates better job descriptions
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> The more detailed your business
                  information, the better our AI can tailor job descriptions to
                  attract the right candidates.
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EmployeesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Employee Directory</h2>
          <p className="text-blue-100">
            Manage your team members and their employment records
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search employees..."
            className="px-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-white focus:border-white"
          />
          <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {employees.length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Probation</p>
              <p className="text-3xl font-bold text-gray-900">
                {employees.filter((emp) => !emp.isProbationComplete).length}
              </p>
            </div>
            <Timer className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Employees
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {employees.filter((emp) => emp.status === "active").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(employees.map((emp) => emp.department)).size}
              </p>
            </div>
            <Building className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="grid grid-cols-1 gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedEmployee(employee);
              setShowEmployeeModal(true);
            }}
          >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="text-3xl">{employee.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {employee.name}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(employee.status),
                      )}
                    >
                      {employee.status.charAt(0).toUpperCase() +
                        employee.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {employee.position}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Building size={14} />
                      <span>{employee.department}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{employee.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Started {employee.startDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase size={14} />
                      <span>{calculateTenure(employee.startDate)} tenure</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                {/* Probation Status */}
                <div className="text-center min-w-[120px]">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {employee.isProbationComplete ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Timer className="w-4 h-4 text-yellow-600" />
                    )}
                    <p className="text-sm font-medium text-gray-900">
                      Probation
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-xs",
                      employee.isProbationComplete
                        ? "text-green-600"
                        : "text-yellow-600",
                    )}
                  >
                    {employee.isProbationComplete
                      ? "Complete"
                      : calculateProbationRemaining(employee.probationEndDate)}
                  </p>
                </div>

                {/* Documents Count */}
                <div className="text-center min-w-[100px]">
                  <p className="text-2xl font-bold text-blue-600">
                    {employee.documents.length}
                  </p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle email action
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Mail size={14} />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(employee);
                      setShowDocumentUploadModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <FileText size={14} />
                    <span>Add Doc</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No employees found. Hire some candidates to get started!
          </p>
        </div>
      )}
    </div>
  );

  const SavingsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Cost Savings & ROI</h2>
          <p className="text-blue-100">
            Track your savings vs traditional recruitment agencies
          </p>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white border-opacity-30">
          <div className="text-center">
            <p className="text-2xl font-bold">£39,450</p>
            <p className="text-xs">Net Savings YTD</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Savings vs Agencies
          </h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">£47,250</p>
              <p className="text-sm text-gray-600">Total Saved This Year</p>
              <p className="text-xs text-green-500 mt-1">vs 15% agency fees</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Successful Hires
                  </p>
                  <p className="text-xs text-gray-500">7 employees hired</p>
                </div>
                <span className="text-lg font-bold text-green-600">7</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Agency Fees (15%)
                  </p>
                  <p className="text-xs text-gray-500">
                    What you would have paid
                  </p>
                </div>
                <span className="text-lg font-bold text-red-600">£47,250</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    UPhire Annual Cost
                  </p>
                  <p className="text-xs text-gray-500">
                    Growth plan subscription
                  </p>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  ��7,800
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <div>
                  <p className="text-lg font-bold text-green-800">
                    Net Savings
                  </p>
                  <p className="text-sm text-green-600">83% cost reduction</p>
                </div>
                <span className="text-2xl font-bold text-green-700">
                  £39,450
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ROI Analysis
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">506%</p>
              <p className="text-sm text-gray-600">Return on Investment</p>
              <p className="text-xs text-blue-500 mt-1">
                UPhire vs Agency costs
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Cost per Hire (UPhire)
                </span>
                <span className="text-sm font-medium text-green-600">
                  £1,114
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Cost per Hire (Agency)
                </span>
                <span className="text-sm font-medium text-red-600">£6,750</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Time to Hire (UPhire)
                </span>
                <span className="text-sm font-medium text-blue-600">
                  14 days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Time to Hire (Agency)
                </span>
                <span className="text-sm font-medium text-orange-600">
                  45 days
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                💰 You're saving £5,636 per hire with UPhire!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Savings Impact Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-lg font-bold text-green-700">Cash Flow Impact</p>
            <p className="text-sm text-gray-600">
              £39k additional working capital available for growth initiatives
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-lg font-bold text-blue-700">Speed Advantage</p>
            <p className="text-sm text-gray-600">
              3x faster hiring enables rapid scaling and competitive advantage
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-lg font-bold text-purple-700">Scalability</p>
            <p className="text-sm text-gray-600">
              Savings multiply with growth - more hires = exponentially more
              savings
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const OnboardingTab = () => {
    const getDocumentIcon = (type: string) => {
      switch (type) {
        case "offer_letter":
          return "📋";
        case "contract":
          return "📝";
        case "nda":
          return "🔒";
        case "welcome_package":
          return "👋";
        default:
          return "📄";
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Document Management
            </h2>
            <p className="text-blue-100">
              Manage templates and automate document delivery
            </p>
          </div>
          <button
            onClick={() => setShowDocumentModal(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
          >
            <Plus size={16} />
            <span>Create Template</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getDocumentIcon(doc.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{doc.category}</span>
                      <span>Modified: {doc.lastModified}</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Auto-Send
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {doc.template.substring(0, 150)}...
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                    <Eye size={14} />
                    <span>Edit</span>
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
                <button
                  onClick={() =>
                    alert("Document sent with auto-populated variables!")
                  }
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
                >
                  <Mail size={14} />
                  <span>Send to Candidate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-3xl font-bold text-gray-900">
                {roles.filter((r) => r.status === "active").length}
              </p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Candidates
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {roles.reduce((sum, role) => sum + role.candidates, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shortlisted</p>
              <p className="text-3xl font-bold text-gray-900">
                {roles.reduce((sum, role) => sum + role.shortlisted, 0)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg DEI Score</p>
              <p className="text-3xl font-bold text-gray-900">88</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Agency Savings
              </p>
              <p className="text-3xl font-bold text-green-600">£47,250</p>
              <p className="text-xs text-green-500 mt-1">vs 15% agency fees</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">£</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">
                Sarah Johnson shortlisted for Senior Frontend Developer
              </p>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-700">
                New role created: UX Designer
              </p>
              <span className="text-xs text-gray-500">4h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-700">
                Interview scheduled with Michael Chen
              </p>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Interviews
          </h3>
          {scheduledInterviews.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No interviews scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledInterviews.slice(0, 3).map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {interview.candidate.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {interview.type.charAt(0).toUpperCase() +
                          interview.type.slice(1)}{" "}
                        Interview
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {interview.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Market Insights</span>
          </h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Live Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Hot Skills
              </span>
            </div>
            <div className="space-y-1">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-1">
                React
              </span>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-1">
                Python
              </span>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                AI/ML
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Avg. Salary
              </span>
            </div>
            <p className="text-xl font-bold text-blue-900">£67,500</p>
            <p className="text-xs text-blue-600">+8% vs last quarter</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Avg. Time to Fill
              </span>
            </div>
            <p className="text-xl font-bold text-purple-900">32 days</p>
            <p className="text-xs text-purple-600">-12% improvement</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Market Trend:</strong> Remote/hybrid roles are seeing 65%
            more applications than office-only positions.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Recommendation:</strong> Consider offering flexible work
            arrangements for your next role postings.
          </p>
        </div>
      </div>
    </div>
  );

  const RolesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Open Roles</h2>
        <button
          onClick={() => setShowNewRoleModal(true)}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
        >
          <Plus size={16} />
          <span>Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {role.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{role.department}</span>
                  <span>{role.location}</span>
                  <span>{role.salary}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {role.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <button
                onClick={() => handleViewCandidates(role, "candidates")}
                className="text-center p-3 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
              >
                <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">
                  {role.candidates}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-blue-600">
                  Candidates
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-blue-600 mx-auto mt-1" />
                </div>
              </button>
              <button
                onClick={() => handleViewCandidates(role, "shortlisted")}
                className="text-center p-3 rounded-lg hover:bg-yellow-50 transition-colors group cursor-pointer"
              >
                <p className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700">
                  {role.shortlisted}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-yellow-600">
                  Shortlisted
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-yellow-600 mx-auto mt-1" />
                </div>
              </button>
              <button
                onClick={() => handleViewCandidates(role, "interviewed")}
                className="text-center p-3 rounded-lg hover:bg-green-50 transition-colors group cursor-pointer"
              >
                <p className="text-2xl font-bold text-green-600 group-hover:text-green-700">
                  {role.interviewed}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-green-600">
                  Interviewed
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-green-600 mx-auto mt-1" />
                </div>
              </button>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-purple-600">
                  {role.deiScore}
                </p>
                <p className="text-xs text-gray-500">DEI Score</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-sm text-gray-500">Created {role.created}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowRecruitModal(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                >
                  <Target size={14} />
                  <span>Recruit</span>
                </button>
                <button
                  onClick={() => setSelectedRole(role)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Configure AI Sourcing
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CandidatesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Candidates</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search candidates..."
            className="px-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-white focus:border-white"
          />
          <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6"
          >
            <div className="flex flex-col lg:flex-row items-start justify-between mb-4 gap-4">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{candidate.avatar}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-600">{candidate.role}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{candidate.email}</span>
                    <span>{candidate.location}</span>
                    <span>{candidate.experience}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {candidate.aiMatch}%
                </p>
                <p className="text-xs text-gray-500">AI Match</p>
                <span
                  className={cn(
                    "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1",
                    candidate.status === "shortlisted"
                      ? "bg-yellow-100 text-yellow-800"
                      : candidate.status === "interviewed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800",
                  )}
                >
                  {candidate.status}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-500">
                <span>
                  Source: {candidate.source} • Applied: {candidate.applied}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Profile
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hiring Funnel
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications</span>
              <span className="text-sm font-medium text-gray-900">54</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Shortlisted</span>
              <span className="text-sm font-medium text-gray-900">12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: "22%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Interviewed</span>
              <span className="text-sm font-medium text-gray-900">4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "7%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hired</span>
              <span className="text-sm font-medium text-gray-900">2</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: "4%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Time to Hire
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">14</p>
            <p className="text-sm text-gray-600">Average Days</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fastest Hire</span>
              <span className="font-medium">8 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Slowest Hire</span>
              <span className="font-medium">21 days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Diversity & Inclusion Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">88</p>
            <p className="text-sm text-gray-600">Average DEI Score</p>
            <p className="text-xs text-purple-500 mt-1">
              +5% from last quarter
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">45%</p>
            <p className="text-sm text-gray-600">Gender Diversity</p>
            <p className="text-xs text-green-500 mt-1">Within target range</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">35%</p>
            <p className="text-sm text-gray-600">Ethnic Diversity</p>
            <p className="text-xs text-blue-500 mt-1">Above industry average</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "roles":
        return <RolesTab />;
      case "candidates":
        return <CandidatesTab />;
      case "employees":
        return <EmployeesTab />;
      case "business":
        return <MyBusinessTab />;
      case "savings":
        return <SavingsTab />;
      case "documents":
        return <OnboardingTab />;
      case "analytics":
        return <AnalyticsTab />;
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
            <div className="flex items-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fe3ae173b79f74e84b0580a7f82f9aa6c%2Fa30864f8cb98481d9e88e08c10e577ec?format=webp&width=800"
                alt="UPhire - AI-Powered Recruitment"
                className="h-8 w-auto"
              />
              <div className="hidden sm:block ml-3 text-blue-200 text-sm">
                AI-Powered Recruitment
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-white bg-opacity-20 text-white border border-white border-opacity-30"
                        : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white",
                    )}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Profile / Login */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all"
                  >
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
                      {user.initials}
                    </div>
                    <ChevronDown size={16} />
                  </button>

                  {showUserDropdown && (
                    <>
                      {/* Invisible overlay to detect clicks outside */}
                      <div
                        className="fixed inset-0 z-[999998]"
                        onClick={() => setShowUserDropdown(false)}
                      />
                      {/* Dropdown menu */}
                      <div
                        className="fixed w-48 bg-white rounded-lg shadow-2xl border"
                        style={{
                          position: "fixed",
                          top: "60px",
                          right: "20px",
                          zIndex: 999999,
                          isolation: "isolate",
                        }}
                      >
                        <div className="p-3 border-b">
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              setShowSettingsModal(true);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings size={16} />
                            <span>Settings</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              // Navigate to business tab
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
                                initials: "",
                                role: "",
                                company: "",
                              });
                              setShowUserDropdown(false);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
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
                    className={cn(
                      "flex items-center space-x-2 w-full px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-white bg-opacity-20 text-white border border-white border-opacity-30"
                        : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white",
                    )}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Modals */}
      {showNewRoleModal && <NewRoleModal />}
      {showDocumentModal && <DocumentModal />}
      {showRecruitModal && <RecruitModal />}
      {showCandidatesModal && <CandidatesDetailModal />}
      {showInterviewModal && <InterviewSchedulingModal />}
      {showEmployeeModal && <EmployeeDetailModal />}
      {showDocumentUploadModal && <DocumentUploadModal />}
      {showLoginModal && <LoginModal />}
      {showSettingsModal && <SettingsModal />}
    </div>
  );
};

export default UPhirePlatform;
