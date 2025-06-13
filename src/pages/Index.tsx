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

    setRoles(mockRoles);
    setCandidates(mockCandidates);
    setDocuments(mockDocuments);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Building },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "savings", label: "Savings", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

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
                            <button className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
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
We are seeking a talented ${formData.title} to join our ${formData.department} team${formData.location ? ` in ${formData.location}` : ""}. This is an excellent opportunity for a professional looking to make a significant impact in a dynamic, fast-growing organization.

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
  formData.benefits ||
  `• Competitive salary range${formData.salary ? `: ${formData.salary}` : ""}
• Comprehensive health and wellness benefits
• Professional development opportunities
• Flexible working arrangements
• Dynamic and inclusive work environment
• Career growth and advancement opportunities`
}

## About UPhire
UPhire is revolutionizing the recruitment industry with AI-powered solutions that help companies build diverse, high-performing teams faster and more cost-effectively than traditional methods.

Ready to join our mission? Apply now and let's shape the future of recruitment together!
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
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("description")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Zap size={16} />
                    <span>Generate Job Description</span>
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
                  £7,800
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
            Top Performing Roles
          </h3>
          <div className="space-y-4">
            {roles.slice(0, 3).map((role) => (
              <div key={role.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {role.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {role.candidates} candidates
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">
                    {role.deiScore}
                  </p>
                  <p className="text-xs text-gray-500">DEI Score</p>
                </div>
              </div>
            ))}
          </div>
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
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {role.candidates}
                </p>
                <p className="text-xs text-gray-500">Candidates</p>
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
              <div className="text-center">
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
      {showNewRoleModal && <NewRoleModal />}
      {showDocumentModal && <DocumentModal />}
    </div>
  );
};

export default UPhirePlatform;
