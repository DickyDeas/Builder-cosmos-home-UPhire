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

// RecruitModal component for AI recruitment automation
const RecruitModal = ({
  showRecruitModal,
  setShowRecruitModal,
  recruitingRoleId,
  roles,
}) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [foundCandidates, setFoundCandidates] = useState([]);
  const [outreachResults, setOutreachResults] = useState([]);
  const [interestedCandidates, setInterestedCandidates] = useState([]);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);

  const role = roles.find((r) => r.id === recruitingRoleId);

  // Calendly configuration
  // TODO: Replace with your actual Calendly URL
  const calendlyUrl = "https://calendly.com/your-company/interview";

  // Alternative: You can create different Calendly URLs for different interview types
  const calendlyUrls = {
    initial: "https://calendly.com/your-company/initial-screening",
    technical: "https://calendly.com/your-company/technical-interview",
    cultural: "https://calendly.com/your-company/cultural-fit",
    final: "https://calendly.com/your-company/final-interview",
  };

  const openCalendlyScheduling = (candidate) => {
    setSchedulingCandidate(candidate);

    // Method 1: Open Calendly in a popup
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: `${calendlyUrl}?prefill_name=${encodeURIComponent(candidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(candidate.skills.join(", "))}`,
        text: "Schedule Interview",
        color: "#2563eb",
        textColor: "#ffffff",
        branding: true,
      });
    } else {
      // Fallback: Open Calendly in new tab
      const calendlyFullUrl = `${calendlyUrl}?prefill_name=${encodeURIComponent(candidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(candidate.skills.join(", "))}`;
      window.open(calendlyFullUrl, "_blank");
    }
  };

  const openCalendlyInline = (candidate) => {
    setSchedulingCandidate(candidate);
    setShowCalendlyModal(true);
  };

  const scheduleAllInterviews = () => {
    // Open Calendly for the top candidate first
    if (rankedCandidates.length > 0) {
      const topCandidate = rankedCandidates[0];

      if (window.Calendly) {
        window.Calendly.initPopupWidget({
          url: `${calendlyUrl}?prefill_name=${encodeURIComponent(topCandidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(topCandidate.skills.join(", "))}`,
          text: "Schedule Interview",
          color: "#16a34a",
          textColor: "#ffffff",
          branding: true,
        });

        // Show notification about scheduling all candidates
        alert(
          `Starting interview scheduling for all ${rankedCandidates.length} candidates. After scheduling ${topCandidate.name}, you'll be prompted to schedule the remaining candidates.`,
        );
      } else {
        // Fallback: Open multiple tabs for each candidate
        rankedCandidates.forEach((candidate, index) => {
          setTimeout(() => {
            const calendlyFullUrl = `${calendlyUrl}?prefill_name=${encodeURIComponent(candidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(candidate.skills.join(", "))}`;
            window.open(calendlyFullUrl, "_blank");
          }, index * 1000); // Stagger opening tabs by 1 second
        });
      }
    }
  };

  if (!showRecruitModal) return null;

  const stages = [
    {
      id: 1,
      name: "AI Search",
      description:
        "Searching across LinkedIn, Indeed, GitHub, AngelList, and Stack Overflow",
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
      description: "Sending personalized messages to qualified candidates",
      action: "Automated messaging",
    },
    {
      id: 3,
      name: "Interest Collection",
      description: "Collecting responses and gauging candidate interest",
      action: "Response tracking",
    },
    {
      id: 4,
      name: "Ranking",
      description: "AI ranking candidates and selecting top 5 for interviews",
      action: "Smart selection",
    },
  ];

  const startRecruitment = async () => {
    setIsRunning(true);
    setCurrentStage(1);

    // Stage 1: AI Search
    setStageProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setStageProgress(i);
    }

    // Mock found candidates
    const mockCandidates = [
      {
        id: 1,
        name: "Sarah Chen",
        platform: "LinkedIn",
        match: 95,
        skills: ["React", "TypeScript", "Node.js"],
      },
      {
        id: 2,
        name: "Marcus Johnson",
        platform: "GitHub",
        match: 92,
        skills: ["Python", "Django", "PostgreSQL"],
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        platform: "Indeed",
        match: 89,
        skills: ["Java", "Spring", "AWS"],
      },
      {
        id: 4,
        name: "Alex Kim",
        platform: "Stack Overflow",
        match: 87,
        skills: ["Vue.js", "Node.js", "MongoDB"],
      },
      {
        id: 5,
        name: "David Zhang",
        platform: "AngelList",
        match: 85,
        skills: ["Flutter", "Dart", "Firebase"],
      },
      {
        id: 6,
        name: "Priya Patel",
        platform: "LinkedIn",
        match: 83,
        skills: ["React Native", "iOS", "Android"],
      },
      {
        id: 7,
        name: "James Wilson",
        platform: "GitHub",
        match: 81,
        skills: ["Go", "Kubernetes", "Docker"],
      },
      {
        id: 8,
        name: "Lisa Brown",
        platform: "Indeed",
        match: 79,
        skills: ["C#", ".NET", "Azure"],
      },
    ];
    setFoundCandidates(mockCandidates);

    // Stage 2: Outreach
    setCurrentStage(2);
    setStageProgress(0);
    for (let i = 0; i <= 100; i += 12.5) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setStageProgress(i);
    }

    const mockOutreach = mockCandidates.map((candidate) => ({
      ...candidate,
      messageSent: true,
      sentAt: new Date().toISOString(),
      status: Math.random() > 0.3 ? "delivered" : "pending",
    }));
    setOutreachResults(mockOutreach);

    // Stage 3: Interest Collection
    setCurrentStage(3);
    setStageProgress(0);
    for (let i = 0; i <= 100; i += 16.7) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStageProgress(i);
    }

    const mockInterested = mockCandidates
      .filter(() => Math.random() > 0.4)
      .map((candidate) => ({
        ...candidate,
        interested: true,
        response: "I would love to learn more about this opportunity!",
        responseTime: Math.floor(Math.random() * 48) + 1 + " hours",
      }));
    setInterestedCandidates(mockInterested);

    // Stage 4: Ranking
    setCurrentStage(4);
    setStageProgress(0);
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setStageProgress(i);
    }

    const topCandidates = mockInterested
      .sort((a, b) => b.match - a.match)
      .slice(0, 5)
      .map((candidate, index) => ({
        ...candidate,
        rank: index + 1,
        aiScore: candidate.match + Math.floor(Math.random() * 5),
        recommendation:
          index === 0 ? "Strong Hire" : index < 3 ? "Hire" : "Consider",
      }));
    setRankedCandidates(topCandidates);

    setIsRunning(false);
  };

  const resetAndClose = () => {
    setCurrentStage(1);
    setIsRunning(false);
    setStageProgress(0);
    setFoundCandidates([]);
    setOutreachResults([]);
    setInterestedCandidates([]);
    setRankedCandidates([]);
    setShowRecruitModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI Recruitment Automation
              </h2>
              {role && (
                <p className="text-gray-600 mt-1">
                  Recruiting for:{" "}
                  <span className="font-semibold">{role.title}</span> •{" "}
                  {role.department} • {role.location}
                </p>
              )}
            </div>
            <button
              onClick={resetAndClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Stages */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStage > stage.id
                        ? "bg-green-500 text-white"
                        : currentStage === stage.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStage > stage.id ? <Check size={16} /> : stage.id}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-2 ${
                        currentStage > stage.id ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {stages[currentStage - 1]?.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {stages[currentStage - 1]?.description}
              </p>

              {isRunning && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stageProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Current Stage Content */}
          <div className="space-y-6">
            {currentStage === 1 && foundCandidates.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Found {foundCandidates.length} Candidates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foundCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-900">
                          {candidate.name}
                        </h5>
                        <span className="text-sm font-medium text-blue-600">
                          {candidate.match}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Source: {candidate.platform}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStage === 2 && outreachResults.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Outreach Results (
                  {
                    outreachResults.filter((r) => r.status === "delivered")
                      .length
                  }
                  /{outreachResults.length} delivered)
                </h4>
                <div className="space-y-3">
                  {outreachResults.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {candidate.name}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          via {candidate.platform}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          candidate.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStage === 3 && interestedCandidates.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {interestedCandidates.length} Interested Candidates
                </h4>
                <div className="space-y-4">
                  {interestedCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            {candidate.name}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            {candidate.match}% match
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Responded in {candidate.responseTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 italic">
                        "{candidate.response}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStage === 4 && rankedCandidates.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Top 5 Candidates Selected for Interviews
                </h4>
                <div className="space-y-4">
                  {rankedCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            #{candidate.rank} {candidate.name}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            AI Score: {candidate.aiScore}/100
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            candidate.recommendation === "Strong Hire"
                              ? "bg-green-100 text-green-800"
                              : candidate.recommendation === "Hire"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {candidate.recommendation}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => openCalendlyScheduling(candidate)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          >
                            <Calendar size={14} />
                            <span>Schedule Interview</span>
                          </button>

                          {/* Dropdown for scheduling options */}
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[200px]">
                            <div className="px-3 py-2 border-b border-gray-200">
                              <div className="text-xs font-medium text-gray-700 mb-1">
                                Quick Schedule
                              </div>
                              <button
                                onClick={() =>
                                  openCalendlyScheduling(candidate)
                                }
                                className="w-full px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2 rounded"
                              >
                                <ExternalLink size={12} />
                                <span>Any Available Slot</span>
                              </button>
                            </div>

                            <div className="px-3 py-2 border-b border-gray-200">
                              <div className="text-xs font-medium text-gray-700 mb-1">
                                Interview Type
                              </div>
                              <button
                                onClick={() =>
                                  scheduleSpecificInterview(
                                    candidate,
                                    "initial",
                                  )
                                }
                                className="w-full px-2 py-1 text-left text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                📋 Initial Screening (30 min)
                              </button>
                              <button
                                onClick={() =>
                                  scheduleSpecificInterview(
                                    candidate,
                                    "technical",
                                  )
                                }
                                className="w-full px-2 py-1 text-left text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                💻 Technical Interview (60 min)
                              </button>
                              <button
                                onClick={() =>
                                  scheduleSpecificInterview(
                                    candidate,
                                    "cultural",
                                  )
                                }
                                className="w-full px-2 py-1 text-left text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                🤝 Cultural Fit (45 min)
                              </button>
                              <button
                                onClick={() =>
                                  scheduleSpecificInterview(candidate, "final")
                                }
                                className="w-full px-2 py-1 text-left text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                🎯 Final Interview (30 min)
                              </button>
                            </div>

                            <div className="px-3 py-2">
                              <button
                                onClick={() => openCalendlyInline(candidate)}
                                className="w-full px-2 py-1 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-2 rounded"
                              >
                                <Calendar size={14} />
                                <span>Full Calendar View</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={resetAndClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>

            {!isRunning && currentStage === 1 && (
              <button
                onClick={startRecruitment}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Search size={16} />
                <span>Start AI Recruitment</span>
              </button>
            )}

            {!isRunning &&
              currentStage === 4 &&
              rankedCandidates.length > 0 && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => scheduleAllInterviews()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>Schedule All Interviews</span>
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Complete Recruitment
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Calendly Inline Modal */}
      {showCalendlyModal && schedulingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Schedule Interview - {schedulingCandidate.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {role?.title} •{" "}
                  {schedulingCandidate.skills.slice(0, 3).join(", ")}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCalendlyModal(false);
                  setSchedulingCandidate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="h-[600px]">
              <div
                className="calendly-inline-widget"
                data-url={`${calendlyUrl}?prefill_name=${encodeURIComponent(schedulingCandidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(schedulingCandidate.skills.join(", "))}`}
                style={{ minWidth: "320px", height: "100%" }}
              />
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Interview types available: Initial Screening, Technical
                Interview, Cultural Fit, Final Interview
              </div>
              <button
                onClick={() => {
                  setShowCalendlyModal(false);
                  setSchedulingCandidate(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const postAdvert = () => {
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
                  <span>{isPosting ? "Publishing..." : "Publish Advert"}</span>
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

const UPhirePlatform = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [roles, setRoles] = useState<Role[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitingRoleId, setRecruitingRoleId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Function to start AI recruitment for a specific role
  const startRecruitment = (roleId: number) => {
    setRecruitingRoleId(roleId);
    setShowRecruitModal(true);
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
        autoSend: false,
        template:
          "This Employment Agreement is entered into between {{company_name}} and {{candidate_name}} for the position of {{role_title}}.",
      },
    ];

    const mockEmployees = [
      {
        id: 1,
        name: "John Smith",
        position: "Senior Developer",
        department: "Engineering",
        startDate: "2024-01-15",
        status: "active",
        probationPeriod: false,
        avatar: "👨‍💼",
        email: "john.smith@company.com",
        documents: [],
      },
      {
        id: 2,
        name: "Lisa Wang",
        position: "Product Designer",
        department: "Design",
        startDate: "2024-03-01",
        status: "active",
        probationPeriod: true,
        avatar: "👩‍🎨",
        email: "lisa.wang@company.com",
        documents: [],
      },
    ];

    setRoles(mockRoles);
    setCandidates(mockCandidates);
    setDocuments(mockDocuments);
    setEmployees(mockEmployees);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "savings", label: "Savings", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "business", label: "My Business", icon: Factory },
  ];

  const DashboardTab = () => (
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
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {interview.date}
                    </p>
                    <p className="text-xs text-gray-500">{interview.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{role.title}</h4>
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

  const RolesTab = () => (
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

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button
                onClick={() => startRecruitment(role.id)}
                className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Search size={14} />
                <span>Recruit</span>
              </button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CandidatesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Candidates</h1>
          <p className="text-blue-100">
            Review and manage candidate applications
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white placeholder-blue-200 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
          <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all">
            <Filter size={16} />
            <span>Filter</span>
          </button>
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
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
                  <div className="flex items-center space-x-2 mt-1">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
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
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SavingsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cost Savings</h1>
          <p className="text-blue-100">
            Track your recruitment cost savings vs traditional agency fees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-3xl font-bold text-green-600">£47,250</p>
              <p className="text-sm text-green-500">vs 15% agency fees</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Per Hire</p>
              <p className="text-3xl font-bold text-blue-600">£2,350</p>
              <p className="text-sm text-blue-500">UPhire platform</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className="text-3xl font-bold text-purple-600">2,010%</p>
              <p className="text-sm text-purple-500">return on investment</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Savings Breakdown by Role
        </h3>
        <div className="space-y-4">
          {roles.map((role) => {
            const agencyCost = Math.round(
              (parseInt(role.salary.split("-")[1]?.replace(/[£,]/g, "")) ||
                60000) * 0.15,
            );
            const uphireCost = 2350;
            const savings = agencyCost - uphireCost;

            return (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{role.title}</h4>
                  <p className="text-sm text-gray-600">
                    {role.department} • {role.salary}
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-600">
                      £{agencyCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Agency Cost</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-600">
                      £{uphireCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">UPhire Cost</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">
                      £{savings.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Saved</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Documents</h1>
          <p className="text-blue-100">
            Manage offer letters, contracts, and automated communications
          </p>
        </div>
        <button
          onClick={() => setShowDocumentModal(true)}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
        >
          <Plus size={16} />
          <span>Create Document</span>
        </button>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Document Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    doc.autoSend
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800",
                  )}
                >
                  {doc.autoSend ? "Auto-send" : "Manual"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{doc.category}</p>
              <p className="text-xs text-gray-500">
                Last modified: {doc.lastModified}
              </p>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-blue-100">
            Deep insights into your recruitment performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Application Rate
              </p>
              <p className="text-2xl font-bold text-blue-600">18.5%</p>
              <p className="text-xs text-green-500">+2.3% from last month</p>
            </div>
            <BarChart2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Interview Rate
              </p>
              <p className="text-2xl font-bold text-purple-600">12.8%</p>
              <p className="text-xs text-green-500">+1.2% from last month</p>
            </div>
            <PieChart className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time to Hire</p>
              <p className="text-2xl font-bold text-green-600">23 days</p>
              <p className="text-xs text-green-500">-3 days from last month</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quality Score</p>
              <p className="text-2xl font-bold text-yellow-600">8.7/10</p>
              <p className="text-xs text-green-500">+0.3 from last month</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Source Performance
          </h3>
          <div className="space-y-4">
            {[
              { source: "LinkedIn", applications: 156, quality: 8.9 },
              { source: "Indeed", applications: 89, quality: 7.2 },
              { source: "Company Website", applications: 67, quality: 9.1 },
              { source: "Referrals", applications: 23, quality: 9.5 },
            ].map((source) => (
              <div
                key={source.source}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  {source.source}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-blue-600">
                      {source.applications}
                    </p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-600">
                      {source.quality}
                    </p>
                    <p className="text-xs text-gray-500">Quality</p>
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
              { dept: "Engineering", time: 21, cost: 2100 },
              { dept: "Product", time: 28, cost: 2600 },
              { dept: "Design", time: 19, cost: 1900 },
              { dept: "Sales", time: 15, cost: 1500 },
            ].map((dept) => (
              <div
                key={dept.dept}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">{dept.dept}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-blue-600">
                      {dept.time}d
                    </p>
                    <p className="text-xs text-gray-500">Avg Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-600">
                      £{dept.cost}
                    </p>
                    <p className="text-xs text-gray-500">Avg Cost</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EmployeesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Employees</h1>
          <p className="text-blue-100">Manage your team and employee records</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Directory
        </h3>
        <div className="space-y-4">
          {employees.map((employee) => {
            const startDate = new Date(employee.startDate);
            const today = new Date();
            const tenure = Math.floor(
              (today.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24 * 30),
            );

            return (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{employee.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {employee.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {employee.position} • {employee.department}
                    </p>
                    <p className="text-xs text-gray-500">
                      Started: {employee.startDate} • {tenure} months tenure
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      employee.probationPeriod
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800",
                    )}
                  >
                    {employee.probationPeriod ? "Probation" : "Confirmed"}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Information
            </h3>
            <div className="space-y-4">
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
                    {businessProfile.companyName || "Not set"}
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
                    {businessProfile.industry || "Not set"}
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
                    {businessProfile.location || "Not set"}
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
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {businessProfile.size || "Not set"}
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
                    {businessProfile.website || "Not set"}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Description
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Your Company
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
                <p className="text-gray-700">
                  {businessProfile.description || "Not set"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Culture & Values */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Culture & Values
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Mission
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
                <p className="text-gray-700">
                  {businessProfile.mission || "Not set"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Values
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={editForm.values}
                  onChange={(e) =>
                    setEditForm({ ...editForm, values: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What are your core values?"
                />
              ) : (
                <p className="text-gray-700">
                  {businessProfile.values || "Not set"}
                </p>
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
                  placeholder="Describe your company culture..."
                />
              ) : (
                <p className="text-gray-700">
                  {businessProfile.culture || "Not set"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits & Perks
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={editForm.benefits}
                  onChange={(e) =>
                    setEditForm({ ...editForm, benefits: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What benefits do you offer?"
                />
              ) : (
                <p className="text-gray-700">
                  {businessProfile.benefits || "Not set"}
                </p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "roles":
        return <RolesTab />;
      case "candidates":
        return <CandidatesTab />;
      case "savings":
        return <SavingsTab />;
      case "documents":
        return <DocumentsTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "employees":
        return <EmployeesTab />;
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                      <div className="p-3 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
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

      {showRecruitModal && (
        <RecruitModal
          showRecruitModal={showRecruitModal}
          setShowRecruitModal={setShowRecruitModal}
          recruitingRoleId={recruitingRoleId}
          roles={roles}
        />
      )}
    </div>
  );
};

export default UPhirePlatform;
