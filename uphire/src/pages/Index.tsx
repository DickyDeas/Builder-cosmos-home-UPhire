import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Check,
  CheckCircle,
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
  PoundSterling,
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
  Factory,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Bell,
  ArrowUp,
  ArrowDown,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Play,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { contactConfig } from "@/config/contact";
import { openCalendlyScheduling } from "@/config/calendly";
import {
  sendCandidateMessage,
  sendOfferEmail,
} from "@/services/emailService";
import {
  getOnboarding,
  startOnboarding,
  updateChecklist,
  addReference,
  setStartDateOptions,
  setFirstDayInfo,
} from "@/services/onboardingService";
import { toast } from "@/hooks/use-toast";
import type { Role, Candidate, ShortlistedCandidate, Document, Employee, JobBoardConfig, OutreachTouchpoint, OutreachSequence } from "./uphire/types";
import {
  getInterviewStageColor,
  getInterviewStageLabel,
  normalizeSalaryInput,
  computeAIMatchScore,
  formatCurrency,
  channelLabel,
} from "./uphire/utils";
import {
  mockRoles,
  mockCandidates,
  mockEmployees,
  mockDocuments,
  businessProfile,
  DEFAULT_JOB_BOARDS,
  loadJobBoardsFromStorage,
  STORAGE_KEY_PROFILE,
  STORAGE_KEY_JOB_BOARDS,
} from "./uphire/data";
import { fetchRoles, insertRole, updateRole } from "@/services/rolesService";
import { postJobToBoard } from "@/services/jobBoardService";
import { fetchUserTenants } from "@/services/tenantsService";
import { insertCandidate } from "@/services/candidatesService";
import { logAudit } from "@/services/auditService";
import { fetchEmployees, insertEmployee } from "@/services/employeesService";
import { fetchDocumentTemplates } from "@/services/documentTemplatesService";
import { TenantTeamSection } from "@/components/TenantTeamSection";
import { exportCandidateData, purgeCandidateData } from "@/services/dataExportService";
import { useCanWrite } from "@/hooks/useCanWrite";
import { MarketIntelligenceTab } from "./uphire/components/MarketIntelligenceTab";
import { DashboardTab } from "./uphire/views/DashboardTab";
import { AnalyticsTab } from "./uphire/views/AnalyticsTab";

// Component Definitions

