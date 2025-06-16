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

// NewRoleModal component moved outside to prevent re-renders
const NewRoleModal = ({
  showNewRoleModal,
  setShowNewRoleModal,
  roleFormData,
  setRoleFormData,
  generatedDescription,
  setGeneratedDescription,
  businessProfile,
  roles,
  setRoles,
  isAnalyzing,
  setIsAnalyzing,
  marketData,
  setMarketData,
  currentPrediction,
  setCurrentPrediction,
  showPredictionModal,
  setShowPredictionModal,
  fetchMarketData,
  predictRoleSuccess,
}) => {
  const [activeModalTab, setActiveModalTab] = useState("details");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postingStatus, setPostingStatus] = useState({
    website: "pending",
    broadbean: "pending",
    jobBoards: [],
  });

  if (!showNewRoleModal) return null;

  const generateJobDescription = () => {
    if (!roleFormData.title || !roleFormData.department) {
      alert("Please fill in at least the job title and department first.");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const description = `# ${roleFormData.title}

${businessProfile.companyName ? `## About ${businessProfile.companyName}` : "## About Us"}
${businessProfile.description || "We are a dynamic, innovative company committed to excellence and growth in our industry."}

${businessProfile.mission ? `\n**Our Mission:** ${businessProfile.mission}` : ""}

## Position Overview
We are seeking a talented ${roleFormData.title} to join our ${roleFormData.department} team${roleFormData.location ? ` in ${roleFormData.location}` : ""}. ${businessProfile.description || "This is an excellent opportunity for a professional looking to make a significant impact in a dynamic, fast-growing organization."}

## Key Responsibilities
• Lead and execute ${roleFormData.department.toLowerCase()} initiatives that drive business growth
• Collaborate with cross-functional teams to deliver high-quality solutions
• Drive innovation and continuous improvement in processes and technologies
• Mentor junior team members and contribute to team knowledge sharing
• Ensure project delivery meets quality standards and timelines

## Required Qualifications
• ${roleFormData.experience || "3-5 years"} of relevant experience in ${roleFormData.department.toLowerCase()}
• Strong analytical and problem-solving skills
• Excellent communication and collaboration abilities
• Proven track record of delivering results in a fast-paced environment
• Bachelor's degree in relevant field or equivalent experience

## Technical Skills
${
  roleFormData.skills
    ? `• ${roleFormData.skills
        .split(",")
        .map((skill) => skill.trim())
        .join("\n• ")}`
    : "• Strong technical foundation relevant to the role\n• Proficiency in industry-standard tools and technologies"
}

## What We Offer
${
  businessProfile.benefits ||
  roleFormData.benefits ||
  `• Competitive salary range${roleFormData.salary ? `: ${roleFormData.salary}` : ""}
• Comprehensive health and wellness benefits
• Professional development opportunities
• Flexible working arrangements
• Collaborative and inclusive work environment`
}

${businessProfile.culture ? `\n## Our Culture\n${businessProfile.culture}` : ""}

${businessProfile.values ? `\n## Our Values\n${businessProfile.values}` : ""}

---

Ready to make an impact? Apply now and join our team!`;

      setGeneratedDescription(description);
      setRoleFormData({ ...roleFormData, description });
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole: Role = {
      id: roles.length + 1,
      ...roleFormData,
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
    setRoleFormData({
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Role</h2>
          <button
            onClick={() => {
              setShowNewRoleModal(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

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
                    value={roleFormData.title}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        title: e.target.value,
                      })
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
                    value={roleFormData.department}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        department: e.target.value,
                      })
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
                    value={roleFormData.location}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        location: e.target.value,
                      })
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
                    value={roleFormData.salary}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        salary: e.target.value,
                      })
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
                    value={roleFormData.experience}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        experience: e.target.value,
                      })
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
                    value={roleFormData.skills}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        skills: e.target.value,
                      })
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
                  value={roleFormData.benefits}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      benefits: e.target.value,
                    })
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
                      if (!roleFormData.title || !roleFormData.department) {
                        alert("Please fill in job title and department first.");
                        return;
                      }
                      setIsAnalyzing(true);
                      const market = await fetchMarketData(
                        roleFormData.title,
                        roleFormData.location,
                        roleFormData.department,
                      );
                      setMarketData(market);
                      const prediction = await predictRoleSuccess(
                        roleFormData,
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
                    Create a tailored job description based on your role details
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
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Zap size={16} />
                  )}
                  <span>
                    {isGenerating ? "Generating..." : "Generate Description"}
                  </span>
                </button>
              </div>

              {generatedDescription ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">
                      Generated Job Description
                    </h4>
                    <button
                      onClick={generateJobDescription}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Regenerate
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {generatedDescription}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Fill out the role details first, then generate a tailored
                    job description with AI.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => setActiveModalTab("details")}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  ← Back to Details
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setActiveModalTab("post")}
                    disabled={!generatedDescription}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      !generatedDescription
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    Next: Post Advert
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
    stage: "idle",
    searchResults: [],
    interestedCandidates: [],
    topCandidates: [],
    progress: 0,
  });
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [candidatesView, setCandidatesView] = useState({
    role: null,
    type: "",
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

  // Enhanced Candidate Search
  const [allCandidates, setAllCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    status: "all",
    source: "all",
    dateRange: "all",
    skills: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  // Role Creation Form Data - moved outside NewRoleModal to persist during navigation
  const [roleFormData, setRoleFormData] = useState({
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

  // Function to start a new role creation with clean form
  const startNewRole = () => {
    setRoleFormData({
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
    setShowNewRoleModal(true);
  };

  // Mock data functions
  const fetchMarketData = async (jobTitle, location, department) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const marketInsights = {
          salary: {
            min: 50000,
            max: 80000,
            median: 65000,
            percentile90: 85000,
          },
          demand: {
            level: "High",
            trend: "Growing",
            competition: "Medium",
            timeToFill: 30,
          },
        };
        resolve(marketInsights);
      }, 1500);
    });
  };

  const predictRoleSuccess = async (roleData, marketData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prediction = {
          successRate: 85,
          confidence: 92,
          factors: {},
          recommendations: [],
          alternatives: [],
          risks: [],
          timeline: {},
        };
        resolve(prediction);
      }, 2000);
    });
  };

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
    ];

    setRoles(mockRoles);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-blue-100">
                  Welcome to your AI-powered recruitment platform
                </p>
              </div>
              <button
                onClick={startNewRole}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
              >
                <Plus size={16} />
                <span>Create New Role</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-sm font-medium text-gray-600">
                      Shortlisted
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Avg DEI Score
                    </p>
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
                    <p className="text-xs text-green-500 mt-1">
                      vs 15% agency fees
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">£</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Active Roles
              </h3>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {role.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {role.department} • {role.location}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {role.candidates}
                        </p>
                        <p className="text-xs text-gray-500">Applied</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {role.shortlisted}
                        </p>
                        <p className="text-xs text-gray-500">Shortlisted</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {role.interviewed}
                        </p>
                        <p className="text-xs text-gray-500">Interviewed</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "roles":
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
                onClick={startNewRole}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
              >
                <Plus size={16} />
                <span>Create New Role</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {role.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {role.department} • {role.location}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {role.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Salary:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {role.salary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DEI Score:</span>
                      <span className="text-sm font-medium text-purple-600">
                        {role.deiScore}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {role.candidates}
                      </p>
                      <p className="text-xs text-gray-500">Applied</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {role.shortlisted}
                      </p>
                      <p className="text-xs text-gray-500">Shortlisted</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {role.interviewed}
                      </p>
                      <p className="text-xs text-gray-500">Interviewed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "candidates":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Candidates</h1>
                <p className="text-blue-100">
                  Review and manage candidate applications
                </p>
              </div>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Applications
              </h3>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{candidate.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {candidate.role} • {candidate.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">
                          {candidate.aiMatch}%
                        </p>
                        <p className="text-xs text-gray-500">AI Match</p>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          candidate.status === "shortlisted"
                            ? "bg-yellow-100 text-yellow-800"
                            : candidate.status === "interviewed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800",
                        )}
                      >
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
      {showNewRoleModal && (
        <NewRoleModal
          showNewRoleModal={showNewRoleModal}
          setShowNewRoleModal={setShowNewRoleModal}
          roleFormData={roleFormData}
          setRoleFormData={setRoleFormData}
          generatedDescription={generatedDescription}
          setGeneratedDescription={setGeneratedDescription}
          businessProfile={businessProfile}
          roles={roles}
          setRoles={setRoles}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
          marketData={marketData}
          setMarketData={setMarketData}
          currentPrediction={currentPrediction}
          setCurrentPrediction={setCurrentPrediction}
          showPredictionModal={showPredictionModal}
          setShowPredictionModal={setShowPredictionModal}
          fetchMarketData={fetchMarketData}
          predictRoleSuccess={predictRoleSuccess}
        />
      )}
    </div>
  );
};

export default UPhirePlatform;
