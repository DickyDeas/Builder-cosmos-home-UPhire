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

// EmployeeModal component for detailed employee information
const EmployeeModal = ({
  showEmployeeModal,
  setShowEmployeeModal,
  selectedEmployee,
  setSelectedEmployee,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

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
    (probationEndDate - today) / (1000 * 60 * 60 * 24),
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDocumentStatusBadge = (status) => {
    const statusColors = {
      Signed: "bg-green-100 text-green-800",
      Complete: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Valid: "bg-green-100 text-green-800",
      Active: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const handleSave = () => {
    // In a real app, this would update the employee data
    setIsEditing(false);
    alert("Employee information updated successfully!");
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
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
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
                          {formatDate(probationEndDate)}
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
                              doc.type === "Medical Certificate" &&
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
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Probation Completed
                    </h4>
                    <p className="text-gray-600">
                      This employee successfully completed their probation
                      period on {formatDate(probationEndDate)}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Review History
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Initial Review
                      </p>
                      <p className="text-sm text-gray-600">30-day checkpoint</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Mid-term Review
                      </p>
                      <p className="text-sm text-gray-600">
                        3-month checkpoint
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                      Scheduled
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Add Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {selectedEmployee.documents.map((document, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {document.type}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {document.date
                              ? `Uploaded on ${formatDate(document.date)}`
                              : "Pending upload"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getDocumentStatusBadge(document.status)}`}
                        >
                          {document.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Download size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Upload New Document
                </h4>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Choose File
                </button>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-900">
                      Overall Rating
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">4.2/5</p>
                  <p className="text-sm text-gray-600">Based on last review</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Goals Met</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">85%</p>
                  <p className="text-sm text-gray-600">This quarter</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Growth</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">+12%</p>
                  <p className="text-sm text-gray-600">Year over year</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        Quarterly Review Q3 2024
                      </h4>
                      <span className="text-sm text-gray-500">
                        Oct 15, 2024
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Excellent performance in project delivery and team
                      collaboration. Shows strong technical skills and
                      leadership potential.
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-green-600 font-medium">
                        Rating: 4.5/5
                      </span>
                      <span className="text-sm text-gray-500">
                        by {selectedEmployee.manager}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Development Plan
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Leadership Training
                      </p>
                      <p className="text-sm text-gray-600">
                        Complete by December 2024
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Advanced Technical Certification
                      </p>
                      <p className="text-sm text-gray-600">
                        AWS Solutions Architect
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        defaultValue={selectedEmployee.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedEmployee.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        defaultValue={selectedEmployee.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedEmployee.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        defaultValue={selectedEmployee.department}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Analytics">Analytics</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {selectedEmployee.department}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={selectedEmployee.position}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {selectedEmployee.position}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={selectedEmployee.manager}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {selectedEmployee.manager}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={selectedEmployee.salary}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedEmployee.salary}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Last updated: {formatDate(new Date().toISOString())}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Research & Intelligence Section */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <span>Market Intelligence</span>
            </h3>
            <p className="text-sm text-gray-600">
              Real-time market data and salary insights
            </p>
          </div>
          <button
            onClick={() => setIsSearching(!isSearching)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Search size={16} />
            <span>Research Market</span>
          </button>
        </div>

        {/* Quick Market Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Quick Market Search
            </h4>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Job title (e.g. Software Engineer)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <Search size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Popular searches:</span>
                {[
                  "Software Engineer",
                  "Product Manager",
                  "Data Scientist",
                  "UX Designer",
                  "DevOps Engineer",
                ].map((role) => (
                  <button
                    key={role}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Market Insights</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Software Engineer
                  </p>
                  <p className="text-xs text-gray-600">London • High Demand</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    £45k - £85k
                  </p>
                  <p className="text-xs text-gray-500">30 days avg fill</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Product Manager
                  </p>
                  <p className="text-xs text-gray-600">
                    London • Medium Demand
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-600">
                    £55k - £95k
                  </p>
                  <p className="text-xs text-gray-500">45 days avg fill</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Data Scientist
                  </p>
                  <p className="text-xs text-gray-600">
                    London • Very High Demand
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-600">
                    £60k - £110k
                  </p>
                  <p className="text-xs text-gray-500">25 days avg fill</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Market Trends & Analytics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Salary Growth
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600">+8.5%</p>
              <p className="text-xs text-gray-600">Tech sector YoY</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Job Openings
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">127k</p>
              <p className="text-xs text-gray-600">UK tech market</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">
                  Time to Fill
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600">34 days</p>
              <p className="text-xs text-gray-600">Average</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">
                  Competition
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">Medium</p>
              <p className="text-xs text-gray-600">Current level</p>
            </div>
          </div>
        </div>

        {/* Skills Intelligence */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Skills Intelligence
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Most In-Demand Skills
              </h5>
              <div className="space-y-2">
                {[
                  { skill: "React/JavaScript", demand: 95, growth: "+12%" },
                  { skill: "Python", demand: 89, growth: "+18%" },
                  { skill: "AWS/Cloud", demand: 87, growth: "+24%" },
                  { skill: "Node.js", demand: 82, growth: "+15%" },
                  { skill: "TypeScript", demand: 78, growth: "+31%" },
                ].map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {item.skill}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.demand}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      {item.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Emerging Skills
              </h5>
              <div className="space-y-2">
                {[
                  { skill: "AI/Machine Learning", trend: "🔥", growth: "+67%" },
                  { skill: "Blockchain", trend: "📈", growth: "+45%" },
                  { skill: "Cybersecurity", trend: "🛡️", growth: "+38%" },
                  { skill: "DevOps/Kubernetes", trend: "⚡", growth: "+42%" },
                  { skill: "Data Engineering", trend: "📊", growth: "+29%" },
                ].map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.trend}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.skill}
                      </span>
                    </div>
                    <span className="text-xs text-purple-600 font-medium">
                      {item.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Data Source */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Database className="w-4 h-4" />
              <span>Data powered by ITJobsWatch, LinkedIn, Indeed</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View Full Market Report →
            </button>
          </div>
        </div>
      </div>

      {/* Market Insights Search Section - ITJobsWatch Integration */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Market Insights
            </h3>
            <p className="text-sm text-gray-600">
              Get real-time salary and market data for any role
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Product Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={marketSearchForm.jobTitle || ""}
                  onChange={(e) =>
                    setMarketSearchForm({
                      ...marketSearchForm,
                      jobTitle: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. London, Manchester, Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={marketSearchForm.location || ""}
                  onChange={(e) =>
                    setMarketSearchForm({
                      ...marketSearchForm,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={searchMarketData}
                  disabled={isSearching || !marketSearchForm.jobTitle}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Get Market Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Search Buttons */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Quick searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Software Engineer",
                  "Product Manager",
                  "Data Scientist",
                  "UX Designer",
                  "DevOps Engineer",
                  "Full Stack Developer",
                  "Business Analyst",
                  "Project Manager",
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setMarketSearchForm({
                        ...marketSearchForm,
                        jobTitle: role,
                      });
                      setTimeout(() => searchMarketData(), 100);
                    }}
                    className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Market Data Results */}
          {lastSearchResults && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {lastSearchResults.jobTitle}
                    {lastSearchResults.location &&
                      ` in ${lastSearchResults.location}`}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">Powered by</span>
                    <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">
                      ITJobsWatch
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Last updated</div>
                  <div className="text-sm font-medium text-gray-900">
                    {lastSearchResults.lastUpdated}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">
                        £
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Average Salary
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {lastSearchResults.salary.average}
                  </div>
                  <div className="text-xs text-gray-500">
                    Range: {lastSearchResults.salary.min} -{" "}
                    {lastSearchResults.salary.max}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Market Demand
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      lastSearchResults.demand.level === "High"
                        ? "text-green-600"
                        : lastSearchResults.demand.level === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {lastSearchResults.demand.level}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lastSearchResults.demand.trend} trend
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Time to Fill
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {lastSearchResults.timeToFill} days
                  </div>
                  <div className="text-xs text-gray-500">Industry average</div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Competition
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      lastSearchResults.competition === "High"
                        ? "text-red-600"
                        : lastSearchResults.competition === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {lastSearchResults.competition}
                  </div>
                  <div className="text-xs text-gray-500">For this role</div>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Top Required Skills
                  </h5>
                  <div className="space-y-2">
                    {lastSearchResults.skills.required.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700">
                          {skill.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${skill.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">
                            {skill.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Trending Skills
                  </h5>
                  <div className="space-y-2">
                    {lastSearchResults.skills.trending.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700">
                          {skill.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600 font-medium">
                            +{skill.growth}%
                          </span>
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-200">
                <div className="text-sm text-gray-600">
                  Data refreshed every 24 hours • Source: ITJobsWatch API
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Export Data
                  </button>
                  <button
                    onClick={() => {
                      setRoleFormData({
                        ...roleFormData,
                        title: lastSearchResults.jobTitle,
                        location: lastSearchResults.location || "",
                        salary: lastSearchResults.salary.average,
                        skills: lastSearchResults.skills.required
                          .slice(0, 5)
                          .map((s) => s.name)
                          .join(", "),
                      });
                      setActiveTab("roles");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Create Role from Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ITJobsWatch Integration Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    ITJobsWatch API Integration
                  </h4>
                  <p className="text-sm text-gray-600">
                    Real-time UK job market data and salary insights
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">
                  Connected
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Live salary data</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Market demand analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Skills intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const scheduleSpecificInterview = (candidate, interviewType) => {
    const interviewTypeNames = {
      initial: "Initial Screening",
      technical: "Technical Interview",
      cultural: "Cultural Fit Interview",
      final: "Final Interview",
    };

    const selectedUrl = calendlyUrls[interviewType] || calendlyUrl;
    const interviewTypeName = interviewTypeNames[interviewType] || "Interview";

    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: `${selectedUrl}?prefill_name=${encodeURIComponent(candidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(candidate.skills.join(", "))}&prefill_custom_3=${encodeURIComponent(interviewTypeName)}`,
        text: `Schedule ${interviewTypeName}`,
        color: "#2563eb",
        textColor: "#ffffff",
        branding: true,
      });
    } else {
      const calendlyFullUrl = `${selectedUrl}?prefill_name=${encodeURIComponent(candidate.name)}&prefill_custom_1=${encodeURIComponent(role?.title || "")}&prefill_custom_2=${encodeURIComponent(candidate.skills.join(", "))}&prefill_custom_3=${encodeURIComponent(interviewTypeName)}`;
      window.open(calendlyFullUrl, "_blank");
    }
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
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Top 5 Candidates Selected for Interviews
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <Calendar className="text-blue-600 mt-0.5" size={16} />
                      <div className="text-sm">
                        <div className="font-medium text-blue-900 mb-1">
                          Calendly Integration Active
                        </div>
                        <div className="text-blue-700">
                          Click "Schedule Interview" to open Calendly and book
                          interviews directly. Choose from different interview
                          types or use the quick schedule option.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
    companyName: "TechVision Solutions",
    industry: "Technology & Software Development",
    description:
      "TechVision Solutions is a leading technology company specializing in innovative software solutions, AI-powered platforms, and digital transformation services. We help businesses modernize their operations through cutting-edge technology and exceptional user experiences. Our team of talented developers, designers, and strategists work collaboratively to deliver world-class products that drive growth and efficiency for our clients across various industries.",
    location: "London, UK (Hybrid/Remote Options Available)",
    size: "51-200 employees",
    foundedYear: "2019",
    website: "https://techvisionsolutions.co.uk",
    culture:
      "We foster a collaborative, innovative, and inclusive work environment where creativity thrives. Our culture emphasizes work-life balance, continuous learning, and professional growth. We believe in empowering our team members to take ownership of their projects while providing the support and resources they need to succeed. We celebrate diversity, encourage open communication, and maintain a flat organizational structure that promotes agility and quick decision-making.",
    benefits:
      "• Competitive salary with annual reviews and performance bonuses\n• Comprehensive health insurance (medical, dental, vision)\n• 25 days annual leave plus bank holidays\n• Flexible working hours and hybrid/remote work options\n• £2,000 annual learning and development budget\n• Top-spec equipment and home office setup allowance\n• Monthly team events and quarterly company retreats\n• Pension scheme with company contribution\n• Cycle to work scheme and wellness programs\n• Stock options and profit-sharing opportunities\n• Sabbatical leave after 5 years of service\n• Free snacks, coffee, and catered lunches in office",
    mission:
      "To empower businesses through innovative technology solutions that simplify complex challenges, enhance productivity, and drive sustainable growth. We are committed to creating software that not only meets today's needs but anticipates tomorrow's opportunities, while maintaining the highest standards of quality, security, and user experience.",
    values:
      "Innovation: We constantly push boundaries and embrace new technologies to solve complex problems.\n\nIntegrity: We build trust through transparency, honesty, and ethical business practices.\n\nCollaboration: We believe the best solutions come from diverse teams working together.\n\nExcellence: We strive for the highest quality in everything we deliver.\n\nCustomer-Centric: Our clients' success is our success - we put their needs at the heart of everything we do.\n\nGrowth Mindset: We embrace challenges as opportunities to learn and improve continuously.",
    sectors:
      "Financial Services, Healthcare, E-commerce, Education Technology, Government",
    technologies:
      "React, Node.js, Python, AWS, Docker, Kubernetes, TypeScript, GraphQL, MongoDB, PostgreSQL",
    clientBase:
      "We serve a diverse range of clients from innovative startups to Fortune 500 companies, helping them navigate digital transformation and achieve their technology goals.",
    achievements:
      "• Winner of 'Best Tech Startup 2023' - London Tech Awards\n• Certified AWS Partner with 50+ successful cloud migrations\n• 98% client satisfaction rate with 85% repeat business\n• Featured in TechCrunch Top 100 UK Startups to Watch",
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
  const [marketSearchForm, setMarketSearchForm] = useState({
    jobTitle: "",
    location: "",
  });
  const [lastSearchResults, setLastSearchResults] = useState(null);

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

  // Market Insights Search with ITJobsWatch API Integration
  const searchMarketData = async () => {
    if (!marketSearchForm.jobTitle) {
      alert("Please enter a job title to search");
      return;
    }

    setIsSearching(true);

    try {
      // Simulate ITJobsWatch API call with realistic data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockMarketData = {
        jobTitle: marketSearchForm.jobTitle,
        location: marketSearchForm.location || "UK",
        lastUpdated: new Date().toLocaleDateString("en-GB"),
        salary: {
          average: generateRealisticSalary(marketSearchForm.jobTitle),
          min: generateRealisticSalary(marketSearchForm.jobTitle, 0.7),
          max: generateRealisticSalary(marketSearchForm.jobTitle, 1.4),
        },
        demand: {
          level: getMarketDemand(marketSearchForm.jobTitle),
          trend: getMarketTrend(marketSearchForm.jobTitle),
        },
        timeToFill: getTimeToFill(marketSearchForm.jobTitle),
        competition: getCompetitionLevel(marketSearchForm.jobTitle),
        skills: {
          required: getRequiredSkills(marketSearchForm.jobTitle),
          trending: getTrendingSkills(marketSearchForm.jobTitle),
        },
      };

      setLastSearchResults(mockMarketData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      alert("Error fetching market data. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Helper functions for realistic market data generation
  const generateRealisticSalary = (jobTitle, multiplier = 1) => {
    const baseSalaries = {
      "software engineer": 65000,
      "product manager": 70000,
      "data scientist": 75000,
      "ux designer": 55000,
      "devops engineer": 70000,
      "full stack developer": 60000,
      "business analyst": 50000,
      "project manager": 55000,
    };

    const titleLower = jobTitle.toLowerCase();
    let baseSalary = 50000; // default

    for (const [key, value] of Object.entries(baseSalaries)) {
      if (titleLower.includes(key)) {
        baseSalary = value;
        break;
      }
    }

    const salary = Math.round(baseSalary * multiplier);
    return `£${salary.toLocaleString()}`;
  };

  const getMarketDemand = (jobTitle) => {
    const highDemandRoles = [
      "software engineer",
      "data scientist",
      "devops",
      "cloud",
      "cybersecurity",
    ];
    const mediumDemandRoles = [
      "product manager",
      "ux designer",
      "business analyst",
    ];

    const titleLower = jobTitle.toLowerCase();
    if (highDemandRoles.some((role) => titleLower.includes(role)))
      return "High";
    if (mediumDemandRoles.some((role) => titleLower.includes(role)))
      return "Medium";
    return "Low";
  };

  const getMarketTrend = (jobTitle) => {
    const growingRoles = [
      "ai",
      "machine learning",
      "data",
      "cloud",
      "security",
    ];
    const titleLower = jobTitle.toLowerCase();
    if (growingRoles.some((role) => titleLower.includes(role)))
      return "Growing";
    return "Stable";
  };

  const getTimeToFill = (jobTitle) => {
    const fastFillRoles = ["junior", "entry", "intern"];
    const slowFillRoles = ["senior", "lead", "principal", "director"];

    const titleLower = jobTitle.toLowerCase();
    if (fastFillRoles.some((role) => titleLower.includes(role))) return 25;
    if (slowFillRoles.some((role) => titleLower.includes(role))) return 45;
    return 35;
  };

  const getCompetitionLevel = (jobTitle) => {
    const highCompetitionRoles = ["senior", "lead", "principal", "manager"];
    const titleLower = jobTitle.toLowerCase();
    if (highCompetitionRoles.some((role) => titleLower.includes(role)))
      return "High";
    return "Medium";
  };

  const getRequiredSkills = (jobTitle) => {
    const skillMaps = {
      "software engineer": [
        { name: "JavaScript", percentage: 85 },
        { name: "React", percentage: 75 },
        { name: "Node.js", percentage: 65 },
        { name: "Python", percentage: 55 },
        { name: "Git", percentage: 90 },
      ],
      "data scientist": [
        { name: "Python", percentage: 95 },
        { name: "SQL", percentage: 85 },
        { name: "Machine Learning", percentage: 80 },
        { name: "R", percentage: 60 },
        { name: "Statistics", percentage: 75 },
      ],
      "product manager": [
        { name: "Product Strategy", percentage: 90 },
        { name: "Analytics", percentage: 75 },
        { name: "Agile", percentage: 80 },
        { name: "User Research", percentage: 65 },
        { name: "Roadmapping", percentage: 85 },
      ],
    };

    const titleLower = jobTitle.toLowerCase();
    for (const [key, skills] of Object.entries(skillMaps)) {
      if (titleLower.includes(key)) return skills;
    }

    // Default skills
    return [
      { name: "Communication", percentage: 85 },
      { name: "Problem Solving", percentage: 80 },
      { name: "Team Work", percentage: 75 },
      { name: "Time Management", percentage: 70 },
      { name: "Critical Thinking", percentage: 75 },
    ];
  };

  const getTrendingSkills = (jobTitle) => {
    const trendingMaps = {
      "software engineer": [
        { name: "TypeScript", growth: 42 },
        { name: "GraphQL", growth: 35 },
        { name: "Docker", growth: 28 },
        { name: "Kubernetes", growth: 45 },
        { name: "AWS", growth: 38 },
      ],
      "data scientist": [
        { name: "MLOps", growth: 67 },
        { name: "TensorFlow", growth: 45 },
        { name: "PyTorch", growth: 52 },
        { name: "Kubernetes", growth: 38 },
        { name: "Apache Spark", growth: 25 },
      ],
    };

    const titleLower = jobTitle.toLowerCase();
    for (const [key, skills] of Object.entries(trendingMaps)) {
      if (titleLower.includes(key)) return skills;
    }

    // Default trending skills
    return [
      { name: "AI/ML", growth: 67 },
      { name: "Cloud Computing", growth: 45 },
      { name: "DevOps", growth: 38 },
      { name: "Cybersecurity", growth: 42 },
      { name: "Data Analytics", growth: 35 },
    ];
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
        employeeId: "EMP001",
        name: "John Smith",
        position: "Senior Developer",
        department: "Engineering",
        startDate: "2024-01-15",
        status: "active",
        probationPeriod: false,
        probationMonths: 6,
        employmentType: "Full-time",
        avatar: "👨‍💼",
        email: "john.smith@company.com",
        phone: "+44 7123 456789",
        pendingReview: false,
        documents: [
          { type: "Contract", status: "Signed", date: "2024-01-15" },
          {
            type: "Medical Certificate",
            status: "Complete",
            date: "2024-01-20",
          },
          {
            type: "Training Record",
            status: "In Progress",
            date: "2024-02-01",
          },
        ],
        salary: "£65,000",
        manager: "Sarah Johnson",
      },
      {
        id: 2,
        employeeId: "EMP002",
        name: "Lisa Wang",
        position: "Product Designer",
        department: "Design",
        startDate: "2024-03-01",
        status: "active",
        probationPeriod: true,
        probationMonths: 6,
        employmentType: "Full-time",
        avatar: "👩‍🎨",
        email: "lisa.wang@company.com",
        phone: "+44 7234 567890",
        pendingReview: true,
        documents: [
          { type: "Contract", status: "Signed", date: "2024-03-01" },
          { type: "Medical Certificate", status: "Pending", date: null },
          { type: "Background Check", status: "Complete", date: "2024-02-28" },
        ],
        salary: "£55,000",
        manager: "Mike Thompson",
      },
      {
        id: 3,
        employeeId: "EMP003",
        name: "Alex Rodriguez",
        position: "Marketing Specialist",
        department: "Marketing",
        startDate: "2023-11-15",
        status: "active",
        probationPeriod: false,
        probationMonths: 3,
        employmentType: "Full-time",
        avatar: "👨‍💻",
        email: "alex.rodriguez@company.com",
        phone: "+44 7345 678901",
        pendingReview: false,
        documents: [
          { type: "Contract", status: "Signed", date: "2023-11-15" },
          {
            type: "Performance Review",
            status: "Complete",
            date: "2024-02-15",
          },
          {
            type: "Training Certificate",
            status: "Complete",
            date: "2024-01-10",
          },
        ],
        salary: "£48,000",
        manager: "Emma Davis",
      },
      {
        id: 4,
        employeeId: "EMP004",
        name: "Sarah Johnson",
        position: "Engineering Manager",
        department: "Engineering",
        startDate: "2023-06-01",
        status: "active",
        probationPeriod: false,
        probationMonths: 6,
        employmentType: "Full-time",
        avatar: "👩‍💼",
        email: "sarah.johnson@company.com",
        phone: "+44 7456 789012",
        pendingReview: false,
        documents: [
          { type: "Contract", status: "Signed", date: "2023-06-01" },
          {
            type: "Leadership Training",
            status: "Complete",
            date: "2023-09-15",
          },
          { type: "Annual Review", status: "Complete", date: "2024-06-01" },
          {
            type: "Confidentiality Agreement",
            status: "Signed",
            date: "2023-06-01",
          },
        ],
        salary: "£85,000",
        manager: "CEO",
      },
      {
        id: 5,
        employeeId: "EMP005",
        name: "Michael Chen",
        position: "Junior Developer",
        department: "Engineering",
        startDate: "2024-09-01",
        status: "active",
        probationPeriod: true,
        probationMonths: 6,
        employmentType: "Full-time",
        avatar: "👨‍💻",
        email: "michael.chen@company.com",
        phone: "+44 7567 890123",
        pendingReview: false,
        documents: [
          { type: "Contract", status: "Signed", date: "2024-09-01" },
          {
            type: "Medical Certificate",
            status: "Complete",
            date: "2024-09-05",
          },
          { type: "IT Security Training", status: "In Progress", date: null },
        ],
        salary: "£42,000",
        manager: "John Smith",
      },
      {
        id: 6,
        employeeId: "EMP006",
        name: "Emma Thompson",
        position: "HR Specialist",
        department: "Human Resources",
        startDate: "2024-02-15",
        status: "active",
        probationPeriod: true,
        probationMonths: 6,
        employmentType: "Part-time",
        avatar: "👩‍💼",
        email: "emma.thompson@company.com",
        phone: "+44 7678 901234",
        pendingReview: true,
        documents: [
          { type: "Contract", status: "Signed", date: "2024-02-15" },
          { type: "DBS Check", status: "Complete", date: "2024-02-10" },
          { type: "HR Certification", status: "Valid", date: "2023-12-01" },
        ],
        salary: "£32,000",
        manager: "Director of HR",
      },
      {
        id: 7,
        employeeId: "EMP007",
        name: "David Kim",
        position: "Data Analyst",
        department: "Analytics",
        startDate: "2023-08-20",
        status: "active",
        probationPeriod: false,
        probationMonths: 6,
        employmentType: "Full-time",
        avatar: "👨‍🔬",
        email: "david.kim@company.com",
        phone: "+44 7789 012345",
        pendingReview: false,
        documents: [
          { type: "Contract", status: "Signed", date: "2023-08-20" },
          {
            type: "Data Protection Training",
            status: "Complete",
            date: "2023-09-01",
          },
          {
            type: "Performance Review",
            status: "Complete",
            date: "2024-02-20",
          },
          {
            type: "Professional Development Plan",
            status: "Active",
            date: "2024-01-15",
          },
        ],
        salary: "£52,000",
        manager: "Analytics Director",
      },
      {
        id: 8,
        employeeId: "EMP008",
        name: "Rachel Green",
        position: "Sales Executive",
        department: "Sales",
        startDate: "2024-10-01",
        status: "active",
        probationPeriod: true,
        probationMonths: 3,
        employmentType: "Full-time",
        avatar: "👩‍💼",
        email: "rachel.green@company.com",
        phone: "+44 7890 123456",
        pendingReview: false,
        documents: [
          { type: "Contract", status: "Signed", date: "2024-10-01" },
          { type: "Sales Training", status: "In Progress", date: null },
          { type: "Medical Certificate", status: "Pending", date: null },
        ],
        salary: "£45,000",
        manager: "Sales Manager",
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
          <h1 className="text-3xl font-bold text-white">Employee Management</h1>
          <p className="text-blue-100">
            Comprehensive team management and HR records
          </p>
        </div>
        <button
          onClick={() => setShowEmployeeModal(true)}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 border border-white border-opacity-30 transition-all"
        >
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Employee Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">
                {employees.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Probation</p>
              <p className="text-3xl font-bold text-yellow-600">
                {employees.filter((emp) => emp.probationPeriod).length}
              </p>
            </div>
            <Timer className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Full-Time</p>
              <p className="text-3xl font-bold text-green-600">
                {
                  employees.filter((emp) => emp.employmentType === "Full-time")
                    .length
                }
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-red-600">
                {employees.filter((emp) => emp.pendingReview).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Employee Directory */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Directory
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>

        <div className="space-y-4">
          {employees.map((employee) => {
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
              (probationEndDate - today) / (1000 * 60 * 60 * 24),
            );

            return (
              <div
                key={employee.id}
                onClick={() => {
                  setSelectedEmployee(employee);
                  setShowEmployeeModal(true);
                }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {employee.avatar || employee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {employee.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        #{employee.employeeId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {employee.position} • {employee.department}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-gray-500">
                        Started: {employee.startDate} • {tenure} months tenure
                      </p>
                      {employee.probationPeriod && (
                        <span className="text-xs text-yellow-600">
                          Probation:{" "}
                          {probationDaysLeft > 0
                            ? `${probationDaysLeft} days left`
                            : "Ended"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
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
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          employee.employmentType === "Full-time"
                            ? "bg-blue-100 text-blue-800"
                            : employee.employmentType === "Part-time"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {employee.employmentType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        Documents: {employee.documents?.length || 0}
                      </span>
                      {employee.pendingReview && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(employee);
                        setShowDocumentUploadModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Manage Documents"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle performance review
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Performance Review"
                    >
                      <Award size={16} />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Probation Periods
          </h3>
          <div className="space-y-3">
            {employees
              .filter((emp) => emp.probationPeriod)
              .map((employee) => {
                const startDate = new Date(employee.startDate);
                const probationEndDate = new Date(startDate);
                probationEndDate.setMonth(
                  probationEndDate.getMonth() + (employee.probationMonths || 6),
                );
                const today = new Date();
                const daysLeft = Math.ceil(
                  (probationEndDate - today) / (1000 * 60 * 60 * 24),
                );

                return (
                  <div
                    key={employee.id}
                    className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {employee.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          daysLeft <= 7
                            ? "text-red-600"
                            : daysLeft <= 30
                              ? "text-yellow-600"
                              : "text-gray-600",
                        )}
                      >
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : "Review overdue"}
                      </p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Schedule Review
                      </button>
                    </div>
                  </div>
                );
              })}
            {employees.filter((emp) => emp.probationPeriod).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No employees currently on probation
              </p>
            )}
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Sarah Johnson completed probation
                </p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New contract uploaded for Mike Chen
                </p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Performance review due for Alex Kim
                </p>
                <p className="text-xs text-gray-500">In 3 days</p>
              </div>
            </div>
          </div>
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

      {showEmployeeModal && (
        <EmployeeModal
          showEmployeeModal={showEmployeeModal}
          setShowEmployeeModal={setShowEmployeeModal}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}

      {showDocumentUploadModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Document Management
                  </h2>
                  <p className="text-gray-600">
                    {selectedEmployee.name} - {selectedEmployee.position}
                  </p>
                </div>
                <button
                  onClick={() => setShowDocumentUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Documents
                </h3>
                {selectedEmployee.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.type}</p>
                        <p className="text-sm text-gray-600">
                          Status: {doc.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Upload New Document
                </h4>
                <p className="text-gray-600 mb-4">
                  Select document type and upload file
                </p>
                <div className="space-y-4">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select document type</option>
                    <option value="contract">Employment Contract</option>
                    <option value="medical">Medical Certificate</option>
                    <option value="training">Training Certificate</option>
                    <option value="performance">Performance Review</option>
                    <option value="disciplinary">Disciplinary Record</option>
                    <option value="legal">Legal Document</option>
                    <option value="other">Other</option>
                  </select>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Choose File & Upload
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDocumentUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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

export default UPhirePlatform;