// Employee Details Modal Component (retained for future use)
const _EmployeeDetailsModal = ({
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

  const formatSalary = (salary: string) => formatCurrency(salary);

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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-600">
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
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
                    {employee.employeeId}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {employee.employmentType}
                  </span>
                  {employee.probationPeriod && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
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
                      ? "border-slate-500 text-slate-600 bg-slate-50"
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
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Time with Company
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-600">
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
                    <p className="text-2xl font-bold text-slate-600">
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
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Probation Period
                </h3>
                {employee.probationPeriod ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Progress:
                      </span>
                      <span className="text-sm font-bold text-amber-600">
                        {probationDaysRemaining} days remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-amber-500 h-3 rounded-full transition-all"
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
                      <Calendar className="w-5 h-5 text-slate-600" />
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
                      <Calendar className="w-5 h-5 text-slate-600" />
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
                      <Calendar className="w-5 h-5 text-amber-600" />
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
                <button
                  onClick={() => toast({ title: "Coming soon", description: "Document upload – connect to Supabase storage when ready." })}
                  className="px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors flex items-center space-x-2 shadow-md"
                >
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
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-600" />
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
                        <button
                          onClick={() => toast({ title: "View document", description: document.name })}
                          className="flex-1 px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toast({ title: "Download", description: document.name })}
                          className="flex-1 px-3 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-700"
                        >
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
                  <button
                    onClick={() => toast({ title: "Coming soon", description: "Document upload – connect to Supabase storage when ready." })}
                    className="mt-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Upload First Document
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">8.7</p>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-600">94%</p>
                    <p className="text-sm text-gray-600">Goal Achievement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-600">15</p>
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
    </div>
  );
};

// Profile View Modal - detailed candidate profile per process flow
const ProfileViewModal = ({
  candidate,
  roleTitle,
  onClose,
  onScheduleInterview,
  onSendMessage,
}: {
  candidate: ShortlistedCandidate;
  roleTitle?: string;
  onClose: () => void;
  onScheduleInterview?: () => void;
  onSendMessage?: () => void;
}) => {
  const [aiProfile, setAiProfile] = useState<string | null>(null);
  const [generatingProfile, setGeneratingProfile] = useState(false);
  const generateProfile = () => {
    setGeneratingProfile(true);
    setTimeout(() => {
      const summary = `${candidate.name} is a ${candidate.experience} professional with strong skills in ${(candidate.skills || []).slice(0, 4).join(", ")}. Based in ${candidate.location}, they applied on ${candidate.applied} via ${candidate.source}. UPhireIQ AI Match: ${candidate.aiMatch}%. ${candidate.notes ? `Notes: ${candidate.notes}` : ""}`;
      setAiProfile(summary);
      setGeneratingProfile(false);
    }, 600);
  };
  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-gray-200">
            <span className="text-xl font-bold text-slate-600">{candidate.avatar}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
            <p className="text-sm text-gray-600">{candidate.email}</p>
            {candidate.phoneNumber && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Phone size={14} />
                {candidate.phoneNumber}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Location</span>
            <p className="font-medium">{candidate.location}</p>
          </div>
          <div>
            <span className="text-gray-500">Experience</span>
            <p className="font-medium">{candidate.experience}</p>
          </div>
          <div>
            <span className="text-gray-500">Source</span>
            <p className="font-medium">{candidate.source}</p>
          </div>
          <div>
            <span className="text-gray-500">Applied</span>
            <p className="font-medium">{candidate.applied}</p>
          </div>
          <div>
            <span className="text-gray-500">Stage</span>
            <p className="font-medium capitalize">
              {candidate.interviewStage.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <span className="text-gray-500">AI Match</span>
            <p className="font-medium text-slate-600">{candidate.aiMatch}%</p>
          </div>
        </div>
        {(candidate.linkedinProfile || candidate.githubProfile || candidate.portfolio) && (
          <div className="flex gap-3">
            {candidate.linkedinProfile && (
              <a
                href={candidate.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:underline text-sm"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            )}
            {candidate.githubProfile && (
              <a
                href={candidate.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-700 hover:underline text-sm"
              >
                <Github size={16} />
                GitHub
              </a>
            )}
            {candidate.portfolio && (
              <a
                href={candidate.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-700 hover:underline text-sm"
              >
                <ExternalLink size={16} />
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Skills Match */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills?.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      {candidate.notes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Notes
          </h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {candidate.notes}
          </p>
        </div>
      )}

      {/* AI-Generated Profile Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            AI Profile Summary
          </h3>
          <button
            onClick={generateProfile}
            disabled={generatingProfile}
            className="text-sm px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2"
          >
            <Brain size={14} />
            {generatingProfile ? "Generating..." : "Generate profile"}
          </button>
        </div>
        {aiProfile && (
          <p className="text-sm text-gray-700 bg-slate-50 border border-slate-200 p-3 rounded-lg">
            {aiProfile}
          </p>
        )}
      </div>

      {/* Interview History */}
      {candidate.interviewHistory?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Interview History
          </h3>
          <ul className="space-y-2">
            {candidate.interviewHistory.map((r) => (
              <li
                key={r.id}
                className="text-sm flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
              >
                <span className="capitalize">{r.type}</span>
                <span className="text-gray-500 capitalize">{r.status}</span>
                <span className="text-gray-500">{r.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        {onScheduleInterview && (
          <button
            onClick={() => {
              onScheduleInterview();
              onClose();
            }}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm"
          >
            Schedule Interview
          </button>
        )}
        {onSendMessage && (
          <button
            onClick={() => {
              onSendMessage();
              onClose();
            }}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 text-sm"
          >
            Send Message
          </button>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
};

// Screening Message Modal - screening questions exchange for candidates in screening stage
const ScreeningModal = ({
  candidate,
  role,
  onClose,
  onPassed,
  onFailed,
}: {
  candidate: ShortlistedCandidate;
  role: Role;
  onClose: () => void;
  onPassed?: () => void;
  onFailed?: () => void;
}) => {
  const [conversation, setConversation] = useState<{
    messages: Array<{ direction: string; content: string; createdAt: string }>;
    status: string;
  } | null>(null);
  const [sending, setSending] = useState(false);
  const [manualResponse, setManualResponse] = useState("");
  const [liveChatLink, setLiveChatLink] = useState<string | null>(null);
  const [liveChatSessionId, setLiveChatSessionId] = useState<string | null>(null);
  const [creatingLiveChat, setCreatingLiveChat] = useState(false);
  const [screeningResponses, setScreeningResponses] = useState<
    Array<{ question: string; response: string; timedOut: boolean }> | null
  >(null);

  useEffect(() => {
    import("@/services/screeningMessageService").then(({ getScreeningConversation }) => {
      const conv = getScreeningConversation(
        String(role.id),
        String(candidate.id),
        candidate.name,
        candidate.email,
        role.title
      );
      setConversation({
        messages: conv.messages.map((m: { direction: string; content: string; createdAt: string }) => ({
          direction: m.direction,
          content: m.content,
          createdAt: m.createdAt,
        })),
        status: conv.status,
      });
    });
  }, [candidate.id, candidate.name, candidate.email, role.id, role.title]);

  const handleStartLiveChat = async () => {
    setCreatingLiveChat(true);
    try {
      const { createScreeningSession } = await import("@/services/screeningChatService");
      const roleContext = {
        title: role.title,
        department: role.department,
        location: role.location,
        description: role.description,
        requirements: role.requirements,
        skills: role.requirements,
      };
      const { sessionId: sid, link } = await createScreeningSession(
        String(candidate.id),
        candidate.name,
        candidate.email,
        String(role.id),
        role.title,
        roleContext
      );
      setLiveChatLink(link);
      setLiveChatSessionId(sid);
      await navigator.clipboard.writeText(link);
      const { sendCandidateMessage } = await import("@/services/emailService");
      const emailSent = await sendCandidateMessage(
        candidate.email,
        candidate.name,
        `Hi ${candidate.name},\n\nYou've been invited to complete a timed screening for the ${role.title} role.\n\nThis is a live chat-style screening with role-specific questions. Each question is timed to ensure authentic responses.\n\nStart here: ${link}\n\nBest regards,\nUPhire Team`,
        role.title
      );
      if (emailSent) {
        toast({ title: "Link sent", description: "Live chat link created and sent to candidate. Link copied to clipboard." });
      } else {
        toast({ title: "Link created", description: "Link copied to clipboard. Send it to the candidate manually." });
      }
    } catch (err) {
      console.error("Failed to create live chat:", err);
      toast({ title: "Failed", description: "Failed to create live chat. Check Grok API key.", variant: "destructive" });
    } finally {
      setCreatingLiveChat(false);
    }
  };

  const handleStartScreening = async () => {
    setSending(true);
    try {
      const { startScreening } = await import("@/services/screeningMessageService");
      const ok = await startScreening(
        candidate.email,
        candidate.name,
        String(candidate.id),
        String(role.id),
        role.title
      );
      if (ok) {
        const { getScreeningConversation } = await import("@/services/screeningMessageService");
        const conv = getScreeningConversation(
          String(role.id),
          String(candidate.id),
          candidate.name,
          candidate.email,
          role.title
        );
        setConversation({
          messages: conv.messages.map((m: { direction: string; content: string; createdAt: string }) => ({
            direction: m.direction,
            content: m.content,
            createdAt: m.createdAt,
          })),
          status: conv.status,
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleRecordResponse = () => {
    if (!manualResponse.trim()) return;
    import("@/services/screeningMessageService").then(({ recordCandidateResponse, getScreeningConversation }) => {
      recordCandidateResponse(
        String(candidate.id),
        candidate.email,
        candidate.name,
        String(role.id),
        role.title,
        manualResponse.trim()
      );
      setManualResponse("");
      const conv = getScreeningConversation(
        String(role.id),
        String(candidate.id),
        candidate.name,
        candidate.email,
        role.title
      );
      setConversation({
        messages: conv.messages.map((m: { direction: string; content: string; createdAt: string }) => ({
          direction: m.direction,
          content: m.content,
          createdAt: m.createdAt,
        })),
        status: conv.status,
      });
    });
  };

  const handlePass = async () => {
    const { setScreeningOutcome } = await import("@/services/screeningMessageService");
    setScreeningOutcome(String(role.id), String(candidate.id), "passed");
    onPassed?.();
    onClose();
  };

  const handleFail = async () => {
    const { setScreeningOutcome } = await import("@/services/screeningMessageService");
    setScreeningOutcome(String(role.id), String(candidate.id), "failed");
    onFailed?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Screening: {candidate.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {role.title} • Assess suitability via screening questions
        </p>
        {conversation?.messages.length === 0 && !liveChatLink && (
          <div className="mb-4 space-y-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm font-medium text-indigo-900 mb-1">Live chat screening (recommended)</p>
              <p className="text-xs text-indigo-700 mb-2">
                Timed, role-specific skill questions. Candidate types responses in real time – prevents googling.
              </p>
              <button
                onClick={handleStartLiveChat}
                disabled={creatingLiveChat}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
              >
                {creatingLiveChat ? "Creating..." : "Start live chat screening"}
              </button>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-1">Or send questions via email (no timer)</p>
              <button
                onClick={handleStartScreening}
                disabled={sending}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
              >
                {sending ? "Sending..." : "Send first question via email"}
              </button>
            </div>
          </div>
        )}
        {liveChatLink && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <p className="text-sm font-medium text-green-800">Live chat link sent</p>
            <p className="text-xs text-green-700 break-all">{liveChatLink}</p>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(liveChatLink)}
                className="text-xs text-green-600 hover:underline"
              >
                Copy link again
              </button>
              {liveChatSessionId && (
                <button
                  onClick={async () => {
                    const { getSession } = await import("@/services/screeningChatService");
                    const s = await getSession(liveChatSessionId);
                    if (s?.responses?.length) {
                      setScreeningResponses(
                        s.responses.map((r) => ({
                          question: r.question,
                          response: r.response,
                          timedOut: r.timedOut,
                        }))
                      );
                    }
                  }}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  View responses
                </button>
              )}
            </div>
          </div>
        )}
        {screeningResponses && screeningResponses.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 border rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Screening responses</h3>
            {screeningResponses.map((r, i) => (
              <div key={i} className="border-b border-gray-200 pb-2 last:border-0">
                <p className="text-xs text-gray-500 mb-1">Q: {r.question}</p>
                <p className="text-sm text-gray-800">
                  A: {r.response} {r.timedOut && "(time expired)"}
                </p>
              </div>
            ))}
          </div>
        )}
        {conversation && conversation.messages.length > 0 && (
          <div className="space-y-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700">Message exchange</h3>
            {conversation.messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  m.direction === "outbound" ? "bg-slate-50 ml-4" : "bg-green-50 mr-4"
                }`}
              >
                <p className="text-xs text-gray-500 mb-1">
                  {m.direction === "outbound" ? "Sent" : "Response"} • {new Date(m.createdAt).toLocaleString()}
                </p>
                <p className="text-sm">{m.content}</p>
              </div>
            ))}
          </div>
        )}
        <div className="border-t pt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Record candidate response (from email reply)</label>
          <textarea
            value={manualResponse}
            onChange={(e) => setManualResponse(e.target.value)}
            placeholder="Paste candidate's reply here..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleRecordResponse}
            disabled={!manualResponse.trim()}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Add Response
          </button>
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <button
            onClick={handlePass}
            className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Pass â†’ Shortlist
          </button>
          <button
            onClick={handleFail}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Fail
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Send Message Modal - compose and send email to candidate via Brevo
const SendMessageModal = ({
  candidate,
  roleTitle,
  onClose,
  onSent,
}: {
  candidate: { name: string; email: string };
  roleTitle?: string;
  onClose: () => void;
  onSent?: () => void;
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateAIMessage = () => {
    setGenerating(true);
    setTimeout(() => {
      const generated = `Hi ${candidate.name.split(" ")[0]},\n\nI came across your profile and thought you might be a great fit for our ${roleTitle || "open position"}.\n\nWe're looking for talented professionals to join our team. Would you be open to a quick chat to explore if this could be a good match?\n\nBest regards`;
      setMessage(generated);
      setGenerating(false);
    }, 800);
  };

  const handleSend = async () => {
    if (!message.trim() || !candidate.email) return;
    setSending(true);
    try {
      const ok = await sendCandidateMessage(
        candidate.email,
        candidate.name,
        message.trim(),
        roleTitle
      );
      setSent(ok);
      if (ok) onSent?.();
    } catch {
      setSent(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Send Message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          To: {candidate.name} &lt;{candidate.email}&gt;
        </p>
        {roleTitle && (
          <p className="text-sm text-gray-600 mb-2">Re: {roleTitle}</p>
        )}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={generateAIMessage}
            disabled={generating}
            className="text-sm px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2"
          >
            <Brain size={14} />
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message or click Generate with AI..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        />
        {sent && (
          <p className="text-sm text-green-600 mb-2">Message sent successfully.</p>
        )}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400"
          >
            {sending ? "Sending..." : "Send"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Role Shortlist View Component
const RoleShortlistView = ({
  role,
  onBack,
  onScheduleInterview,
  onAddCandidate,
}: {
  role: Role;
  onBack: () => void;
  onScheduleInterview: (candidate: ShortlistedCandidate) => void;
  onAddCandidate?: () => void;
}) => {
  const [filterStage, setFilterStage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("aiMatch");
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [messageCandidate, setMessageCandidate] =
    useState<ShortlistedCandidate | null>(null);
  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const [screeningCandidate, setScreeningCandidate] =
    useState<ShortlistedCandidate | null>(null);
  const [showProfileView, setShowProfileView] = useState(false);
  const [profileCandidate, setProfileCandidate] =
    useState<ShortlistedCandidate | null>(null);
  const [showAddToShortlistModal, setShowAddToShortlistModal] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState<Set<string>>(new Set());
  const [candidates, setCandidates] = useState<ShortlistedCandidate[]>(
    role.shortlistedCandidates || []
  );

  const existingEmails = new Set((role.shortlistedCandidates || []).map((c) => c.email));
  const availableToAdd = mockCandidates.filter((c) => !existingEmails.has(c.email));

  const addCandidatesToShortlist = (selected: Candidate[]) => {
    const newShortlisted: ShortlistedCandidate[] = selected.map((c, i) => ({
      id: 900000 + Date.now() + i,
      name: c.name,
      email: c.email,
      location: c.location || "",
      experience: c.experience || "",
      skills: c.skills || [],
      aiMatch: computeAIMatchScore(c, role),
        source: c.source || "CRM",
        applied: c.applied || new Date().toISOString().split("T")[0],
        avatar: c.avatar || c.name.slice(0, 2).toUpperCase(),
        phoneNumber: c.phoneNumber,
        linkedinProfile: c.linkedinProfile,
        notes: c.notes,
        interviewStage: "shortlisted" as const,
      lastUpdated: new Date().toISOString().split("T")[0],
      interviewHistory: [],
    }));
    const updated = [...(role.shortlistedCandidates || []), ...newShortlisted];
    role.shortlistedCandidates = updated;
    role.shortlisted = updated.length;
    setCandidates(updated);
    setShowAddToShortlistModal(false);
  };

  useEffect(() => {
    setCandidates(role.shortlistedCandidates || []);
  }, [role]);

  const filteredCandidates =
    filterStage === "all"
      ? candidates
      : candidates.filter((c) => c.interviewStage === filterStage);

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "aiMatch") return b.aiMatch - a.aiMatch;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "applied")
      return new Date(b.applied).getTime() - new Date(a.applied).getTime();
    if (sortBy === "stage")
      return a.interviewStage.localeCompare(b.interviewStage);
    return 0;
  });

  const updateCandidateStage = async (
    candidateId: number,
    newStage: string,
    candidate: ShortlistedCandidate
  ) => {
    const updated = { ...candidate, interviewStage: newStage as ShortlistedCandidate["interviewStage"] };
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? updated : c))
    );
    // Persist to role's shortlistedCandidates
    const roleCandidates = role.shortlistedCandidates || [];
    const idx = roleCandidates.findIndex((c) => c.id === candidateId);
    if (idx >= 0) {
      roleCandidates[idx] = { ...roleCandidates[idx], ...updated };
    }
    if (newStage === "offer_made") {
      const ok = await sendOfferEmail(
        candidate.email,
        candidate.name,
        role.title,
        businessProfile.companyName,
        role.salary
      );
      if (ok) toast({ title: "Offer sent", description: `Offer email sent to ${candidate.name}.` });
      else toast({ title: "Failed", description: "Failed to send offer email. Check Brevo configuration.", variant: "destructive" });
    }
  };

  const STAGE_ORDER: ShortlistedCandidate["interviewStage"][] = [
    "shortlisted",
    "screening_scheduled",
    "screening_completed",
    "technical_scheduled",
    "technical_completed",
    "final_scheduled",
    "final_completed",
    "offer_made",
    "hired",
  ];
  const getNextStage = (stage: ShortlistedCandidate["interviewStage"]): ShortlistedCandidate["interviewStage"] | null => {
    const i = STAGE_ORDER.indexOf(stage);
    if (i < 0 || i >= STAGE_ORDER.length - 1) return null;
    return STAGE_ORDER[i + 1];
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
            className="flex items-center space-x-2 text-white hover:text-slate-200 transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            <span>Back to Roles</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {role.title} - Shortlist
            </h1>
            <p className="text-slate-200">
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
                ? "bg-slate-100 border-slate-300 ring-2 ring-slate-500 ring-opacity-50"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Users
              className={`w-6 h-6 mx-auto mb-2 ${
                filterStage === "all" ? "text-slate-600" : "text-gray-600"
              }`}
            />
            <p
              className={`text-2xl font-bold ${
                filterStage === "all" ? "text-slate-600" : "text-gray-900"
              }`}
            >
              {role.shortlistedCandidates?.length || 0}
            </p>
            <p
              className={`text-sm ${
                filterStage === "all" ? "text-slate-600" : "text-gray-600"
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
          <button
            onClick={() => setShowAddToShortlistModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors flex items-center space-x-2 shadow-md"
          >
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
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-600">
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
                            <p className="text-sm text-amber-600 font-medium">
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
                        <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4">
                          <p className="text-sm text-slate-800">
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
                    {getNextStage(candidate.interviewStage) && (
                      <button
                        onClick={() =>
                          updateCandidateStage(
                            candidate.id,
                            getNextStage(candidate.interviewStage)!,
                            candidate
                          )
                        }
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center space-x-2"
                      >
                        <Zap size={16} />
                        <span>Move to next stage</span>
                      </button>
                    )}
                    <button
                      onClick={() => onScheduleInterview(candidate)}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center space-x-2"
                    >
                      <Calendar size={16} />
                      <span>Schedule Interview</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileCandidate(candidate);
                        setShowProfileView(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors text-sm shadow-md"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setMessageCandidate(candidate);
                        setShowSendMessage(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors text-sm shadow-md"
                    >
                      Send Message
                    </button>
                    {(candidate.interviewStage === "screening_scheduled" ||
                      candidate.interviewStage === "screening_completed") && (
                      <button
                        onClick={() => {
                          setScreeningCandidate(candidate);
                          setShowScreeningModal(true);
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                      >
                        Screening Q&A
                      </button>
                    )}
                    <div className="relative">
                      <select
                        value={candidate.interviewStage}
                        onChange={(e) =>
                          updateCandidateStage(
                            candidate.id,
                            e.target.value,
                            candidate
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
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

      {showProfileView && profileCandidate && (
        <ProfileViewModal
          candidate={profileCandidate}
          roleTitle={role.title}
          onClose={() => {
            setShowProfileView(false);
            setProfileCandidate(null);
          }}
          onScheduleInterview={() => onScheduleInterview(profileCandidate)}
          onSendMessage={() => {
            setShowProfileView(false);
            setProfileCandidate(null);
            setMessageCandidate(profileCandidate);
            setShowSendMessage(true);
          }}
        />
      )}
      {showSendMessage && messageCandidate && (
        <SendMessageModal
          candidate={messageCandidate}
          roleTitle={role.title}
          onClose={() => {
            setShowSendMessage(false);
            setMessageCandidate(null);
          }}
        />
      )}
      {showScreeningModal && screeningCandidate && (
        <ScreeningModal
          candidate={screeningCandidate}
          role={role}
          onClose={() => {
            setShowScreeningModal(false);
            setScreeningCandidate(null);
          }}
          onPassed={() => {
            updateCandidateStage(screeningCandidate.id, "shortlisted", screeningCandidate);
          }}
          onFailed={() => {
            updateCandidateStage(screeningCandidate.id, "rejected", screeningCandidate);
          }}
        />
      )}
      {showAddToShortlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Add candidates to shortlist</h3>
              <p className="text-sm text-gray-600 mt-1">Select candidates from your CRM to add to {role.title}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {availableToAdd.length === 0 ? (
                <p className="text-gray-500">All candidates are already shortlisted for this role.</p>
              ) : (
                availableToAdd.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-slate-50 has-[:checked]:border-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedToAdd.has(c.email)}
                      onChange={(e) => {
                        setSelectedToAdd((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(c.email);
                          else next.delete(c.email);
                          return next;
                        });
                      }}
                    />
                    <span className="font-medium">{c.name}</span>
                    <span className="text-sm text-gray-500">{c.email}</span>
                    <span className="text-sm text-green-600 ml-auto">{c.aiMatch}% match</span>
                  </label>
                ))
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddToShortlistModal(false);
                  setSelectedToAdd(new Set());
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const toAdd = availableToAdd.filter((c) => selectedToAdd.has(c.email));
                  if (toAdd.length > 0) {
                    addCandidatesToShortlist(toAdd);
                    setSelectedToAdd(new Set());
                  } else setShowAddToShortlistModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-slate-600 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 shadow-md"
              >
                Add selected
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-slate-200 transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            <span>Back to Roles</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{role.title}</h1>
            <p className="text-slate-200">
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
                  : "bg-slate-100 text-slate-800"
            }`}
          >
            {role.priority} Priority
          </span>
        </div>
      </div>

      {/* Job Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <Users className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{role.candidates}</p>
          <p className="text-sm text-gray-600">Total Candidates</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{role.shortlisted}</p>
          <p className="text-sm text-gray-600">Shortlisted</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{role.interviewed}</p>
          <p className="text-sm text-gray-600">Interviewed</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
          <PoundSterling className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-gray-900">{formatCurrency(role.salary)}</p>
          <p className="text-sm text-gray-600">Salary Range</p>
        </div>
      </div>

      {/* Role Analytics Dashboard */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={22} />
          Role Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Hiring funnel</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Applications</span>
                <span className="font-semibold">{role.candidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="flex justify-between text-sm">
                <span>Shortlisted</span>
                <span className="font-semibold">{role.shortlisted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${role.candidates ? (role.shortlisted / role.candidates) * 100 : 0}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span>Interviewed</span>
                <span className="font-semibold">{role.interviewed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${role.shortlisted ? (role.interviewed / role.shortlisted) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Conversion rates</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Apply â†’ Shortlist</span>
                <span className="font-medium">{role.candidates ? ((role.shortlisted / role.candidates) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>Shortlist â†’ Interview</span>
                <span className="font-medium">{role.shortlisted ? ((role.interviewed / role.shortlisted) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Time metrics</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Days open</span>
                <span className="font-medium">{role.created ? Math.max(1, Math.floor((Date.now() - new Date(role.created).getTime()) / 86400000)) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. time to shortlist</span>
                <span className="font-medium">~3 days</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Top sources</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>LinkedIn</span><span className="font-medium">{Math.floor((role.candidates || 0) * 0.4)}</span></div>
              <div className="flex justify-between"><span>Job boards</span><span className="font-medium">{Math.floor((role.candidates || 0) * 0.35)}</span></div>
              <div className="flex justify-between"><span>Referrals</span><span className="font-medium">{Math.floor((role.candidates || 0) * 0.25)}</span></div>
            </div>
          </div>
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
                    <Award className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Competitive salary and equity package
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Comprehensive health and dental coverage
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Flexible working arrangements
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
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
                onClick={() => toast({ title: "Job editor", description: "Opening job description editor..." })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Edit Job Description
              </button>
              <button
                onClick={() =>
                  toast({ title: "Applications", description: "Viewing all applications for this role..." })
                }
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                View Applications
              </button>
              <button
                onClick={() => toast({ title: "Copied", description: "Job posting link copied to clipboard." })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Share Job Posting
              </button>
              <button
                onClick={() => setShowCloseConfirm(true)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close Position
              </button>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close position?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this position?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast({ title: "Closed", description: "Position closed successfully." });
              }}
            >
              Close position
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Create New Role Modal Component (also supports edit mode via roleToEdit)
const CreateNewRoleModal = ({
  isOpen,
  onClose,
  roleToEdit,
  onRoleSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  roleToEdit?: Role | null;
  onRoleSaved?: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    priority: "Medium",
    status: "Draft",
    description: "",
    requirements: [""],
    benefits: [] as string[],
    keySkills: "",
    experienceLevel: "",
    employmentType: "",
    workPattern: "",
    educationLevel: "",
  });

  const [showDescriptionGenerator, setShowDescriptionGenerator] =
    useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [runPredictionOnCreate, setRunPredictionOnCreate] = useState(false);

  useEffect(() => {
    if (isOpen && roleToEdit) {
      setFormData({
        title: roleToEdit.title,
        department: roleToEdit.department,
        location: roleToEdit.location,
        salary: roleToEdit.salary,
        priority: roleToEdit.priority,
        status: roleToEdit.status,
        description: roleToEdit.description || "",
        requirements: roleToEdit.requirements?.length ? roleToEdit.requirements : [""],
        benefits: roleToEdit.benefits || [],
        keySkills: roleToEdit.keySkills?.join(", ") || "",
        experienceLevel: roleToEdit.experienceLevel || "",
        employmentType: roleToEdit.employmentType || "",
        workPattern: roleToEdit.workPattern || "",
        educationLevel: roleToEdit.educationLevel || "",
      });
    } else if (isOpen && !roleToEdit) {
      setFormData({
        title: "",
        department: "",
        location: "",
        salary: "",
        priority: "Medium",
        status: "Draft",
        description: "",
        requirements: [""],
        benefits: [],
        keySkills: "",
        experienceLevel: "",
        employmentType: "",
        workPattern: "",
        educationLevel: "",
      });
    }
  }, [isOpen, roleToEdit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev];
      const list = Array.isArray(arr) ? arr : [];
      return {
        ...prev,
        [field]: list.map((item: string, i: number) => (i === index ? value : item)),
      };
    });
  };

  const addArrayItem = (field: string) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev];
      const list = Array.isArray(arr) ? arr : [];
      return { ...prev, [field]: [...list, ""] };
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev];
      const list = Array.isArray(arr) ? arr : [];
      return { ...prev, [field]: list.filter((_: string, i: number) => i !== index) };
    });
  };

  const toggleBenefit = (benefit: string) => {
    setFormData((prev) => {
      const selected = prev.benefits;
      const isSelected = selected.includes(benefit);
      return {
        ...prev,
        benefits: isSelected ? selected.filter((b) => b !== benefit) : [...selected, benefit],
      };
    });
  };

  const AVAILABLE_BENEFITS = [
    "Competitive salary with performance-based bonuses",
    "Comprehensive health and dental coverage",
    "Flexible working arrangements and remote options",
    "Professional development budget and conference attendance",
    "Stock options and equity participation",
    "25 days annual leave plus bank holidays",
    "Pension scheme",
    "Life insurance",
    "Cycle to work scheme",
    "Employee referral bonus",
    "Free snacks and drinks",
    "Wellness programme",
    "Gym membership",
    "State-of-the-art office facilities",
    "Team building activities and company events",
    "Mentorship and career advancement",
    "Learning and development opportunities",
    "Mental health support",
    "Parental leave",
    "Volunteering days",
  ];

  const generateJobDescription = async () => {
    if (!formData.title || !formData.department) {
      toast({ title: "Required fields", description: "Please enter job title and department first.", variant: "destructive" });
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
      "State-of-the-art office facilities",
      "Team building activities and company events",
      "Mentorship and career advancement",
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
      toast({ title: "Required fields", description: "Please enter job title and department first to run AI success prediction.", variant: "destructive" });
      return;
    }
    setShowPredictionModal(true);
  };

  const createRoleFromForm = (): Role => {
    const keySkillsList = formData.keySkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      id: mockRoles.length + 1,
      title: formData.title,
      department: formData.department,
      location: formData.location,
      status: formData.status,
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
      keySkills: keySkillsList,
      experienceLevel: formData.experienceLevel || undefined,
      employmentType: formData.employmentType || undefined,
      workPattern: formData.workPattern || undefined,
      educationLevel: formData.educationLevel || undefined,
    };
  };

  const publishToBroadbean = async (role: Role) => {
    toast({
      title: "Publishing role",
      description: "Pushing to licensed job boards, company career page, Google Jobs & other channels...",
    });

    const job: Parameters<typeof postJobToBoard>[2] = {
      title: role.title,
      description: role.description,
      location: role.location,
      salary: role.salary,
      employmentType: role.employmentType,
      requirements: role.requirements,
      keySkills: role.keySkills,
      experienceLevel: role.experienceLevel,
      workPattern: role.workPattern,
      benefits: role.benefits,
      department: role.department,
    };

    const tenants = await fetchUserTenants();
    const tenantId = tenants[0]?.id;
    if (!tenantId) {
      toast({
        title: "Job boards skipped",
        description: "No tenant found. Configure your organization to publish to job boards.",
        variant: "destructive",
      });
      return { success: false, publishedTo: [], companyWebsiteUrl: null };
    }

    const boards = loadJobBoardsFromStorage();
    const results = await Promise.all(
      boards.map((board) => postJobToBoard(tenantId, board.id, job).then((r) => ({ board: board.name, ...r })))
    );
    const successes = results.filter((r) => r.success);
    const failures = results.filter((r) => !r.success);

    const companyWebsite = businessProfile.website;
    const companyWebsiteUrl = companyWebsite ? `${companyWebsite}/careers/${role.title.toLowerCase().replace(/\s+/g, "-")}` : null;

    if (successes.length > 0) {
      toast({
        title: "Role published successfully",
        description: `Live on ${successes.map((r) => r.board).slice(0, 3).join(", ")}${successes.length > 3 ? `, +${successes.length - 3} more` : ""}${companyWebsite ? " • Company career page" : ""} • Google Jobs`,
      });
    }
    if (failures.length > 0 && successes.length === 0) {
      toast({
        title: "Job board posting failed",
        description: failures[0]?.error || "No active licenses. Configure job board credentials in Settings.",
        variant: "destructive",
      });
    } else if (failures.length > 0) {
      toast({
        title: "Partial publish",
        description: `${failures.length} board(s) need configuration. ${successes.length} published successfully.`,
      });
    }

    return {
      success: successes.length > 0,
      jobPostId: successes.length > 0 ? `BB_${Date.now()}` : undefined,
      publishedTo: successes.map((r) => r.board),
      companyWebsiteUrl,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const required = [
      ["title", "Job Title"],
      ["department", "Department"],
      ["location", "Location"],
      ["salary", "Salary Range"],
      ["keySkills", "Key Skills Required"],
      ["experienceLevel", "Experience Level"],
      ["employmentType", "Employment Type"],
      ["workPattern", "Work Pattern"],
      ["description", "Job Description"],
    ] as const;
    const missing = required.filter(([key]) => !formData[key]?.toString().trim());
    if (missing.length > 0) {
      toast({ title: "Required fields", description: `Please fill in: ${missing.map(([, label]) => label).join(", ")}`, variant: "destructive" });
      return;
    }
    const validRequirements = formData.requirements.filter((req) => req.trim() !== "");
    if (validRequirements.length === 0) {
      toast({ title: "Requirements", description: "Please add at least one requirement for better candidate matching.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const keySkillsList = formData.keySkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const baseRole = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        status: formData.status,
        salary: formData.salary,
        priority: formData.priority,
        description: formData.description,
        requirements: formData.requirements.filter((req) => req.trim() !== ""),
        benefits: formData.benefits.filter((benefit) => benefit.trim() !== ""),
        keySkills: keySkillsList,
        experienceLevel: formData.experienceLevel,
        employmentType: formData.employmentType,
        workPattern: formData.workPattern,
        educationLevel: formData.educationLevel || undefined,
      };

      const isDemo = sessionStorage.getItem("uphire_demo") === "true";
      const { data: { session } } = await supabase.auth.getSession();
      const useSupabase = session?.user && !isDemo;

      if (roleToEdit) {
        if (useSupabase && typeof roleToEdit.id === "string") {
          const ok = await updateRole(roleToEdit.id, baseRole);
          if (ok) onRoleSaved?.();
        } else {
          const idx = mockRoles.findIndex((r) => r.id === roleToEdit.id);
          if (idx >= 0) Object.assign(mockRoles[idx], baseRole);
        }
      } else {
        if (useSupabase) {
          const saved = await insertRole({
            ...baseRole,
            candidates: 0,
            shortlisted: 0,
            interviewed: 0,
            created: new Date().toISOString().split("T")[0],
            deiScore: 85,
            shortlistedCandidates: [],
          });
          if (saved) {
            mockRoles.push(saved);
            onRoleSaved?.();
          }
        } else {
          const newRole: Role = {
            ...baseRole,
            id: mockRoles.length + 1,
            candidates: 0,
            shortlisted: 0,
            interviewed: 0,
            created: new Date().toISOString().split("T")[0],
            deiScore: Math.floor(Math.random() * 20) + 80,
            shortlistedCandidates: [],
          };
          mockRoles.push(newRole);
        }
        await publishToBroadbean(roleToEdit || mockRoles[mockRoles.length - 1]);
      }

      // Reset form state
      setFormData({
        title: "",
        department: "",
        location: "",
        salary: "",
        priority: "Medium",
        status: "Draft",
        description: "",
        requirements: [""],
        benefits: [],
        keySkills: "",
        experienceLevel: "",
        employmentType: "",
        workPattern: "",
        educationLevel: "",
      });
      setShowDescriptionGenerator(false);
      setGeneratingDescription(false);
      setIsSubmitting(false);
      onClose();

      if (roleToEdit) {
        toast({ title: "Role updated", description: `Role "${formData.title}" updated successfully.` });
      } else {
        // Auto-search CV Database for matching candidates
        const roleKeywords = [
          formData.title,
          formData.department,
          ...(formData.keySkills ? formData.keySkills.split(",").map((s) => s.trim()) : []),
          ...(formData.requirements || []),
        ]
          .filter((s) => s && String(s).trim().length > 0)
          .join(" ")
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 2);
        const searchableCV = (r: { name?: string; location?: string; experience?: string; skills?: string[]; notes?: string }) =>
          [r.name, r.location, r.experience, (r.skills || []).join(" "), r.notes].filter(Boolean).join(" ").toLowerCase();
        const matchingCount = cvDatabaseForAutoSearch.filter((r) =>
          roleKeywords.some((kw) => searchableCV(r).includes(kw))
        ).length;
        const publishedRole = mockRoles[mockRoles.length - 1];
        const publishResult = { publishedTo: loadJobBoardsFromStorage().map((b) => b.name), companyWebsiteUrl: businessProfile.website ? `${businessProfile.website}/careers` : null, jobPostId: `BB_${Date.now()}` };
        let successMessage = `âœ… Role "${publishedRole.title}" created successfully!\n\nðŸ“¢ Published to Job Boards:\n${publishResult.publishedTo.join(", ")}\n\nðŸŒ Company Website:\n${publishResult.companyWebsiteUrl}\n\nðŸ“Š Broadbean Job ID: ${publishResult.jobPostId}`;
        if (matchingCount > 0) {
          successMessage += `\n\nðŸ“‹ CV Database: ${matchingCount} matching candidate(s) found. View them in the CV Database tab.`;
        }
        if (runPredictionOnCreate) {
          setTimeout(() => setShowPredictionModal(true), 500);
          successMessage += "\n\nðŸ§  UPhireIQ AI prediction will open automatically...";
        }
        toast({ title: "Role created", description: successMessage.replace(/\n\n/g, " • ").replace(/\n/g, " ") });
      }
    } catch (error) {
      setIsSubmitting(false);
      toast({ title: "Error", description: "Error creating role. Please try again.", variant: "destructive" });
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
                {roleToEdit ? "Edit Role" : "Create New Role"}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
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
                    onBlur={(e) => {
                      const n = normalizeSalaryInput(e.target.value);
                      if (n) handleInputChange("salary", n);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    placeholder="e.g. £60,000 - £85,000 or £50k - £65k"
                  />
                </div>
              </div>

              {/* Key Skills - critical for candidate matching */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Skills Required *
                </label>
                <input
                  type="text"
                  required
                  value={formData.keySkills}
                  onChange={(e) => handleInputChange("keySkills", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="e.g. React, TypeScript, Node.js, SQL, AWS (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List skills for matching candidates. More detail = stronger matches.
                </p>
              </div>

              {/* Experience, Employment Type, Work Pattern */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    required
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      handleInputChange("experienceLevel", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="">Select level</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                    <option value="Senior/Lead">Senior/Lead</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    required
                    value={formData.employmentType}
                    onChange={(e) =>
                      handleInputChange("employmentType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Pattern *
                  </label>
                  <select
                    required
                    value={formData.workPattern}
                    onChange={(e) =>
                      handleInputChange("workPattern", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="">Select pattern</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    handleInputChange("educationLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="">Not specified</option>
                  <option value="GCSE/A-Level">GCSE/A-Level</option>
                  <option value="Degree">Degree</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                  <option value="Professional qualification">Professional qualification</option>
                </select>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description *
                  </label>
                  <button
                    type="button"
                    onClick={generateJobDescription}
                    disabled={
                      !formData.title ||
                      !formData.department ||
                      generatingDescription
                    }
                    className="px-3 py-1 bg-gradient-to-r from-slate-600 to-slate-800 text-white text-xs rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
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
                  <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                        alt="UPhireIQ AI"
                        className="h-4 w-auto"
                      />
                      <span className="text-xs font-medium text-slate-800">
                        UPhireIQ AI Job Description Generator
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Using company profile from {businessProfile.companyName} •{" "}
                      {businessProfile.industry} • Founded{" "}
                      {businessProfile.founded}
                    </p>
                  </div>
                )}

                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Describe the role, responsibilities, and what you're looking for... or click 'AI Generate' to create from company profile"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Detailed descriptions improve candidate matching accuracy.
                </p>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Add at least one requirement. More detail improves match quality.
                </p>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("requirements", index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
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
                  className="text-slate-600 hover:text-slate-800 flex items-center space-x-1 text-sm"
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
                <p className="text-xs text-gray-500 mb-3">
                  Select the benefits that apply. None selected by default.
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_BENEFITS.map((benefit) => {
                    const isSelected = formData.benefits.includes(benefit);
                    return (
                      <button
                        key={benefit}
                        type="button"
                        onClick={() => toggleBenefit(benefit)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-slate-700 text-white hover:bg-slate-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        {benefit}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Prediction Panel */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                    alt="UPhireIQ AI"
                    className="h-6 w-auto flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      UPhireIQ AI Success Prediction
                    </h4>
                    <p className="text-slate-700 text-xs mt-1">
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
                    className="px-3 py-1 bg-gradient-to-r from-slate-600 to-slate-800 text-white text-xs rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
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
                  className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                />
                <label
                  htmlFor="runPrediction"
                  className="text-xs text-slate-700"
                >
                  Run AI success prediction automatically after creating role
                </label>
              </div>
            </div>

            {/* Broadbean Integration Info */}
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-slate-600 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Automated Job Board Publishing
                  </h4>
                  <p className="text-slate-700 text-xs mt-1">
                    Role will be automatically published via Broadbean.com to:
                    Indeed, LinkedIn, Adzuna, Totaljobs, Reed, CV-Library, and
                    your company website
                  </p>
                </div>
                <div className="text-slate-600 text-xs font-medium bg-slate-100 px-2 py-1 rounded">
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
                className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    <span>{roleToEdit ? "Saving..." : "Publishing..."}</span>
                  </>
                ) : (
                  <>
                    <span>{roleToEdit ? "Save Changes" : "Create & Publish Role"}</span>
                    {!roleToEdit && <ExternalLink size={16} />}
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

// AI Recruitment Modal Component
type CampaignType = "Standard" | "Aggressive" | "Gentle" | "Custom";

const AIRecruitmentModal = ({
  isOpen,
  onClose,
  roleId,
  onViewCandidates,
  onViewOutreach,
}: {
  isOpen: boolean;
  onClose: () => void;
  roleId: number | null;
  onViewCandidates: (role: Role) => void;
  onViewOutreach?: (role: Role) => void;
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [completed, setCompleted] = useState(false);
  const [campaignType, setCampaignType] = useState<CampaignType>("Standard");

  const role = mockRoles.find((r) => r.id === roleId);

  const campaignConfig: Record<CampaignType, { desc: string; steps: { label: string; duration: number }[] }> = {
    Standard: {
      desc: "Balanced outreach: 3–5 touchpoints over 2 weeks",
      steps: [
        { label: "Analyzing job requirements...", duration: 1000 },
        { label: "Scanning job board postings...", duration: 1000 },
        { label: "Searching LinkedIn for candidates...", duration: 1500 },
        { label: "Scanning Indeed profiles...", duration: 1200 },
        { label: "Searching GitHub for technical candidates...", duration: 1500 },
        { label: "Running UPhireIQ AI matching...", duration: 2000 },
        { label: "Generating candidate reports...", duration: 800 },
      ],
    },
    Aggressive: {
      desc: "High-volume: 7+ touchpoints, broader search, faster follow-ups",
      steps: [
        { label: "Expanding search criteria (aggressive mode)...", duration: 800 },
        { label: "Searching LinkedIn, Indeed, GitHub, Stack Overflow...", duration: 2000 },
        { label: "Running broad AI matching...", duration: 1500 },
        { label: "Generating high-volume candidate list...", duration: 1000 },
      ],
    },
    Gentle: {
      desc: "Low-pressure: 2 touchpoints, highly targeted, personalised",
      steps: [
        { label: "Refining search for best-fit candidates...", duration: 1500 },
        { label: "Searching LinkedIn (targeted)...", duration: 1800 },
        { label: "Running strict AI matching (skills 40%, experience 30%, qualifications 20%)...", duration: 2500 },
        { label: "Generating curated candidate reports...", duration: 600 },
      ],
    },
    Custom: {
      desc: "Configure your own outreach sequence",
      steps: [
        { label: "Loading custom campaign settings...", duration: 500 },
        { label: "Searching configured sources...", duration: 2000 },
        { label: "Running UPhireIQ AI matching...", duration: 2000 },
        { label: "Finalizing recruitment pipeline...", duration: 500 },
      ],
    },
  };

  const startRecruitment = async () => {
    setIsRunning(true);
    setProgress(0);
    setCompleted(false);

    const config = campaignConfig[campaignType];
    toast({
      title: "Outreach process commenced",
      description: `AI recruitment (${campaignType}) is sourcing candidates. Track progress in the Outreach section.`,
    });

    for (let i = 0; i < config.steps.length; i++) {
      setCurrentStep(config.steps[i].label);
      await new Promise((resolve) => setTimeout(resolve, config.steps[i].duration));
      setProgress(((i + 1) / config.steps.length) * 100);
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
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                    alt="UPhireIQ AI"
                    className="h-8 w-auto"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      AI-Powered Candidate Search
                    </h4>
                    <p className="text-slate-700 text-sm">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign type</label>
                <div className="space-y-2">
                  {(["Standard", "Aggressive", "Gentle", "Custom"] as CampaignType[]).map((t) => (
                    <label key={t} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-slate-500 has-[:checked]:bg-slate-50/50">
                      <input
                        type="radio"
                        name="campaign"
                        value={t}
                        checked={campaignType === t}
                        onChange={() => setCampaignType(t)}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-900">{t}</span>
                        <p className="text-xs text-gray-600 mt-0.5">{campaignConfig[t].desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={startRecruitment}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Play size={20} />
                <span>Start AI Recruitment</span>
              </button>
            </div>
          )}

          {isRunning && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">{currentStep}</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-slate-600 to-slate-700 h-3 rounded-full transition-all duration-300"
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
                <p className="text-green-700">Outreach has commenced. Found 28 potential candidates.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded">
                  <p className="font-semibold text-slate-800">AI Matches</p>
                  <p className="text-slate-600">8 candidates (85%+ match)</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <p className="font-semibold text-slate-800">
                    Auto-Shortlisted
                  </p>
                  <p className="text-slate-600">5 top candidates</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Track outreach progress in the Outreach section before replies arrive.
              </p>

              <div className="flex gap-3">
                {onViewOutreach && role && (
                  <button
                    onClick={() => {
                      onViewOutreach(role);
                      onClose();
                    }}
                    className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                  >
                    View Outreach
                  </button>
                )}
                <button
                  onClick={() => {
                    if (role) {
                      onViewCandidates(role);
                    }
                    onClose();
                  }}
                  className="flex-1 bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  View Candidates
                </button>
              </div>
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

    const recommendations: string[] = [];
    const positive: string[] = [
      "Strong market demand for this role",
      "Attractive benefits package",
      "Growing company reputation",
      "Flexible working arrangements",
    ];
    const risks: string[] = [
      "High competition from other companies",
      "Limited candidate pool in current market",
      "Skill requirements may be too specific",
    ];

    // Fetch market data and check salary vs market rates
    let salaryInLine = true;
    let salaryRecommendation = "";
    if (role?.salary && role?.title) {
      try {
        const { fetchMarketData, parseSalaryString } = await import("@/services/marketDataService");
        const roleSalary = parseSalaryString(role.salary);
        const marketData = await fetchMarketData(role.title);
        const market = marketData.salary;

        if (roleSalary && market) {
          const roleMedian = roleSalary.median;
          const marketMin = market.min;
          const marketMax = market.max;
          const marketMedian = market.median;

          if (roleMedian < marketMin * 0.9) {
            salaryInLine = false;
            salaryRecommendation = `Salary (≈£${roleMedian.toLocaleString()}) is below market (£${marketMin.toLocaleString()}–£${marketMax.toLocaleString()}). Consider increasing to £${marketMin.toLocaleString()}–£${marketMedian.toLocaleString()} to attract quality candidates.`;
            risks.push("Salary below market rate may reduce applicant quality");
          } else if (roleMedian > marketMax * 1.1) {
            salaryRecommendation = `Salary (≈£${roleMedian.toLocaleString()}) is above market (£${marketMin.toLocaleString()}–£${marketMax.toLocaleString()}). May attract strong candidates but budget impact to consider.`;
          } else {
            positive.unshift("Competitive salary range aligned with market rates");
          }
        }
      } catch (_) {
        positive.unshift("Competitive salary range");
      }
    } else {
      positive.unshift("Competitive salary range");
    }

    if (salaryRecommendation) recommendations.push(salaryRecommendation);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockPrediction: PredictionData = {
      successRate: salaryInLine ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 15) + 70,
      confidence: Math.floor(Math.random() * 15) + 85,
      factors: {
        positive,
        risks,
      },
      recommendations: [
        ...recommendations,
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
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                    alt="UPhireIQ AI"
                    className="h-8 w-auto"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      AI Success Prediction
                    </h4>
                    <p className="text-slate-700 text-sm">
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
                className="w-full bg-gradient-to-r from-slate-600 to-slate-800 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Brain size={20} />
                <span>AI Success Prediction</span>
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">
                Analyzing role success factors...
              </p>
              <p className="text-sm text-gray-600">
                Checking salary vs market rates, demand, and success factors
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
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-600">
                    {prediction.confidence}%
                  </p>
                  <p className="text-slate-800 font-medium">AI Confidence</p>
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
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
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
                className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
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
const RolesTab = ({
  onAddCandidate,
  onAIRecruitComplete,
  onRoleSaved,
  canWrite = true,
}: {
  onAddCandidate?: (role?: Role) => void;
  onAIRecruitComplete?: (role: Role) => void;
  onRoleSaved?: () => void;
  canWrite?: boolean;
}) => {
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number | string>>(new Set());
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [recruitingRoleId, setRecruitingRoleId] = useState<number | string | null>(null);
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
        onAddCandidate={onAddCandidate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title, subtitle, and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Roles</h1>
          <p className="text-slate-200">
            Manage your open positions and recruitment pipeline
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowNewRoleModal(true)}
            disabled={!canWrite}
            className="flex items-center space-x-2 px-6 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>Create New Role</span>
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedRoleIds.size > 0 && (
        <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-900">
              {selectedRoleIds.size} role{selectedRoleIds.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() =>
                setSelectedRoleIds(
                  selectedRoleIds.size === mockRoles.length
                    ? new Set()
                    : new Set(mockRoles.map((r) => r.id))
                )
              }
              className="text-sm text-slate-600 hover:text-slate-800 font-medium"
            >
              {selectedRoleIds.size === mockRoles.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkEditModal(true)}
              disabled={!canWrite}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bulk Edit
            </button>
            <button
              onClick={() => setSelectedRoleIds(new Set())}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Roles Grid - white cards with soft shadow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockRoles.map((role) => (
          <div
            key={role.id}
            className={`bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow ${
              selectedRoleIds.has(role.id) ? "border-slate-500 ring-2 ring-slate-200" : "border-gray-100"
            }`}
          >
            {/* Job title, department, created date */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedRoleIds.has(role.id)}
                  onChange={(e) => {
                    setSelectedRoleIds((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.add(role.id);
                      else next.delete(role.id);
                      return next;
                    });
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                />
                <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">
                  {role.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {role.department} • {role.location}
                </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingRole(role)}
                  disabled={!canWrite}
                  className="p-1.5 text-gray-500 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit role"
                >
                  <Edit size={16} />
                </button>
                <p className="text-xs text-gray-500">
                  Created {role.created}
                </p>
              </div>
            </div>

            {/* Status / Priority tags */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  role.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {role.status}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  role.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : role.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-slate-100 text-slate-800"
                }`}
              >
                {role.priority}
              </span>
            </div>

            {/* Salary */}
            <p className="text-lg font-bold text-gray-900 mb-4">{formatCurrency(role.salary)}</p>

            {/* Candidate stats: Candidates, Shortlisted, Interviewed */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-600">
                  {role.candidates}
                </p>
                <p className="text-xs text-gray-500">Candidates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {role.shortlisted}
                </p>
                <p className="text-xs text-gray-500">Shortlisted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-600">
                  {role.interviewed}
                </p>
                <p className="text-xs text-gray-500">Interviewed</p>
              </div>
            </div>

            {/* Action buttons - two rows */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => viewJobDetails(role)}
                  className="px-2 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => setEditingRole(role)}
                  className="px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => generatePrediction(role)}
                  className="px-2 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-medium"
                >
                  AI Prediction
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddCandidate?.(role)}
                  disabled={!canWrite}
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                  <span>Add Candidate</span>
                </button>
                <button
                  onClick={() => viewShortlist(role)}
                  disabled={
                    !role.shortlistedCandidates ||
                    role.shortlistedCandidates.length === 0
                  }
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Users size={14} />
                  <span>Shortlist ({role.shortlistedCandidates?.length || 0})</span>
                </button>
                <button
                  onClick={() => startRecruitment(role.id)}
                  className="col-span-2 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  UPhireIQ AI Recruit
                </button>
              </div>
            </div>

            {/* UPhireIQ AI Match Score */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">
                  UPhireIQ AI Match Score
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {role.deiScore || 92}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${role.deiScore || 92}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateNewRoleModal
        isOpen={showNewRoleModal || !!editingRole}
        onClose={() => {
          setShowNewRoleModal(false);
          setEditingRole(null);
        }}
        roleToEdit={editingRole}
        onRoleSaved={onRoleSaved}
      />

      {showBulkEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bulk Edit Roles</h2>
            <p className="text-sm text-gray-600 mb-4">
              Update status or priority for {selectedRoleIds.size} selected role{selectedRoleIds.size !== 1 ? "s" : ""}.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="bulk-status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">— No change —</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  id="bulk-priority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">— No change —</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  const statusEl = document.getElementById("bulk-status") as HTMLSelectElement;
                  const priorityEl = document.getElementById("bulk-priority") as HTMLSelectElement;
                  const newStatus = statusEl?.value;
                  const newPriority = priorityEl?.value;
                  if (!newStatus && !newPriority) {
                    toast({ title: "Select fields", description: "Please select at least one field to update.", variant: "destructive" });
                    return;
                  }
                  const count = selectedRoleIds.size;
                  selectedRoleIds.forEach((id) => {
                    const r = mockRoles.find((x) => x.id === id);
                    if (r) {
                      if (newStatus) r.status = newStatus;
                      if (newPriority) r.priority = newPriority;
                    }
                  });
                  setShowBulkEditModal(false);
                  setSelectedRoleIds(new Set());
                  toast({ title: "Updated", description: `Updated ${count} role(s) successfully.` });
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
              >
                Apply
              </button>
              <button
                onClick={() => setShowBulkEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AIRecruitmentModal
        isOpen={showRecruitModal}
        onClose={() => setShowRecruitModal(false)}
        roleId={recruitingRoleId}
        onViewCandidates={(role) => {
          setViewingShortlist(role);
          setShowRecruitModal(false);
        }}
        onViewOutreach={onAIRecruitComplete}
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
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-800">
                    UPhireIQ AI Match:{" "}
                    <strong>{schedulingCandidate.aiMatch}%</strong>
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    Skills: {schedulingCandidate.skills.join(", ")}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      openCalendlyScheduling(
                        {
                          name: schedulingCandidate.name,
                          email: schedulingCandidate.email,
                          skills: schedulingCandidate.skills.join(", "),
                        },
                        viewingShortlist?.title
                      );
                      setShowCalendlyModal(false);
                    }}
                    className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Open Calendly to Schedule
                  </button>
                  <button
                    onClick={() => setShowCalendlyModal(false)}
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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

// Candidates Tab Component
const CandidatesTab = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [schedulingCandidate, setSchedulingCandidate] =
    useState<Candidate | null>(null);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [messageCandidate, setMessageCandidate] = useState<Candidate | null>(null);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [makeOfferCandidate, setMakeOfferCandidate] = useState<Candidate | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCandidate, setOnboardingCandidate] = useState<Candidate | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const openCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetails(true);
  };

  const scheduleInterview = (candidate: Candidate) => {
    setSchedulingCandidate(candidate);
    setShowCalendlyModal(true);
  };

  /**
   * Shortlist a candidate by inserting a record into the
   * `shortlisted_candidates` table. A simple note can be provided
   * using a prompt. After a successful insert, the candidate's
   * status and notes are updated locally so the UI reflects the
   * change without a page reload.
   */
  const shortlistCandidate = async (candidate: Candidate) => {
    // Prompt the user for an optional note
    const note = window.prompt(
      `Add a note for shortlisting ${candidate.name} (optional):`,
      'Shortlisted',
    );
    try {
      const { error } = await supabase
        .from('shortlisted_candidates')
        .insert({
          candidate_id: candidate.id,
          role_id: null,
          notes: note || 'Shortlisted',
        });
      if (error) {
        console.error('Error shortlisting candidate:', error);
        toast({ title: "Shortlist failed", description: "See console for details.", variant: "destructive" });
        return;
      }
      // Update the candidate's status and notes locally
      candidate.status = 'Shortlisted';
      const newNote = note || 'Shortlisted';
      candidate.notes = candidate.notes
        ? `${candidate.notes} | ${newNote}`
        : newNote;
      // Provide feedback to the user
      toast({ title: "Shortlisted", description: `${candidate.name} has been shortlisted.` });
    } catch (err) {
      console.error('Unexpected error while shortlisting candidate:', err);
      toast({ title: "Error", description: "An unexpected error occurred while shortlisting.", variant: "destructive" });
    }
  };

  /**
   * Hire a candidate by updating their status in the `candidates` table.
   * Once hired, the candidate's status is updated locally and the user
   * receives a confirmation alert. In a production setting you might
   * also record the hire date or send onboarding emails.
   */
  const hireCandidate = async (candidate: Candidate) => {
    try {
      const { updateCandidate } = await import('@/services/candidatesService');
      await updateCandidate(candidate.id, { status: 'Hired' });
      candidate.status = 'Hired';
      toast({ title: "Hired", description: `${candidate.name} has been marked as hired.` });
    } catch (err) {
      console.error('Unexpected error while hiring candidate:', err);
      toast({ title: "Error", description: "An unexpected error occurred while hiring.", variant: "destructive" });
    }
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
          <p className="text-slate-200">
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
            onClick={() => toast({ title: "Search", description: "Opening advanced candidate search..." })}
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
            <Users className="w-6 h-6 text-slate-600" />
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
            <Calendar className="w-6 h-6 text-slate-600" />
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
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-600">
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
                      ? "bg-slate-100 text-slate-800"
                      : candidate.status === "Interview Scheduled"
                        ? "bg-slate-100 text-slate-800"
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => scheduleInterview(candidate)}
                  className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Schedule Interview
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setMessageCandidate(candidate);
                    setShowSendMessage(true);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setMakeOfferCandidate(candidate);
                    setShowMakeOffer(true);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Make Offer
                </button>
                <button
                  onClick={() => shortlistCandidate(candidate)}
                  className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                  Shortlist
                </button>
              </div>
              {(candidate.status === "Offer Made" || candidate.status === "Hired") && (
                <button
                  onClick={() => {
                    setOnboardingCandidate(candidate);
                    setShowOnboarding(true);
                  }}
                  className="w-full mt-2 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Onboarding
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showSendMessage && messageCandidate && (
        <SendMessageModal
          candidate={messageCandidate}
          roleTitle={messageCandidate.role}
          onClose={() => {
            setShowSendMessage(false);
            setMessageCandidate(null);
          }}
        />
      )}

      {showMakeOffer && makeOfferCandidate && (
        <MakeOfferModal
          candidate={makeOfferCandidate}
          onClose={() => {
            setShowMakeOffer(false);
            setMakeOfferCandidate(null);
          }}
          onOfferSent={() => {
            makeOfferCandidate.status = "Offer Made";
            setShowMakeOffer(false);
            setMakeOfferCandidate(null);
          }}
        />
      )}

      {showOnboarding && onboardingCandidate && (
        <OnboardingModal
          candidate={onboardingCandidate}
          onClose={() => {
            setShowOnboarding(false);
            setOnboardingCandidate(null);
          }}
        />
      )}

      {showCalendlyModal && schedulingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Schedule Interview
                </h2>
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
              <div className="space-y-4">
                <p className="text-gray-700">
                  Schedule an interview with{" "}
                  <strong>{schedulingCandidate.name}</strong>
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-800">
                    UPhireIQ AI Match:{" "}
                    <strong>{schedulingCandidate.aiMatch}%</strong>
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    Skills: {schedulingCandidate.skills.join(", ")}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      openCalendlyScheduling(
                        {
                          name: schedulingCandidate.name,
                          email: schedulingCandidate.email,
                          skills: schedulingCandidate.skills.join(", "),
                        },
                        schedulingCandidate.role
                      );
                      setShowCalendlyModal(false);
                      setSchedulingCandidate(null);
                    }}
                    className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Open Calendly to Schedule
                  </button>
                  <button
                    onClick={() => {
                      setShowCalendlyModal(false);
                      setSchedulingCandidate(null);
                    }}
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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

// Make Offer Modal - client confirms offer, salary pre-populated from role, shows offer letter template
const MakeOfferModal = ({
  candidate,
  onClose,
  onOfferSent,
}: {
  candidate: Candidate;
  onClose: () => void;
  onOfferSent: () => void;
}) => {
  const role = mockRoles.find((r) => r.title === candidate.role);
  const [salary, setSalary] = useState(role?.salary || "");
  const [benefits, setBenefits] = useState(
    role?.benefits?.join(", ") || ""
  );
  const [reportingTo, setReportingTo] = useState(
    role ? `Head of ${role.department}` : ""
  );
  const [sending, setSending] = useState(false);

  const companyName = businessProfile.companyName;
  const teamLine = role?.department
    ? (reportingTo ? `You will be joining the ${role.department} team, reporting to ${reportingTo}.` : `You will be joining the ${role.department} team.`)
    : (reportingTo ? `Reporting to ${reportingTo}.` : "");

  const offerLetterContent = `OFFER OF EMPLOYMENT

${companyName}
${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

Dear ${candidate.name},

We are pleased to extend an offer of employment for the position of ${candidate.role} at ${companyName}.

Position: ${candidate.role}
${teamLine ? `Team: ${teamLine}` : ""}

Compensation:
• Salary: ${salary ? formatCurrency(salary) : "[To be confirmed]"}
${benefits ? `• Benefits: ${benefits}` : ""}

This offer is subject to the satisfactory completion of reference checks and any other pre-employment requirements. Upon acceptance, you will receive further details regarding your start date and onboarding.

We look forward to welcoming you to the team.

Yours sincerely,
${companyName}`;

  const handleConfirmOffer = async () => {
    setSending(true);
    try {
      const ok = await sendOfferEmail(
        candidate.email,
        candidate.name,
        candidate.role,
        businessProfile.companyName,
        salary || undefined
      );
      if (ok) {
        startOnboarding({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          role: candidate.role,
        });
        onOfferSent();
        toast({ title: "Offer sent", description: `Offer email sent to ${candidate.name}. Onboarding will begin upon acceptance.` });
      } else {
        toast({ title: "Failed", description: "Failed to send offer email. Check Brevo configuration.", variant: "destructive" });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Make Offer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Offer for <strong>{candidate.name}</strong> – {candidate.role}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              onBlur={(e) => {
                const n = normalizeSalaryInput(e.target.value);
                if (n) setSalary(n);
              }}
              placeholder="e.g. £45,000 - £55,000 or £50k"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pre-populated from role advert. Edit as needed.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (optional)</label>
            <input
              type="text"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="e.g. Pension, health insurance, flexible working"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reporting to / Team</label>
            <input
              type="text"
              value={reportingTo}
              onChange={(e) => setReportingTo(e.target.value)}
              placeholder="e.g. Head of Engineering, Product Team"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer letter (this will be sent to the candidate)
          </label>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-800 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
            {offerLetterContent}
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-800">
          <p className="font-medium mb-2">Upon acceptance, full onboarding will include:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Contract sent and signed copy received</li>
            <li>ID documents (passport/visa/NI number)</li>
            <li>Bank details for payment</li>
            <li>References (candidate provides or referee contact for UPhire to request)</li>
            <li>Start date (client provides 3 options; notice period considered)</li>
            <li>First-day info (dress code, arrival time, handbook)</li>
          </ul>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleConfirmOffer}
            disabled={sending}
            className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Confirm & Send Offer"}
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Onboarding Modal - full onboarding checklist after offer acceptance
const OnboardingModal = ({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) => {
  const initialChecklist = (() => {
    let ob = getOnboarding(candidate.id);
    if (!ob) {
      startOnboarding({ id: candidate.id, name: candidate.name, email: candidate.email, role: candidate.role });
      ob = getOnboarding(candidate.id);
    }
    return ob?.checklist ?? {
      candidateId: candidate.id,
      contractSent: false,
      contractSignedReceived: false,
      idDocumentsReceived: false,
      bankDetailsReceived: false,
      referencesComplete: false,
      startDateConfirmed: false,
      firstDayInfoSent: false,
    };
  })();
  const [checklist, setChecklist] = useState(initialChecklist);
  const [refereeName, setRefereeName] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const [startDates, setStartDates] = useState(["", "", ""]);
  const [dressCode, setDressCode] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [handbookUrl, setHandbookUrl] = useState("");

  const toggleItem = (key: keyof typeof checklist, value: boolean) => {
    const next = { ...checklist, [key]: value };
    setChecklist(next);
    updateChecklist(candidate.id, next);
  };

  const handleAddReference = () => {
    if (refereeName && refereeEmail) {
      addReference(candidate.id, {
        refereeName,
        refereeEmail,
        relationship: "previous",
      });
      setRefereeName("");
      setRefereeEmail("");
    }
  };

  const handleSaveStartDates = () => {
    const options = startDates.filter(Boolean).map((d, i) => ({
      date: d,
      preferred: i === 0,
      confirmed: false,
    }));
    setStartDateOptions(candidate.id, options);
  };

  const handleSaveFirstDayInfo = () => {
    setFirstDayInfo(candidate.id, {
      dressCode: dressCode || undefined,
      arrivalTime: arrivalTime || undefined,
      handbookUrl: handbookUrl || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Onboarding: {candidate.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {candidate.role} – Full onboarding checklist. All data saved to Employees section.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Contract sent</span>
            <input
              type="checkbox"
              checked={checklist.contractSent}
              onChange={(e) => toggleItem("contractSent", e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Signed contract received</span>
            <input
              type="checkbox"
              checked={checklist.contractSignedReceived}
              onChange={(e) => toggleItem("contractSignedReceived", e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>ID documents (passport/visa/NI)</span>
            <input
              type="checkbox"
              checked={checklist.idDocumentsReceived}
              onChange={(e) => toggleItem("idDocumentsReceived", e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Bank details for payment</span>
            <input
              type="checkbox"
              checked={checklist.bankDetailsReceived}
              onChange={(e) => toggleItem("bankDetailsReceived", e.target.checked)}
            />
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">References</p>
            <p className="text-xs text-gray-500 mb-2">
              Candidate provides or add referee contact for UPhire to request
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Referee name"
                value={refereeName}
                onChange={(e) => setRefereeName(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <input
                type="email"
                placeholder="Referee email"
                value={refereeEmail}
                onChange={(e) => setRefereeEmail(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <button onClick={handleAddReference} className="px-3 py-1 bg-slate-700 text-white rounded text-sm">
                Add
              </button>
            </div>
            <input
              type="checkbox"
              checked={checklist.referencesComplete}
              onChange={(e) => toggleItem("referencesComplete", e.target.checked)}
            />
            <span className="ml-2 text-sm">Complete</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">Start date (client provides 3 options)</p>
            <input
              type="date"
              value={startDates[0]}
              onChange={(e) => setStartDates((s) => [e.target.value, s[1], s[2]])}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <input
              type="date"
              value={startDates[1]}
              onChange={(e) => setStartDates((s) => [s[0], e.target.value, s[2]])}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <input
              type="date"
              value={startDates[2]}
              onChange={(e) => setStartDates((s) => [s[0], s[1], e.target.value])}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <button onClick={handleSaveStartDates} className="text-sm text-slate-600 hover:underline">
              Save start date options
            </button>
            <div className="mt-2">
              <input
                type="checkbox"
                checked={checklist.startDateConfirmed}
                onChange={(e) => toggleItem("startDateConfirmed", e.target.checked)}
              />
              <span className="ml-2 text-sm">Confirmed with candidate</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">First-day info</p>
            <input
              type="text"
              placeholder="Dress code"
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <input
              type="text"
              placeholder="Arrival time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <input
              type="url"
              placeholder="Company handbook URL"
              value={handbookUrl}
              onChange={(e) => setHandbookUrl(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <button onClick={handleSaveFirstDayInfo} className="text-sm text-slate-600 hover:underline">
              Save & send to candidate
            </button>
            <div className="mt-2">
              <input
                type="checkbox"
                checked={checklist.firstDayInfoSent}
                onChange={(e) => toggleItem("firstDayInfoSent", e.target.checked)}
              />
              <span className="ml-2 text-sm">Sent</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="mt-6 px-4 py-2 border border-gray-300 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

const EmployeesTab = ({ canWrite = true }: { canWrite?: boolean }) => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [, forceUpdate] = useState(0);

  // Load employees from Supabase on mount (or from refreshPersistedData).
  useEffect(() => {
    const load = async () => {
      try {
        const employees = await fetchEmployees();
        if (employees.length > 0) {
          mockEmployees.splice(0, mockEmployees.length, ...employees);
        }
      } catch (err) {
        console.error('Unexpected error fetching employees', err);
      } finally {
        setEmployeesLoading(false);
        forceUpdate((n) => n + 1);
      }
    };
    load();
  }, []);

  // Handler to add a new employee. This prompts the user for
  // basic fields and inserts the record into Supabase. On success
  // the returned employee is appended to the mockEmployees array.
  const handleAddEmployee = async () => {
    const name = prompt('Enter employee name');
    if (!name) return;
    const email = prompt('Enter employee email') || '';
    const phone = prompt('Enter phone number') || '';
    const position = prompt('Enter position') || '';
    const department = prompt('Enter department') || '';
    const startDate = prompt('Enter start date (YYYY-MM-DD)') || '';
    const salaryRaw = prompt('Enter salary (e.g. £45,000 - £55,000 or £50k)') || '';
    const salary = salaryRaw ? normalizeSalaryInput(salaryRaw) : '';
    const manager = prompt('Enter manager name') || '';
    const employmentType =
      prompt('Employment type (Full-Time, Part-Time, Contract)') || '';
    const probationMonthsStr = prompt('Probation months (number)') || '';
    const probationMonths = probationMonthsStr
      ? parseInt(probationMonthsStr, 10)
      : 0;
    const probationPeriod = probationMonths > 0;
    const employeeId = prompt('Employee ID') || '';
    // Construct a minimal employee object. Note that documents and notes
    // fields are not collected here; you can extend this handler as
    // needed to capture additional information.
    const newEmployee: Partial<Employee> = {
      name,
      email,
      phoneNumber: phone,
      position,
      department,
      startDate,
      salary,
      manager,
      employmentType,
      probationPeriod,
      probationMonths,
      employeeId,
      documents: [],
    };
    try {
      const inserted = await insertEmployee(newEmployee);
      if (inserted) {
        mockEmployees.push(inserted);
        toast({ title: "Employee added", description: `${name} added successfully.` });
      } else {
        toast({ title: "Failed", description: "Failed to add employee. Please ensure you are logged in.", variant: "destructive" });
      }
    } catch (err) {
      console.error('Unexpected error inserting employee', err);
    }
  };

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600" />
      </div>
    );
  }

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
          <p className="text-slate-200">
            Comprehensive team management and HR records
          </p>
        </div>
        <button
          onClick={handleAddEmployee}
          disabled={!canWrite}
          className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Users className="w-8 h-8 text-slate-600" />
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
            <Clock className="w-8 h-8 text-amber-600" />
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
            <Building className="w-8 h-8 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Probation Alerts */}
      {employeesOnProbation.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">
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
                  className="bg-white rounded-lg p-4 border border-amber-200"
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
                      <p className="text-sm font-bold text-amber-700">
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
              onClick={() => toast({ title: "Search", description: "Opening employee search..." })}
              className="px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
            <button
              onClick={() => toast({ title: "Filters", description: "Opening employee filters..." })}
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
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-600">
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
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
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
                          <PoundSterling className="w-4 h-4 inline mr-1" />
                          {formatCurrency(employee.salary)}
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() =>
                    toast({ title: "Documents", description: `Opening documents for ${employee.name}...` })
                  }
                  className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Documents
                </button>
                <button
                  onClick={() =>
                    toast({ title: "Performance review", description: `Opening performance review for ${employee.name}...` })
                  }
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
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

const DocumentsTab = ({ canWrite = true }: { canWrite?: boolean }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [, forceUpdate] = useState(0);

  // Load documents from Supabase on mount.
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase.from('documents').select('*');
        if (error) {
          console.error('Error fetching documents from Supabase', error);
          return;
        }
        if (data && Array.isArray(data)) {
          const docs = data as unknown as Document[];
          mockDocuments.splice(0, mockDocuments.length, ...docs);
        }
      } catch (err) {
        console.error('Unexpected error fetching documents', err);
      } finally {
        setDocumentsLoading(false);
        forceUpdate((n) => n + 1);
      }
    };
    fetchDocuments();
  }, []);

  if (documentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600" />
      </div>
    );
  }

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
          <p className="text-slate-200">
            Manage contracts, handbooks, and HR documents
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={!canWrite}
            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => toast({ title: "Template creator", description: "Opening template creator..." })}
            disabled={!canWrite}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <FileText className="w-8 h-8 text-slate-600" />
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
            <Edit className="w-8 h-8 text-slate-600" />
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
            <AlertTriangle className="w-8 h-8 text-amber-600" />
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
                    ? "bg-slate-100 text-slate-800"
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
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-600" />
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
                              ? "bg-slate-100 text-slate-800"
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
                  onClick={() => toast({ title: "View document", description: document.name })}
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => toast({ title: "Download", description: document.name })}
                  className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => toast({ title: "Editor", description: `Opening editor for ${document.name}` })}
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDocToDelete(document)}
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

      <AlertDialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              {docToDelete ? `Delete ${docToDelete.name}?` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (docToDelete) {
                  toast({ title: "Deleted", description: "Document deleted." });
                  setDocToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Actions */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => toast({ title: "Templates", description: "Opening contract templates library..." })}
            className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <FileText className="w-8 h-8 text-slate-600 mb-2" />
            <h4 className="font-semibold text-slate-900">Contract Templates</h4>
            <p className="text-sm text-slate-700">
              Employment contracts, NDAs, offer letters
            </p>
          </button>

          <button
            onClick={() => toast({ title: "Auto-send", description: "Configuring auto-send document settings..." })}
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
            onClick={() => toast({ title: "Template editor", description: "Opening template editor..." })}
            className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <Edit className="w-8 h-8 text-slate-600 mb-2" />
            <h4 className="font-semibold text-slate-900">Template Editor</h4>
            <p className="text-sm text-slate-700">
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
          <p className="text-slate-200">
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
              toast({ title: "Export complete", description: "ROI and savings report exported successfully." })
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
            <PoundSterling className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost per Hire</p>
              <p className="text-3xl font-bold text-slate-600">
                £{savingsData.avgCostPerHire.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowDown className="w-4 h-4 mr-1" />
                -44% vs industry avg
              </p>
            </div>
            <Target className="w-8 h-8 text-slate-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Saved</p>
              <p className="text-3xl font-bold text-slate-600">
                {savingsData.timeSaved}h
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                per hire
              </p>
            </div>
            <Timer className="w-8 h-8 text-slate-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Efficiency Gain
              </p>
              <p className="text-3xl font-bold text-amber-600">
                {savingsData.efficiencyGain}%
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                improvement
              </p>
            </div>
            <Zap className="w-8 h-8 text-amber-600" />
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
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-slate-600" />
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
                <p className="text-lg font-bold text-slate-600">
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

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Process Optimization
                  </p>
                  <p className="text-sm text-gray-600">Streamlined workflows</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-600">
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
                    className="w-12 bg-gradient-to-t from-violet-600 via-purple-500 to-pink-500 rounded-t flex items-end justify-center pb-2 shadow-sm"
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
          <div className="text-center p-6 bg-slate-50 rounded-lg">
            <PoundSterling className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-slate-600">347%</p>
            <p className="text-sm text-gray-600">ROI in Year 1</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-600">8.2 months</p>
            <p className="text-sm text-gray-600">Payback Period</p>
          </div>

          <div className="text-center p-6 bg-slate-50 rounded-lg">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-slate-600">£428k</p>
            <p className="text-sm text-gray-600">Projected Annual Savings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock outreach data - derived from candidates, roles, and CRM/CV bank
interface OutreachTouchpoint {
  id: number;
  channel: "email" | "linkedin" | "job_board" | "indeed" | "sms" | "phone";
  sentAt: string;
  subject?: string;
  status: "sent" | "delivered" | "opened" | "replied" | "failed";
  response?: string;
  responseClassification?: "positive" | "negative" | "no_reply";
}

interface OutreachSequence {
  id: number;
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  status: "active" | "paused" | "completed" | "replied";
  touchpoints: OutreachTouchpoint[];
  source: "crm" | "job_board" | "linkedin" | "indeed" | "import";
}

const getOutreachSequences = (): OutreachSequence[] => {
  const sequences: OutreachSequence[] = [];
  let id = 1;
  mockRoles.forEach((role) => {
    role.shortlistedCandidates?.slice(0, 2).forEach((c) => {
      sequences.push({
        id: id++,
        candidateName: c.name,
        candidateEmail: c.email,
        roleTitle: role.title,
        status: "active",
        source: c.source === "LinkedIn" ? "linkedin" : "job_board",
        touchpoints: [
          {
            id: 1,
            channel: c.source === "LinkedIn" ? "linkedin" : "email",
            sentAt: c.applied,
            subject: `Re: ${role.title} opportunity`,
            status: id === 1 ? "replied" : "sent",
            responseClassification: id === 1 ? "positive" : undefined,
          },
        ],
      });
    });
  });
  mockCandidates.slice(0, 3).forEach((c) => {
    const role = mockRoles[0];
    if (role && !sequences.some((s) => s.candidateEmail === c.email)) {
      sequences.push({
        id: id++,
        candidateName: c.name,
        candidateEmail: c.email,
        roleTitle: role.title,
        status: "active",
        source: c.source === "LinkedIn" ? "linkedin" : "job_board",
        touchpoints: [
          { id: 1, channel: "email", sentAt: c.applied, subject: `Re: ${role.title}`, status: "replied", responseClassification: "positive" as const },
          { id: 2, channel: "job_board", sentAt: c.applied, status: "delivered", responseClassification: "no_reply" as const },
        ],
      });
    }
  });
  return sequences;
};

const channelLabel = (ch: OutreachTouchpoint["channel"]) =>
  ({ email: "Email", linkedin: "LinkedIn", job_board: "Job Board", indeed: "Indeed", sms: "SMS", phone: "Phone" }[ch]);

// Create Outreach Sequence Modal – candidate selection, job role, sequence config
const CreateOutreachSequenceModal = ({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (seq: OutreachSequence) => void;
}) => {
  const [step, setStep] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [channels, setChannels] = useState<OutreachTouchpoint["channel"][]>(["email", "linkedin"]);
  const [touchpointCount, setTouchpointCount] = useState(3);

  const allCandidates = [
    ...mockCandidates.map((c) => ({ name: c.name, email: c.email })),
    ...mockRoles.flatMap((r) =>
      (r.shortlistedCandidates || []).map((c) => ({ name: c.name, email: c.email }))
    ),
  ].filter((c, i, arr) => arr.findIndex((x) => x.email === c.email) === i);

  const toggleCandidate = (email: string) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const handleCreate = () => {
    const role = mockRoles.find((r) => r.id === selectedRoleId);
    if (!role || selectedCandidates.size === 0) {
      toast({ title: "Select items", description: "Please select at least one candidate and a job role.", variant: "destructive" });
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    let idBase = 500000 + Date.now();
    selectedCandidates.forEach((email) => {
      const c = allCandidates.find((x) => x.email === email);
      const name = c?.name || email;
      const seq: OutreachSequence = {
        id: idBase++,
        candidateName: name,
        candidateEmail: email,
        roleTitle: role.title,
        status: "active",
        source: "crm",
        touchpoints: channels.slice(0, touchpointCount).map((ch, i) => ({
          id: i + 1,
          channel: ch,
          sentAt: today,
          status: i === 0 ? "sent" : "delivered",
        })),
      };
      onCreated(seq);
    });
    onClose();
    setStep(0);
    setSelectedCandidates(new Set());
    setSelectedRoleId(null);
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: "Select candidates",
      body: (
        <div className="max-h-48 overflow-y-auto space-y-2">
          {allCandidates.slice(0, 20).map((c) => (
            <label key={c.email} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCandidates.has(c.email)}
                onChange={() => toggleCandidate(c.email)}
              />
              <span className="font-medium">{c.name}</span>
              <span className="text-sm text-gray-500">{c.email}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Select job role",
      body: (
        <div className="space-y-2">
          {mockRoles.filter((r) => r.status === "Active").map((r) => (
            <label key={r.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                checked={selectedRoleId === r.id}
                onChange={() => setSelectedRoleId(r.id)}
              />
              <span className="font-medium">{r.title}</span>
              <span className="text-sm text-gray-500">{r.department} • {r.location}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Sequence config",
      body: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
            <div className="flex flex-wrap gap-2">
              {(["email", "linkedin", "job_board", "indeed", "sms"] as const).map((ch) => (
                <label key={ch} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={channels.includes(ch)}
                    onChange={(e) =>
                      setChannels((prev) =>
                        e.target.checked ? [...prev, ch] : prev.filter((c) => c !== ch)
                      )
                    }
                  />
                  <span>{channelLabel(ch)}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Touchpoints</label>
            <select
              value={touchpointCount}
              onChange={(e) => setTouchpointCount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Outreach Sequence</h2>
        <p className="text-sm text-gray-600 mb-4">{steps[step].title}</p>
        <div className="mb-6">{steps[step].body}</div>
        <div className="flex justify-between">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            {step > 0 ? "Back" : "Cancel"}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-gradient-to-r from-slate-600 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 shadow-md">
              Next
            </button>
          ) : (
            <button onClick={handleCreate} className="px-4 py-2 bg-gradient-to-r from-slate-600 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 shadow-md">
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Outreach Dashboard Tab
const OutreachTab = ({ aiRecruitSequences = [] }: { aiRecruitSequences?: OutreachSequence[] }) => {
  const [outreachTab, setOutreachTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [manualSequences, setManualSequences] = useState<OutreachSequence[]>([]);
  const outreachSequences = React.useMemo(
    () => [...getOutreachSequences(), ...aiRecruitSequences, ...manualSequences],
    [aiRecruitSequences, manualSequences]
  );
  const outreachTabs = [
    { id: "overview", label: "Overview" },
    { id: "sequences", label: "Active Sequences" },
    { id: "candidates", label: "Candidates" },
    { id: "analytics", label: "Analytics" },
  ];

  const totalOutreach = outreachSequences.reduce((acc, s) => acc + s.touchpoints.length, 0);
  const activeCount = outreachSequences.filter((s) => s.status === "active").length;
  const repliedCount = outreachSequences.filter((s) => s.status === "replied").length;
  const responseRate = totalOutreach > 0 ? Math.round((repliedCount / totalOutreach) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Outreach Dashboard</h1>
          <p className="text-slate-200">
            Manage candidate outreach. Emails, LinkedIn (when connected), job boards, Indeed, SMS.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors shadow-md"
        >
          <Send className="w-5 h-5" />
          Start New Outreach
        </button>
      </div>

      <div className="flex gap-2 border-b border-white border-opacity-20 pb-4">
        {outreachTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setOutreachTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              outreachTab === tab.id
                ? "bg-white bg-opacity-20 text-white"
                : "text-slate-200 hover:text-white hover:bg-white hover:bg-opacity-10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {outreachTab === "overview" && (
      <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Outreach</p>
              <p className="text-3xl font-bold text-gray-900">{totalOutreach}</p>
            </div>
            <Send className="w-8 h-8 text-slate-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sequences</p>
              <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-slate-600" />
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Responses</p>
              <p className="text-3xl font-bold text-gray-900">{repliedCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Linkedin className="w-8 h-8 text-slate-600" />
            <h3 className="font-semibold text-gray-900">LinkedIn</h3>
            <span className="text-xs text-gray-500">(Connect in My Business)</span>
          </div>
          <p className="text-sm text-gray-600">
            {outreachSequences.filter((s) => s.touchpoints.some((t) => t.channel === "linkedin")).length} sent, 0
            responses
          </p>
          <p className="text-sm text-slate-600 font-medium">0% response rate</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold text-gray-900">Email</h3>
          </div>
          <p className="text-sm text-gray-600">
            {outreachSequences.filter((s) => s.touchpoints.some((t) => t.channel === "email")).length} sent, 0
            responses
          </p>
          <p className="text-sm text-green-600 font-medium">0% response rate</p>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-slate-600" />
            <h3 className="font-semibold text-gray-900">Job Boards / Indeed / SMS</h3>
          </div>
          <p className="text-sm text-gray-600">
            {outreachSequences.filter((s) =>
              s.touchpoints.some((t) => ["job_board", "indeed", "sms"].includes(t.channel))
            ).length}{" "}
            contacts
          </p>
          <p className="text-sm text-slate-600 font-medium">Via Brevo & feeds</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {outreachSequences.length > 0 ? (
          <div className="space-y-3">
            {outreachSequences.slice(0, 5).map((seq) => (
              <div
                key={seq.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Email sent to {seq.candidateName} re: {seq.roleTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {seq.touchpoints[0]?.sentAt} • {channelLabel(seq.touchpoints[0]?.channel || "email")}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Sent</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-sm">No recent outreach activity</p>
            <p className="text-xs mt-1">Start outreach from Roles or Candidates tab</p>
          </div>
        )}
      </div>
      </>
      )}

      {/* Active Sequences tab */}
      {outreachTab === "sequences" && (
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sequences</h3>
          <p className="text-sm text-gray-600 mb-4">
            Emails, LinkedIn messages (when connected), job board/Indeed contact, SMS. Touchpoints sent to candidates.
          </p>
          {outreachSequences.length > 0 ? (
            <div className="space-y-4">
              {outreachSequences.map((seq) => (
                <div
                  key={seq.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{seq.candidateName}</p>
                      <p className="text-sm text-gray-500">{seq.candidateEmail}</p>
                      <p className="text-sm text-slate-600 mt-1">Role: {seq.roleTitle}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        seq.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {seq.status}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-600 mb-2">Touchpoints</p>
                    <div className="space-y-2">
                      {seq.touchpoints.map((tp) => (
                        <div key={tp.id} className="flex items-center gap-3 text-sm flex-wrap">
                          <span
                            className={`w-24 px-2 py-0.5 rounded text-xs ${
                              tp.channel === "email"
                                ? "bg-green-100 text-green-800"
                                : tp.channel === "linkedin"
                                  ? "bg-slate-100 text-slate-800"
                                  : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {channelLabel(tp.channel)}
                          </span>
                          <span className="text-gray-600">{tp.sentAt}</span>
                          {tp.subject && <span className="text-gray-500 truncate max-w-[200px]">{tp.subject}</span>}
                          <span className="text-xs text-gray-400 capitalize">{tp.status}</span>
                          {tp.responseClassification && (
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                tp.responseClassification === "positive"
                                  ? "bg-green-100 text-green-800"
                                  : tp.responseClassification === "negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {tp.responseClassification === "positive"
                                ? "Positive"
                                : tp.responseClassification === "negative"
                                  ? "Negative"
                                  : "No reply"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p className="text-sm">No active sequences</p>
              <p className="text-xs mt-1">Create sequences from Start New Outreach or AI Recruit</p>
            </div>
          )}
        </div>
      )}

      {/* Candidates tab - CRM/CV bank with contact history */}
      {outreachTab === "candidates" && (
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Outreach Candidates</h3>
          <p className="text-sm text-gray-600 mb-4">
            Candidates from CRM bank (stored CVs), job boards, Indeed, LinkedIn. Review for new roles and contact
            suitable candidates.
          </p>
          <div className="space-y-4">
            {[...mockCandidates, ...mockRoles.flatMap((r) => r.shortlistedCandidates || [])]
              .filter((c, i, arr) => arr.findIndex((x) => (x as { email?: string }).email === (c as { email?: string }).email) === i)
              .slice(0, 10)
              .map((c, idx) => {
                const name = (c as { name: string }).name;
                const email = (c as { email: string }).email;
                const source = (c as { source?: string }).source || "CRM";
                const seq = outreachSequences.find((s) => s.candidateEmail === email);
                return (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{name}</p>
                      <p className="text-sm text-gray-500">{email}</p>
                      <p className="text-xs text-slate-600 mt-1">Source: {source}</p>
                    </div>
                    <div className="text-right">
                      {seq ? (
                        <div className="text-sm">
                          <span className="text-green-600">{seq.touchpoints.length} touchpoints</span>
                          <p className="text-xs text-gray-500">Re: {seq.roleTitle}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => toast({ title: "Add to outreach", description: `Add ${name} to outreach sequence – select role` })}
                          className="text-sm text-slate-600 hover:underline"
                        >
                          Add to sequence
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Analytics tab */}
      {outreachTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Channel Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Email</span>
                    <span>{outreachSequences.filter((s) => s.touchpoints.some((t) => t.channel === "email")).length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, outreachSequences.filter((s) => s.touchpoints.some((t) => t.channel === "email")).length * 20)}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>LinkedIn</span>
                    <span>{outreachSequences.filter((s) => s.touchpoints.some((t) => t.channel === "linkedin")).length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-slate-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, outreachSequences.filter((s) => s.touchpoints.some((t) => t.channel === "linkedin")).length * 20)}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Job Board / Indeed</span>
                    <span>{outreachSequences.filter((s) => s.touchpoints.some((t) => ["job_board", "indeed"].includes(t.channel))).length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-slate-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, outreachSequences.filter((s) => s.touchpoints.some((t) => ["job_board", "indeed"].includes(t.channel))).length * 20)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Response Rate</h3>
              <p className="text-4xl font-bold text-green-600">{responseRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Based on {totalOutreach} touchpoints</p>
            </div>
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">CRM Bank</h3>
              <p className="text-4xl font-bold text-slate-600">
                {mockCandidates.length + mockRoles.reduce((acc, r) => acc + (r.shortlistedCandidates?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Candidates available for new roles</p>
            </div>
          </div>
        </div>
      )}

      <CreateOutreachSequenceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(seq) => setManualSequences((prev) => [...prev, seq])}
      />
    </div>
  );
};

// CV Database Tab - all historical and current CVs, import/export, searchable
const CSV_HEADERS = [
  "name",
  "email",
  "phone",
  "location",
  "experience",
  "skills",
  "source",
  "notes",
  "linkedinProfile",
  "githubProfile",
  "portfolio",
  "aiGenerated",
];

interface CVRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: string;
  skills: string[];
  source?: string;
  notes?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  addedAt: string;
  aiGenerated?: boolean;
}

// AI-generated CV detection: uses AI service when available, falls back to heuristics
// Ensures no AI-written CVs go unflagged
const detectAIGeneratedCV = (r: CVRecord): boolean => {
  const text = [r.name, r.experience, r.notes, (r.skills || []).join(" ")].filter(Boolean).join(" ").toLowerCase();
  const aiPhrases = [
    "as an ai",
    "i am an ai",
    "i don't have personal",
    "i do not have personal",
    "i cannot provide",
    "language model",
    "ai assistant",
    "i'm an ai",
    "as a language model",
    "i don't have real",
    "i do not have real",
    "i have no personal",
    "i cannot have",
    "openai",
    "chatgpt",
    "generated by ai",
    "claude",
    "gemini",
  ];
  return aiPhrases.some((p) => text.includes(p));
};

// Module-level for auto-search when creating new roles
let cvDatabaseForAutoSearch: CVRecord[] = [];

const candidateToCVRecord = (c: Candidate, id: string): CVRecord => ({
  id,
  name: c.name,
  email: c.email,
  phone: c.phoneNumber,
  location: c.location,
  experience: c.experience,
  skills: c.skills || [],
  source: c.source,
  notes: c.notes,
  linkedinProfile: c.linkedinProfile,
  githubProfile: c.githubProfile,
  portfolio: c.portfolio,
  addedAt: c.applied || new Date().toISOString().slice(0, 10),
  aiGenerated: c.aiGenerated,
});

const getInitialCVRecords = (): CVRecord[] => {
  const records: CVRecord[] = [];
  let id = 1;
  mockCandidates.forEach((c) => records.push(candidateToCVRecord(c, `cv-${id++}`)));
  mockRoles.forEach((role) => {
    role.shortlistedCandidates?.forEach((c) => {
      if (!records.some((r) => r.email === c.email)) {
        records.push({
          id: `cv-${id++}`,
          name: c.name,
          email: c.email,
          phone: c.phoneNumber,
          location: c.location,
          experience: c.experience,
          skills: c.skills || [],
          source: c.source,
          notes: c.notes,
          addedAt: c.applied || new Date().toISOString().slice(0, 10),
          aiGenerated: c.aiGenerated,
        });
      }
    });
  });
  return records;
};
cvDatabaseForAutoSearch = getInitialCVRecords();

const CVDatabaseTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cvRecords, setCvRecords] = useState<CVRecord[]>(getInitialCVRecords);
  const [aiFilter, setAiFilter] = useState<"all" | "flagged" | "not_flagged">("all");
  const [isScanning, setIsScanning] = useState(false);
  const importFileRef = React.useRef<HTMLInputElement>(null);
  const [showScreenForRole, setShowScreenForRole] = useState(false);
  const [screeningResults, setScreeningResults] = useState<
    Array<{ name: string; email: string; score: number; aiFlagged: boolean; notes?: string }> | null
  >(null);
  const [isScreening, setIsScreening] = useState(false);

  useEffect(() => {
    cvDatabaseForAutoSearch = cvRecords;
  }, [cvRecords]);

  const searchableText = (r: CVRecord) =>
    [r.name, r.email, r.location, r.experience, r.skills.join(" "), r.notes, r.source].filter(Boolean).join(" ").toLowerCase();

  const keywordFiltered = searchQuery.trim()
    ? cvRecords.filter((r) => searchableText(r).includes(searchQuery.toLowerCase().trim()))
    : cvRecords;

  const filteredRecords =
    aiFilter === "flagged"
      ? keywordFiltered.filter((r) => r.aiGenerated)
      : aiFilter === "not_flagged"
        ? keywordFiltered.filter((r) => !r.aiGenerated)
        : keywordFiltered;

  const handleScanForAI = async () => {
    setIsScanning(true);
    try {
      const { scanCVsForAI } = await import("@/services/aiScreeningService");
      const cvProfiles = cvRecords.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        experience: r.experience,
        notes: r.notes,
        skills: r.skills || [],
      }));
      const results = await scanCVsForAI(cvProfiles);
      let flaggedCount = 0;
      setCvRecords((prev) =>
        prev.map((r) => {
          const detection = results.get(r.id);
          const detected = detection?.flagged ?? detectAIGeneratedCV(r);
          if (detected) flaggedCount++;
          return { ...r, aiGenerated: detected || r.aiGenerated };
        })
      );
      toast({
        title: "Scan complete",
        description: flaggedCount > 0
          ? `${flaggedCount} CV(s) flagged as potentially AI-generated.`
          : "No CVs flagged. (Heuristic + AI check ran.)",
      });
    } catch (err) {
      console.error("AI scan failed, using heuristics:", err);
      let flaggedCount = 0;
      setCvRecords((prev) =>
        prev.map((r) => {
          const detected = detectAIGeneratedCV(r);
          if (detected) flaggedCount++;
          return { ...r, aiGenerated: detected || r.aiGenerated };
        })
      );
      if (flaggedCount > 0) toast({ title: "Heuristic scan", description: `${flaggedCount} CV(s) flagged. (AI API unavailable.)` });
    } finally {
      setIsScanning(false);
    }
  };

  const toggleAiFlag = (id: string) => {
    setCvRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, aiGenerated: !r.aiGenerated } : r))
    );
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        if (lines.length < 2) {
          toast({ title: "Invalid CSV", description: "CSV must have header row and at least one data row.", variant: "destructive" });
          return;
        }
        const rawHeaders = lines[0].split(",").map((h) => h.trim());
        const headers = rawHeaders.map((h) => h.toLowerCase().replace(/\s+/g, "").replace(/_/g, ""));
        const headerAliases: Record<string, string[]> = {
          name: ["name", "fullname", "candidatename"],
          email: ["email", "emailaddress", "e-mail"],
          phone: ["phone", "phonenumber", "mobile", "telephone"],
          location: ["location", "city", "address"],
          experience: ["experience", "yearsexperience", "years"],
          skills: ["skills", "competencies", "technologies"],
          source: ["source", "origin", "applicationsource"],
          notes: ["notes", "comments", "remarks"],
          linkedinprofile: ["linkedinprofile", "linkedin", "linkedinurl", "linkedin_url"],
          githubprofile: ["githubprofile", "github", "githuburl", "github_url"],
          portfolio: ["portfolio", "website", "portfoliourl"],
          aigenerated: ["aigenerated", "ai_generated", "aigeneratedflag", "ai"],
        };
        const findCol = (canonical: string): number => {
          const aliases = headerAliases[canonical] || [canonical];
          for (const a of aliases) {
            const idx = headers.findIndex((h) => h === a || h.includes(a));
            if (idx >= 0) return idx;
          }
          return headers.indexOf(canonical);
        };
        const nameIdx = findCol("name");
        const emailIdx = findCol("email");
        if (nameIdx === -1 || emailIdx === -1) {
          toast({ title: "Invalid CSV", description: `CSV must include "name" and "email" columns. Found: ${rawHeaders.join(", ")}`, variant: "destructive" });
          return;
        }
        const newRecords: CVRecord[] = [];
        const maxId = cvRecords.reduce((m, r) => Math.max(m, parseInt(r.id.replace(/\D/g, "")) || 0), 0);
        const getVal = (vals: string[], canonical: string) => {
          const idx = findCol(canonical);
          return idx >= 0 ? vals[idx] ?? "" : "";
        };
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
          const name = vals[nameIdx] || "";
          const email = vals[emailIdx] || "";
          if (!name || !email) continue;
          const skillsStr = getVal(vals, "skills") || "";
          newRecords.push({
            id: `cv-${maxId + i}`,
            name,
            email,
            phone: getVal(vals, "phone") || undefined,
            location: getVal(vals, "location") || undefined,
            experience: getVal(vals, "experience") || undefined,
            skills: skillsStr ? skillsStr.split(/[,;|]/).map((s) => s.trim()).filter(Boolean) : [],
            source: getVal(vals, "source") || "Import",
            notes: getVal(vals, "notes") || undefined,
            linkedinProfile: getVal(vals, "linkedinprofile") || undefined,
            githubProfile: getVal(vals, "githubprofile") || undefined,
            portfolio: getVal(vals, "portfolio") || undefined,
            addedAt: new Date().toISOString().slice(0, 10),
            aiGenerated: /^(1|true|yes|y)$/i.test(getVal(vals, "aigenerated")),
          });
        }
        setCvRecords((prev) => [...prev, ...newRecords]);
        toast({ title: "Import complete", description: `Imported ${newRecords.length} CV(s) from CSV.` });
      } catch (err) {
        console.error(err);
        toast({ title: "Import failed", description: "Failed to parse CSV. Check format matches template.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const downloadTemplate = () => {
    const headerRow = CSV_HEADERS.join(",");
    const exampleRow = "John Smith,john@example.com,+44 20 1234 5678,London UK,5+ years,\"React,TypeScript,Node\",LinkedIn,Notes,https://linkedin.com/in/john,,https://portfolio.com,false";
    const csv = `${headerRow}\n${exampleRow}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uphire-cv-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (selectedOnly: boolean) => {
    const toExport = selectedOnly && selectedIds.size > 0
      ? cvRecords.filter((r) => selectedIds.has(r.id))
      : cvRecords;
    if (toExport.length === 0) {
      toast({ title: "Export", description: selectedOnly ? "No CVs selected. Select some or export all." : "No CVs to export.", variant: "destructive" });
      return;
    }
    const headerRow = CSV_HEADERS.join(",");
    const rows = toExport.map((r) =>
      [
        r.name,
        r.email,
        r.phone || "",
        r.location || "",
        r.experience || "",
        `"${(r.skills || []).join(",")}"`,
        r.source || "",
        r.notes || "",
        r.linkedinProfile || "",
        r.githubProfile || "",
        r.portfolio || "",
        r.aiGenerated ? "true" : "false",
      ].join(",")
    );
    const csv = [headerRow, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uphire-cv-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
  };

  const handleRunScreenForRole = async (roleId: number) => {
    const role = mockRoles.find((r) => r.id === roleId);
    if (!role) return;
    const toScreen = selectedIds.size > 0
      ? filteredRecords.filter((r) => selectedIds.has(r.id))
      : filteredRecords;
    if (toScreen.length === 0) {
      toast({ title: "Screening", description: "Select CVs to screen or screen all visible.", variant: "destructive" });
      return;
    }
    setIsScreening(true);
    setScreeningResults(null);
    try {
      const { screenCVs } = await import("@/services/aiScreeningService");
      const cvs = toScreen.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        experience: r.experience,
        notes: r.notes,
        skills: r.skills || [],
      }));
      const jobCriteria = {
        title: role.title,
        department: role.department,
        location: role.location,
        description: role.description,
        requirements: role.requirements,
        skills: role.keySkills && role.keySkills.length > 0 ? role.keySkills : (role.requirements || []),
        experience: role.experienceLevel,
        education: role.educationLevel,
      };
      const results = await screenCVs(cvs, jobCriteria);
      setScreeningResults(
        results.map((r) => ({
          name: r.cv.name,
          email: r.cv.email,
          score: r.overallScore,
          aiFlagged: r.aiGeneratedFlagged,
          notes: r.screeningNotes,
        }))
      );
    } catch (err) {
      console.error("Screening failed:", err);
      toast({ title: "Screening failed", description: "Check Grok API key in .env", variant: "destructive" });
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">CV Database</h1>
        <p className="text-slate-200">
          All historical and current CVs. Import from previous ATS, export when needed. Searched automatically when you create a new role.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, skills, location..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={aiFilter}
            onChange={(e) => setAiFilter(e.target.value as "all" | "flagged" | "not_flagged")}
            className="px-3 py-2 bg-white rounded-lg border border-gray-300 text-sm"
          >
            <option value="all">All CVs</option>
            <option value="flagged">AI-flagged only</option>
            <option value="not_flagged">Not flagged</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                disabled={isScanning || isScreening}
              >
                <MoreVertical size={16} />
                Actions
                <ChevronDown size={14} className="opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleScanForAI}
                disabled={isScanning || cvRecords.length === 0}
                className="flex items-center gap-2 cursor-pointer"
              >
                <AlertTriangle size={16} />
                {isScanning ? "Scanning..." : "Scan for AI"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowScreenForRole(true)}
                disabled={isScreening || cvRecords.length === 0 || mockRoles.length === 0}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Brain size={16} />
                {isScreening ? "Screening..." : "Screen for Role"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={downloadTemplate} className="flex items-center gap-2 cursor-pointer">
                <Download size={16} />
                Download template
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => importFileRef.current?.click()}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Upload size={16} />
                Import CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport(false)} className="flex items-center gap-2 cursor-pointer">
                <Download size={16} />
                Export all
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport(true)}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                Export selected ({selectedIds.size})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={importFileRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <p className="text-sm text-gray-600 mb-4">
          CSV headers: {CSV_HEADERS.join(", ")}. Use the template for import from a previous ATS.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-2">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedIds.size === filteredRecords.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Location</th>
                <th className="text-left py-2">Skills</th>
                <th className="text-left py-2">Source</th>
                <th className="text-left py-2">Added</th>
                <th className="text-left py-2" title="AI-generated flag">
                  <span className="flex items-center gap-1">
                    <AlertTriangle size={14} /> AI
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`border-b border-gray-100 hover:bg-gray-50 ${r.aiGenerated ? "bg-amber-50" : ""}`}>
                  <td className="py-2 pr-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                    />
                  </td>
                  <td className="py-2 font-medium">{r.name}</td>
                  <td className="py-2">{r.email}</td>
                  <td className="py-2">{r.location || "—"}</td>
                  <td className="py-2">{r.skills?.slice(0, 3).join(", ") || "—"}</td>
                  <td className="py-2">{r.source || "—"}</td>
                  <td className="py-2">{r.addedAt}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => toggleAiFlag(r.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        r.aiGenerated
                          ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={r.aiGenerated ? "Flagged as AI-generated. Click to clear." : "Click to flag as AI-generated"}
                    >
                      {r.aiGenerated ? "Flagged" : "—"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {searchQuery ? "No CVs match your search." : "No CVs yet. Import a CSV or add candidates via Roles/Candidates."}
          </div>
        )}
      </div>

      {showScreenForRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Screen CVs for Role</h2>
              <button
                onClick={() => {
                  setShowScreenForRole(false);
                  setScreeningResults(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Screen {selectedIds.size > 0 ? `${selectedIds.size} selected` : "all visible"} CV(s) against job role criteria. AI checks suitability and flags AI-generated content.
            </p>
            {!screeningResults ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Select role</label>
                <select
                  id="screen-role-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {mockRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.department}, {r.location})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const sel = document.getElementById("screen-role-select") as HTMLSelectElement;
                    handleRunScreenForRole(Number(sel?.value));
                  }}
                  disabled={isScreening}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isScreening ? "Screening..." : "Run AI Screening"}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Results (ranked by match)</h3>
                {screeningResults.map((r, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      r.aiFlagged ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-gray-600">{r.email}</p>
                      {r.notes && <p className="text-xs text-gray-500 mt-1">{r.notes}</p>}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-indigo-600">{r.score}%</span>
                      {r.aiFlagged && (
                        <span className="block text-xs text-amber-700 font-medium">AI-flagged</span>
                      )}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  Pass candidates to Screening stage (message exchange), then shortlist for client interview.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MyBusinessTab = ({ canWrite = true }: { canWrite?: boolean }) => {
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showAddJobBoard, setShowAddJobBoard] = useState(false);
  const [jobBoards, setJobBoards] = useState<JobBoardConfig[]>(() => loadJobBoardsFromStorage());
  const [editForm, setEditForm] = useState({ ...businessProfile });
  const [logoKey, setLogoKey] = useState(0); // force re-render when logo changes
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [purgeEmail, setPurgeEmail] = useState<string>("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file (PNG, JPEG, or WebP).", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      businessProfile.companyLogo = dataUrl;
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(businessProfile));
      } catch (_) {}
      setLogoKey((k) => k + 1);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLogoRemove = () => {
    delete businessProfile.companyLogo;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(businessProfile));
    } catch (_) {}
    setLogoKey((k) => k + 1);
  };

  useEffect(() => {
    setEditForm({ ...businessProfile });
  }, [showEditCompany]);

  const handleSaveCompany = () => {
    Object.assign(businessProfile, editForm);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(businessProfile));
    } catch (_) {}
    setShowEditCompany(false);
  };

  const handleAddJobBoard = (name: string, details: string) => {
    const id = `custom-${Date.now()}`;
    const newBoard: JobBoardConfig = { id, name, details, configured: false };
    const updated = [...jobBoards, newBoard];
    setJobBoards(updated);
    try {
      localStorage.setItem(STORAGE_KEY_JOB_BOARDS, JSON.stringify(updated));
    } catch (_) {}
    setShowAddJobBoard(false);
  };

  const handleRemoveJobBoard = (id: string) => {
    const updated = jobBoards.filter((b) => b.id !== id);
    setJobBoards(updated);
    try {
      localStorage.setItem(STORAGE_KEY_JOB_BOARDS, JSON.stringify(updated));
    } catch (_) {}
  };

  const handleConfigureJobBoard = (board: JobBoardConfig) => {
    toast({ title: "Configure job board", description: `${board.name}: ${board.details}. Enter credentials in the modal (coming soon).` });
    const updated = jobBoards.map((b) => (b.id === board.id ? { ...b, configured: true } : b));
    setJobBoards(updated);
    try {
      localStorage.setItem(STORAGE_KEY_JOB_BOARDS, JSON.stringify(updated));
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Business</h1>
          <p className="text-slate-200">Company profile and settings</p>
        </div>
        <button
          onClick={() => setShowEditCompany(true)}
          disabled={!canWrite}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit size={18} />
          Edit Company
        </button>
      </div>
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="space-y-4">
          <div key={logoKey}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Company Logo
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              PNG recommended. Used when job boards allow logos on adverts.
            </p>
            <div className="flex items-center gap-4">
              {businessProfile.companyLogo ? (
                <>
                  <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={businessProfile.companyLogo}
                      alt="Company logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-800">
                        <Upload size={14} />
                        Change
                      </span>
                    </label>
                    <button
                      onClick={handleLogoRemove}
                      className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-3 text-sm border-2 border-dashed border-gray-300 rounded-lg hover:border-slate-400 hover:bg-slate-50/50 transition-colors text-gray-600">
                    <Upload size={20} />
                    Upload logo (PNG recommended)
                  </span>
                </label>
              )}
            </div>
          </div>
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
              <div>
                <p className="text-sm font-medium text-gray-600">Headquarters</p>
                <p className="text-gray-900">{businessProfile.headquarters}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Website</p>
                <p className="text-gray-900">{businessProfile.website}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
            <p className="text-gray-700">{businessProfile.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Mission</p>
            <p className="text-gray-700">{businessProfile.mission}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <TenantTeamSection />
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Data & Privacy (GDPR)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Export or delete candidate data per GDPR rights. Requires candidate email.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  id="gdpr-email"
                  placeholder="Candidate email"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
                />
                <button
                  onClick={async () => {
                    const email = (document.getElementById("gdpr-email") as HTMLInputElement)?.value?.trim();
                    if (!email) {
                      toast({ title: "Email required", description: "Enter candidate email.", variant: "destructive" });
                      return;
                    }
                    try {
                      const data = await exportCandidateData(undefined, email);
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `candidate-data-${email.replace("@", "-at-")}.json`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                      toast({ title: "Export complete", description: "Candidate data downloaded." });
                    } catch (err) {
                      toast({ title: "Export failed", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
                    }
                  }}
                  disabled={!canWrite}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 text-sm disabled:opacity-50"
                >
                  Export data
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const email = (document.getElementById("gdpr-email") as HTMLInputElement)?.value?.trim();
                    if (!email) {
                      toast({ title: "Email required", description: "Enter candidate email.", variant: "destructive" });
                      return;
                    }
                    setPurgeEmail(email);
                    setShowPurgeConfirm(true);
                  }}
                  disabled={!canWrite}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                >
                  Purge data
                </button>
              </div>
            </div>
          </div>

          <AlertDialog open={showPurgeConfirm} onOpenChange={(open) => { setShowPurgeConfirm(open); if (!open) setPurgeEmail(""); }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Permanently delete data?</AlertDialogTitle>
                <AlertDialogDescription>
                  Permanently delete all data for {purgeEmail}? This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (!purgeEmail) return;
                    try {
                      await purgeCandidateData(undefined, purgeEmail);
                      toast({ title: "Data purged", description: `Data for ${purgeEmail} has been deleted.` });
                    } catch (err) {
                      toast({ title: "Purge failed", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
                    }
                    setShowPurgeConfirm(false);
                    setPurgeEmail("");
                  }}
                >
                  Purge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Job Board Licenses & Careers Page
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure your licensed job boards. Add credentials per board to post jobs and receive applications. Add any boards not listed below.
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">{jobBoards.length} board(s) configured</span>
              <button
                onClick={() => setShowAddJobBoard(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                <Plus size={16} />
                Add Job Board
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jobBoards.map((board) => (
                <div
                  key={board.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{board.name}</p>
                    <p className="text-xs text-gray-500">{board.details}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleConfigureJobBoard(board)}
                      className="px-3 py-1 text-sm bg-slate-700 text-white rounded hover:bg-slate-800"
                    >
                      Configure
                    </button>
                    {board.id.startsWith("custom-") && (
                      <button
                        onClick={() => handleRemoveJobBoard(board.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      {showEditCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Company Information</h2>
              <button onClick={() => setShowEditCompany(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm((f) => ({ ...f, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={editForm.industry}
                    onChange={(e) => setEditForm((f) => ({ ...f, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
                  <input
                    type="text"
                    value={editForm.founded}
                    onChange={(e) => setEditForm((f) => ({ ...f, founded: e.target.value }))}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                  <input
                    type="text"
                    value={editForm.employees}
                    onChange={(e) => setEditForm((f) => ({ ...f, employees: e.target.value }))}
                    placeholder="e.g. 150-250"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    value={editForm.headquarters}
                    onChange={(e) => setEditForm((f) => ({ ...f, headquarters: e.target.value }))}
                    placeholder="e.g. London, UK"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="e.g. www.company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                <textarea
                  value={editForm.mission}
                  onChange={(e) => setEditForm((f) => ({ ...f, mission: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveCompany}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditCompany(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Board Modal */}
      {showAddJobBoard && (
        <AddJobBoardModal
          onClose={() => setShowAddJobBoard(false)}
          onAdd={handleAddJobBoard}
        />
      )}
    </div>
  );
};

const AddJobBoardModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string, details: string) => void;
}) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), details.trim());
    setName("");
    setDetails("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Job Board</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Add a job board you have a licence for. Enter the name and any details (e.g. API info, feed URL).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Board Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CWJobs, Adzuna, Technojobs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details (optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. UK tech job board, configure credentials to post and receive applications"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
            >
              Add Board
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
// Helper to create an AI Recruit outreach sequence for the Outreach tab
const createAIRecruitSequence = (role: Role): OutreachSequence => ({
  id: 1000000 + Date.now(),
  candidateName: "AI Recruit (28 candidates)",
  candidateEmail: "outreach-in-progress",
  roleTitle: role.title,
  status: "active",
  source: "linkedin",
  touchpoints: [
    { id: 1, channel: "linkedin", sentAt: new Date().toISOString().split("T")[0], status: "sent" },
    { id: 2, channel: "email", sentAt: new Date().toISOString().split("T")[0], status: "sent" },
    { id: 3, channel: "job_board", sentAt: new Date().toISOString().split("T")[0], status: "delivered" },
  ],
});

const WELCOME_TOUR_KEY = "uphire_welcome_tour_done";
const ONBOARDING_KEY = "uphire_onboarding_done";

const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    companyName: businessProfile.companyName,
    industry: businessProfile.industry,
    founded: businessProfile.founded,
    employees: businessProfile.employees,
    headquarters: businessProfile.headquarters,
    website: businessProfile.website,
    description: businessProfile.description,
    teamSize: "1-5",
    teamEmails: "" as string,
    jobBoards: [] as string[],
  });

  const handleSubmit = () => {
    Object.assign(businessProfile, {
      companyName: form.companyName,
      industry: form.industry,
      founded: form.founded,
      employees: form.employees,
      headquarters: form.headquarters,
      website: form.website,
      description: form.description,
    });
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(businessProfile));
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch (_) {}
    onComplete();
  };

  const steps = [
    {
      title: "Company information",
      body: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. TechVision Solutions"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
              <input
                type="text"
                value={form.founded}
                onChange={(e) => setForm((f) => ({ ...f, founded: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. 2018"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
              <input
                type="text"
                value={form.employees}
                onChange={(e) => setForm((f) => ({ ...f, employees: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. 150-250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
              <input
                type="text"
                value={form.headquarters}
                onChange={(e) => setForm((f) => ({ ...f, headquarters: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. London, UK"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. www.company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Brief description of your company"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Team setup",
      body: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How many people will use UPhire?</label>
            <select
              value={form.teamSize}
              onChange={(e) => setForm((f) => ({ ...f, teamSize: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="1-5">1–5</option>
              <option value="6-20">6–20</option>
              <option value="21-50">21–50</option>
              <option value="51+">51+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invite team members (optional)</label>
            <textarea
              value={form.teamEmails}
              onChange={(e) => setForm((f) => ({ ...f, teamEmails: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter email addresses, one per line"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Integrations",
      body: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Select job boards you use or plan to use. You can configure credentials later in My Business.</p>
          {DEFAULT_JOB_BOARDS.slice(0, 6).map((b) => (
            <label key={b.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.jobBoards.includes(b.id)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    jobBoards: e.target.checked ? [...f.jobBoards, b.id] : f.jobBoards.filter((id) => id !== b.id),
                  }))
                }
              />
              <span className="font-medium">{b.name}</span>
              <span className="text-sm text-gray-500">{b.details}</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  const isLast = step >= steps.length - 1;
  const handleNext = () => {
    if (isLast) handleSubmit();
    else setStep((s) => s + 1);
  };
  const handleSkip = () => {
    try { localStorage.setItem(ONBOARDING_KEY, "true"); } catch (_) {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 cursor-pointer"
        onClick={handleSkip}
        aria-label="Click to skip"
      />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[step].title}</h3>
        <div className="mb-6">{steps[step].body}</div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{step + 1} of {steps.length}</span>
          <div className="flex gap-2">
            <button onClick={handleSkip} className="px-4 py-2 text-gray-600 hover:text-gray-800">Skip</button>
            <button onClick={handleNext} className="px-4 py-2 bg-gradient-to-r from-slate-600 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 shadow-md">
              {isLast ? "Get started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeTour = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome to UPhireIQ", body: "Your AI-powered recruitment platform. Let's take a quick tour of the key features." },
    { title: "Roles & Jobs", body: "Create roles, publish to job boards, and use AI Success Prediction to optimise your hiring." },
    { title: "Candidates & CV Database", body: "Manage applicants, screen CVs with AI, and shortlist the best matches." },
    { title: "Outreach & Market Intelligence", body: "Track outreach campaigns and get real-time salary and market data for UK roles." },
    { title: "You're all set!", body: "Explore the dashboard or head to Roles to create your first job. Need help? Check the Help Center." },
  ];
  const isLast = step >= steps.length - 1;
  const handleNext = () => {
    if (isLast) {
      try { localStorage.setItem(WELCOME_TOUR_KEY, "true"); } catch (_) {}
      onComplete();
    } else setStep((s) => s + 1);
  };
  const handleSkip = () => {
    try { localStorage.setItem(WELCOME_TOUR_KEY, "true"); } catch (_) {}
    onComplete();
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 cursor-pointer"
        onClick={handleSkip}
        aria-label="Click to skip"
      />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[step].title}</h3>
        <p className="text-gray-600 mb-6">{steps[step].body}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{step + 1} of {steps.length}</span>
          <div className="flex gap-2">
            <button onClick={handleSkip} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Skip
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-slate-600 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 shadow-md"
            >
              {isLast ? "Get started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UPhirePlatformComponent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [aiRecruitSequences, setAiRecruitSequences] = useState<OutreachSequence[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    initials: "",
  });

  const { canWrite } = useCanWrite();

  // Fetch candidates from Supabase on initial mount. This replaces the
  // mockCandidates array with real data from the `candidates` table. If
  // Supabase is not configured or the table is empty, the default
  // mockCandidates will be used instead.
  useEffect(() => {
    const fetchCandidatesFromSupabase = async () => {
      try {
        const { data, error } = await supabase.from('candidates').select('*').is('deleted_at', null);
        if (error) {
          console.error('Error fetching candidates from Supabase', error);
          return;
        }
        if (data && Array.isArray(data)) {
          let mapped = (data as any[]).map((c) => ({
            ...c,
            aiGenerated: c.ai_generated ?? c.aiGenerated,
          })) as unknown as Candidate[];
          // After loading candidates, load shortlist records and mark candidates accordingly
          try {
            const { data: shortlistData, error: shortlistError } = await supabase
              .from('shortlisted_candidates')
              .select('candidate_id, notes');
            if (!shortlistError && Array.isArray(shortlistData)) {
              const shortlistMap = new Map<number, string>();
              shortlistData.forEach((rec: any) => {
                shortlistMap.set(rec.candidate_id, rec.notes || 'Shortlisted');
              });
              mapped = mapped.map((c: any) => {
                if (shortlistMap.has(c.id)) {
                  const note = shortlistMap.get(c.id) || 'Shortlisted';
                  return {
                    ...c,
                    notes: c.notes ? `${c.notes} | ${note}` : note,
                  };
                }
                return c;
              });
            }
          } catch (shortErr) {
            console.error('Error fetching shortlisted candidates:', shortErr);
          }
          mockCandidates.splice(0, mockCandidates.length, ...mapped);
        }
      } catch (err) {
        console.error('Unexpected error fetching candidates', err);
      }
    };
    fetchCandidatesFromSupabase();
  }, []);

  /**
   * Handle clicking the "Add Candidate" button. For now this prompts the
   * user for a name and email and inserts a basic candidate record into
   * Supabase. In a production app you would open a modal with a form.
   */
  const handleAIRecruitComplete = (role: Role) => {
    setAiRecruitSequences((prev) => [...prev, createAIRecruitSequence(role)]);
    setActiveTab("outreach");
  };

  const handleAddCandidate = async (role?: Role) => {
    const name = window.prompt("Enter candidate name:");
    if (!name) return;
    const email = window.prompt("Enter candidate email:");
    if (!email) return;
    const roleId = role?.id ?? mockRoles[0]?.id;
    if (!roleId) {
      toast({ title: "No role", description: "Create a role first.", variant: "destructive" });
      return;
    }
    try {
      const data = await insertCandidate({
        role_id: roleId,
        name,
        email,
        phone: null,
        status: "new",
      });
      if (data) {
        const c = data as { id: number | string; name: string; email: string; phone?: string; status?: string };
        const avatar = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
        mockCandidates.push({
          id: c.id,
          name: c.name,
          email: c.email,
          role: "Unknown",
          location: "",
          experience: "",
          skills: [],
          aiMatch: 0,
          status: c.status || "new",
          source: "Manual",
          applied: new Date().toISOString(),
          avatar,
          phoneNumber: c.phone || undefined,
        } as Candidate);
        toast({ title: "Candidate added", description: `${name} has been added.` });
      }
    } catch (err) {
      console.error("Error adding candidate:", err);
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to add candidate", variant: "destructive" });
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "cv-database", label: "CV Database", icon: Target },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "outreach", label: "Outreach", icon: Send },
    { id: "market-intelligence", label: "Market Intelligence", icon: Globe },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "savings", label: "Savings", icon: PoundSterling },
    { id: "business", label: "My Business", icon: Building },
  ];

  const breadcrumbs = [
    "UPhire",
    ...(tabs
      .find((tab) => tab.id === activeTab)
      ?.label.toLowerCase()
      .split(" ") || []),
  ];

  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const refreshPersistedData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const isDemo = sessionStorage.getItem("uphire_demo") === "true";
    if (!session?.user || isDemo) return;

    try {
      const [roles, employees, docs] = await Promise.all([
        fetchRoles(),
        fetchEmployees(),
        fetchDocumentTemplates(),
      ]);
      if (roles.length > 0) mockRoles.splice(0, mockRoles.length, ...roles);
      if (employees.length > 0) mockEmployees.splice(0, mockEmployees.length, ...employees);
      if (docs.length > 0) mockDocuments.splice(0, mockDocuments.length, ...docs);
      setDataRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Error refreshing persisted data:", err);
    }
  }, []);

  // Sync auth state with Supabase session or demo login
  useEffect(() => {
    const updateFromSession = (session: { user: { email?: string; user_metadata?: { full_name?: string } } } | null) => {
      if (session?.user) {
        const email = session.user.email || "";
        const name = session.user.user_metadata?.full_name || email.split("@")[0] || "User";
        const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
        setUser({ name, email, role: "HR Manager", initials });
        setIsLoggedIn(true);
      } else if (sessionStorage.getItem("uphire_demo") === "true") {
        setUser({ name: "Admin", email: "demo@google", role: "Admin", initials: "AD" });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser({ name: "", email: "", role: "", initials: "" });
      }
    };
    supabase.auth.getSession().then(({ data: { session } }) => updateFromSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => updateFromSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Fetch persisted roles, employees, documents when logged in (Supabase session, not demo)
  useEffect(() => {
    if (!isLoggedIn) return;
    const isDemo = sessionStorage.getItem("uphire_demo") === "true";
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !isDemo) refreshPersistedData();
    });
  }, [isLoggedIn, refreshPersistedData]);

  useEffect(() => {
    if (!isLoggedIn || typeof window === "undefined") {
      setShowOnboarding(false);
      setShowWelcomeTour(false);
      return;
    }
    try {
      const onboardingDone = localStorage.getItem(ONBOARDING_KEY);
      const tourDone = localStorage.getItem(WELCOME_TOUR_KEY);
      if (!onboardingDone) setShowOnboarding(true);
      else if (!tourDone) setShowWelcomeTour(true);
    } catch (_) {}
  }, [isLoggedIn]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "roles":
        return <RolesTab onAddCandidate={handleAddCandidate} onAIRecruitComplete={handleAIRecruitComplete} onRoleSaved={refreshPersistedData} canWrite={canWrite} />;
      case "candidates":
        return <CandidatesTab />;
      case "cv-database":
        return <CVDatabaseTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "outreach":
        return <OutreachTab aiRecruitSequences={aiRecruitSequences} />;
      case "market-intelligence":
        return <MarketIntelligenceTab />;
      case "employees":
        return <EmployeesTab canWrite={canWrite} />;
      case "documents":
        return <DocumentsTab canWrite={canWrite} />;
      case "savings":
        return <SavingsTab />;
      case "business":
        return <MyBusinessTab canWrite={canWrite} />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {isLoggedIn && showOnboarding && (
        <OnboardingWizard
          onComplete={() => {
            setShowOnboarding(false);
            try {
              if (!localStorage.getItem(WELCOME_TOUR_KEY)) setShowWelcomeTour(true);
            } catch (_) {}
          }}
        />
      )}
      {isLoggedIn && showWelcomeTour && (
        <WelcomeTour onComplete={() => setShowWelcomeTour(false)} />
      )}
      {/* Sidebar - slides in from left when hamburger clicked */}
      {isLoggedIn && mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:bg-transparent"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-white/20 z-50 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10">
              <span className="text-white font-semibold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white bg-opacity-20 text-white"
                        : "text-slate-200 hover:text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Header: Burger left | Logo center | Bell + User right */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-white border-opacity-20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left: Hamburger menu */}
            <div className="flex-shrink-0 w-12 flex items-center">
              {isLoggedIn && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>
              )}
            </div>

            {/* Center: UPhireIQ logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <img
                src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-iq-logo-no-background-a3ed8d?format=webp&width=800"
                alt="UPhireIQ Logo"
                className="h-9 w-auto"
              />
            </div>

            {/* Right: Bell, User + dropdown */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isLoggedIn ? (
                <>
                  <button
                    className="text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-2 text-white hover:bg-white hover:bg-opacity-10 px-2 py-1.5 rounded-lg transition-all"
                    >
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{user.initials}</span>
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                      <ChevronDown size={16} className="text-white/80" />
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
                        <Link
                          to="/help"
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <HelpCircle size={16} />
                          <span>Help Center</span>
                        </Link>
                        <Link
                          to="/support"
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <MessageSquare size={16} />
                          <span>Support Tickets</span>
                        </Link>
                        <Link
                          to="/subscription"
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <PoundSterling size={16} />
                          <span>Upgrade / Manage Subscription</span>
                        </Link>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowLogoutConfirm(true);
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
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-teal-500/90 hover:bg-teal-500 text-white px-6 py-2 rounded-lg transition-all flex items-center space-x-2 font-medium shadow-md"
                >
                  <User size={16} />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {isLoggedIn && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-t border-white border-opacity-10">
            <nav className="text-sm">
              <span className="text-slate-200">
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
              <h2 className="text-4xl font-bold text-[#E51F6F]">
                Welcome to UPhire
              </h2>
              <p className="text-xl max-w-2xl mx-auto bg-uphire-hero-text bg-clip-text text-transparent">
                AI-powered recruitment infrastructure for modern teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <Zap className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Recruitment
                </h3>
                <p className="text-gray-600">
                  Intelligent candidate ranking across LinkedIn, Indeed, GitHub,
                  and more platforms.
                </p>
              </div>

              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  3 Touch Point Hire System
                </h3>
                <p className="text-gray-600">
                  Job-board posting, screening, shortlisting, and follow-up in one streamlined workflow.
                </p>
              </div>

              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Intelligence
                </h3>
                <p className="text-gray-600">
                  Real-time salary data, market demand analysis, and competitor insights.
                </p>
              </div>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-8 max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Platform Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    UPhireIQ AI-Driven Prediction
                  </p>
                  <p className="text-sm text-gray-600">
                    Role success analysis and recommendations
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    Calendly Integration
                  </p>
                  <p className="text-sm text-gray-600">
                    Automated interview scheduling
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    3 Touch Point Hire System
                  </p>
                  <p className="text-sm text-gray-600">
                    Job-board posting, screening, shortlisting, follow-up
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    Document Management
                  </p>
                  <p className="text-sm text-gray-600">
                    Secure employee document storage
                  </p>
                </div>
                <div className="text-center">
                  <VideoIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    VR Simulation Interviews
                  </p>
                  <p className="text-sm text-gray-600">
                    Real-world skill assessment
                  </p>
                </div>
                <div className="text-center">
                  <PoundSterling className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Cost Savings</p>
                  <p className="text-sm text-gray-600">
                    Track recruitment ROI and savings
                  </p>
                </div>
                <div className="text-center">
                  <Send className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    AI Recruitment Outreach
                  </p>
                  <p className="text-sm text-gray-600">
                    Automated candidate engagement
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Market Intelligence</p>
                  <p className="text-sm text-gray-600">
                    Real-time salary and market data
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-slate-600 to-teal-500 hover:from-slate-600 hover:to-teal-600 text-white px-8 py-4 rounded-lg transition-all text-lg font-medium shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </Link>

            <footer className="mt-16 pt-8 border-t border-white border-opacity-20 text-center text-sm text-gray-600">
              <a href={contactConfig.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 mx-2">Privacy Policy</a>
              <span className="mx-2">|</span>
              <a href={contactConfig.termsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 mx-2">Terms of Service</a>
            </footer>
          </div>
        )}
      </main>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  logAudit({ userId: user.id, action: "logout" });
                  await supabase.auth.signOut();
                }
                sessionStorage.removeItem("uphire_demo");
                setIsLoggedIn(false);
                setUser({ name: "", email: "", role: "", initials: "" });
                setShowLogoutConfirm(false);
              }}
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UPhirePlatformComponent;
