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
}

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
    skills: ["React", "TypeScript", "Node.js"],
    aiMatch: 92,
    status: "Interview Scheduled",
    source: "LinkedIn",
    applied: "2024-01-20",
    avatar: "AJ",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Product Manager",
    email: "bob.smith@email.com",
    location: "Manchester, UK",
    experience: "7+ years",
    skills: ["Product Strategy", "Agile", "Analytics"],
    aiMatch: 88,
    status: "Shortlisted",
    source: "Indeed",
    applied: "2024-01-18",
    avatar: "BS",
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
    documents: [
      {
        id: 1,
        name: "Contract",
        type: "Contract",
        category: "Employment",
        lastModified: "2023-06-15",
        autoSend: false,
        template: "Standard",
      },
      {
        id: 2,
        name: "ID Copy",
        type: "Identification",
        category: "Verification",
        lastModified: "2023-06-15",
        autoSend: false,
        template: "Standard",
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
    documents: [
      {
        id: 3,
        name: "Contract",
        type: "Contract",
        category: "Employment",
        lastModified: "2024-01-10",
        autoSend: false,
        template: "Standard",
      },
    ],
  },
];

// Business Profile Data
const businessProfile = {
  name: "TechVision Solutions",
  industry: "Technology & Software Development",
  location: "London, UK",
  size: "50-200 employees",
  founded: "2018",
  description:
    "Leading software development company specializing in enterprise solutions and AI-powered applications.",
  mission:
    "To deliver innovative technology solutions that transform businesses and drive digital excellence.",
  culture:
    "We foster a collaborative, inclusive environment where creativity thrives and every team member can grow their potential.",
  values: ["Innovation", "Excellence", "Collaboration", "Integrity", "Growth"],
  benefits: {
    health: "Comprehensive health insurance including dental and vision",
    retirement: "Competitive pension scheme with company matching",
    vacation: "25 days annual leave plus bank holidays",
    development: "£2,000 annual learning and development budget",
    flexibility: "Flexible working hours and hybrid work options",
    wellness: "Mental health support and wellness programs",
    technology: "Latest technology and equipment provided",
    social: "Regular team events and social activities",
  },
  techStack: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
  ],
  clients: [
    "Fortune 500 companies",
    "Government agencies",
    "Healthcare organizations",
    "Financial institutions",
  ],
};

