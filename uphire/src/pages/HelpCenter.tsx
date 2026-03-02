import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  BarChart3,
  Building,
  Users,
  TrendingUp,
  Zap,
  PoundSterling,
  HelpCircle,
  MessageCircle,
  Play,
  FileCheck,
  ChevronDown,
} from "lucide-react";

const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: FileCheck,
    description: "Learn the basics of UPhire and get up and running quickly.",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    description: "Understand your dashboard metrics and customize your view.",
  },
  {
    id: "roles-jobs",
    title: "Roles & Jobs",
    icon: Building,
    description: "Create, manage, and optimize your job postings.",
  },
  {
    id: "candidates",
    title: "Candidates",
    icon: Users,
    description: "Manage candidates, use AI matching and track applications.",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: TrendingUp,
    description: "Track key metrics, generate reports, and analyze hiring performance.",
  },
  {
    id: "features",
    title: "Features",
    icon: Zap,
    description: "Explore advanced features like CV interviews, imports, and more.",
  },
  {
    id: "account-billing",
    title: "Account & Billing",
    icon: PoundSterling,
    description: "Manage your account, subscription, and billing settings.",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: HelpCircle,
    description: "Solve common issues, and get technical support.",
  },
  {
    id: "contact-support",
    title: "Contact Support",
    icon: MessageCircle,
    description: "Get help from our support team.",
  },
  {
    id: "video-tutorials",
    title: "Video Tutorials",
    icon: Play,
    description: "Watch step-by-step guides.",
  },
  {
    id: "documentation",
    title: "Documentation",
    icon: FileText,
    description: "Detailed guides and references.",
  },
];

const faqs = [
  {
    q: "How do I create my first job posting?",
    a: "Navigate to the 'Roles' tab and click 'Create New Role'. Fill in the job details including title, department, location, and description. You can use our AI powered job description generator to help create compelling descriptions. Once saved, your job posting will be active and visible to candidates.",
  },
  {
    q: "How do I sign up for an account?",
    a: "Click the 'Sign Up' button on the homepage and enter your email address and password. You'll receive a verification email - click the link to verify your account. Once verified, you can log in and start using UPhire.",
  },
  {
    q: "What information do I need to get started?",
    a: "To get started, you'll need your company name, email address, and basic company information. You can add more details later in your profile settings. No credit card is required for the free tier.",
  },
  {
    q: "How do I add team members to my account?",
    a: "Go to 'My Business' -> 'Team Members' and click 'Add Member'. Enter their email address and assign a role (Admin, HR Manager, or Recruiter). They'll receive an invitation email to join your team.",
  },
  {
    q: "How does the AI candidate matching work?",
    a: "Our AI analyzes candidate profiles against your job requirements, considering skills, experience, education, and other factors. It provides a match score (0-100%) and ranking to help you identify the best candidates quickly. The AI learns from your hiring patterns to improve recommendations over time.",
  },
  {
    q: "How do I schedule interviews with candidates?",
    a: "After shortlisting candidates, you can schedule interviews directly from the candidate profile. Click 'Schedule Interview' and choose to integrate with Calendly for seamless scheduling, or add interview details manually. Candidates will receive an email invitation with all the details.",
  },
  {
    q: "What is the Market Intelligence feature?",
    a: "Market Intelligence provides real-time salary data, market demand analysis, and competitive insights for job roles. It helps you set competitive salaries, understand market trends, and optimize your hiring strategy. Data is updated daily from multiple sources.",
  },
  {
    q: "Can I export candidate data?",
    a: "Yes! You can export candidate lists, job postings, and analytics reports. Go to the relevant section (Candidates, Roles, or Analytics) and click the 'Export' button. Data is exported as CSV files that can be opened in Excel or Google Sheets.",
  },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800 mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
          <p className="text-gray-600 mt-2">
            Search our knowledge base or browse by category
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help articles, FAQs..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to="/"
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-slate-300 hover:shadow-md transition-all"
              >
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
              </Link>
            );
          })}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </summary>
                <div className="px-4 pb-4 pt-0 text-gray-600 text-sm border-t border-gray-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