// Component Definitions

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
            <p className="text-3xl font-bold text-gray-900">12</p>
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
            <p className="text-3xl font-bold text-gray-900">247</p>
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
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Quick Market Search
          </h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter job title..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Trending Skills</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "Python", "AWS", "Machine Learning"].map(
              (skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Roles Tab Component
const RolesTab = () => {
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitingRoleId, setRecruitingRoleId] = useState<number | null>(null);

  const startRecruitment = (roleId: number) => {
    setRecruitingRoleId(roleId);
    setShowRecruitModal(true);
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  role.status === "Active"
                    ? "bg-green-100 text-green-800"
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

            <div className="flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button
                onClick={() => startRecruitment(role.id)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Recruit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recruitment Modal */}
      {showRecruitModal && (
        <RecruitModal
          showRecruitModal={showRecruitModal}
          setShowRecruitModal={setShowRecruitModal}
          recruitingRoleId={recruitingRoleId}
        />
      )}
    </div>
  );
};

// Candidates Tab Component
const CandidatesTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Candidates</h1>
        <p className="text-blue-100">
          Manage your candidate pipeline and applications
        </p>
      </div>
      <div className="flex space-x-3">
        <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
          <Filter size={16} />
          <span>Filter</span>
        </button>
        <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
          <Search size={16} />
          <span>Search</span>
        </button>
      </div>
    </div>

    {/* Candidates Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {mockCandidates.map((candidate) => (
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
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                candidate.status === "Interview Scheduled"
                  ? "bg-purple-100 text-purple-800"
                  : candidate.status === "Shortlisted"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {candidate.status}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                AI Match
              </span>
              <span className="text-sm font-bold text-green-600">
                {candidate.aiMatch}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
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
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Profile
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Schedule Interview
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Employees Tab Component
const EmployeesTab = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Management</h1>
          <p className="text-blue-100">
            Comprehensive team management and HR records
          </p>
        </div>
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
                {mockEmployees.filter((emp) => emp.probationPeriod).length}
              </p>
            </div>
            <Timer className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Full-Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {
                  mockEmployees.filter(
                    (emp) => emp.employmentType === "Full-Time",
                  ).length
                }
              </p>
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
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Employee Directory */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Directory
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockEmployees.map((employee) => (
            <div
              key={employee.id}
              onClick={() => openEmployeeDetails(employee)}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">
                  {employee.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <p className="text-xs text-gray-500">{employee.department}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Modal */}
      {showEmployeeModal && selectedEmployee && (
        <EmployeeModal
          showEmployeeModal={showEmployeeModal}
          setShowEmployeeModal={setShowEmployeeModal}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
    </div>
  );
};

// My Business Tab Component
const MyBusinessTab = () => {
  const [isEditing, setIsEditing] = useState(false);

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
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 font-medium"
        >
          <Edit size={20} />
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Business Profile */}
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
                    value={businessProfile.name}
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
                    value={businessProfile.industry}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={businessProfile.location}
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
                    value={businessProfile.size}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {businessProfile.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
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
                value={businessProfile.description}
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
                value={businessProfile.mission}
                readOnly={!isEditing}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50"}`}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Core Values</h4>
              <div className="flex flex-wrap gap-2">
                {businessProfile.values.map((value, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(businessProfile.benefits).map(([key, value]) => (
            <div key={key} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
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
}: {
  showEmployeeModal: boolean;
  setShowEmployeeModal: (show: boolean) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!showEmployeeModal || !selectedEmployee) return null;

  const closeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
    setActiveTab("overview");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {selectedEmployee.name.charAt(0)}
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Employment Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedEmployee.startDate}
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
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <div className="space-y-2">
                {selectedEmployee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                    </div>
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Employee
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

  if (!showRecruitModal) return null;

  const stages = [
    {
      id: 1,
      name: "AI Search",
      description: "Search across multiple platforms",
    },
    { id: 2, name: "Outreach", description: "Send personalized messages" },
    { id: 3, name: "Interest Collection", description: "Track responses" },
    { id: 4, name: "Ranking", description: "AI ranking and selection" },
  ];

  const startRecruitment = () => {
    setIsSearching(true);
    // Simulate AI recruitment process
    setTimeout(() => {
      setCurrentStage(2);
      setTimeout(() => {
        setCurrentStage(3);
        setTimeout(() => {
          setCurrentStage(4);
          setIsSearching(false);
        }, 2000);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
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
                {stages[currentStage - 1]?.name}
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
                AI will search across LinkedIn, Indeed, GitHub, AngelList, and
                Stack Overflow to find the best candidates for this role.
              </p>
              <button
                onClick={startRecruitment}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Start AI Recruitment
              </button>
            </div>
          )}

          {isSearching && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">
                AI is processing recruitment pipeline...
              </p>
            </div>
          )}

          {currentStage === 4 && !isSearching && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Recruitment Complete!
              </h3>
              <p className="text-gray-600">
                AI has identified and ranked the top 5 candidates. Check your
                candidates tab to review the results.
              </p>
              <button
                onClick={() => setShowRecruitModal(false)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "business", label: "My Business", icon: Factory },
  ];

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
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">UPhire</h1>
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
                find, engage, and hire top talent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Search
                </h3>
                <p className="text-gray-600">
                  Leverage advanced AI to find the perfect candidates across
                  multiple platforms automatically.
                </p>
              </div>

              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Intelligence
                </h3>
                <p className="text-gray-600">
                  Get real-time market insights, salary data, and competitive
                  analysis to make informed decisions.
                </p>
              </div>

              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white border-opacity-20 p-6 text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Complete HR Suite
                </h3>
                <p className="text-gray-600">
                  Manage your entire recruitment process and employee lifecycle
                  from one powerful platform.
                </p>
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
