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

const faqs: { q: string; a: string; category: string }[] = [
  // Getting Started
  {
    q: "How do I sign up for an account?",
    a: "Click the 'Sign Up' button on the homepage and enter your email address and password. You'll receive a verification email - click the link to verify your account. Once verified, you can log in and start using UPhire.",
    category: "getting-started",
  },
  {
    q: "What information do I need to get started?",
    a: "To get started, you'll need your company name, email address, and basic company information. You can add more details later in your profile settings. No credit card is required for the free tier.",
    category: "getting-started",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. UPhire offers a free tier for new users. You can create your account, post jobs, and explore core features without a credit card. Upgrade to Growth or Enterprise when you need advanced features like AI recruitment, Market Intelligence, or integrations.",
    category: "getting-started",
  },
  {
    q: "How long does onboarding take?",
    a: "Most users complete onboarding in under 10 minutes. You'll set up your company profile, add your first job role, and optionally invite team members. Our onboarding wizard guides you through each step.",
    category: "getting-started",
  },
  {
    q: "Can I use a demo account to explore?",
    a: "Yes. When you sign up, you can optionally enable demo mode to explore pre-populated data. This helps you see how the platform works with sample roles, candidates, and analytics before adding your own data.",
    category: "getting-started",
  },
  {
    q: "What happens after I verify my email?",
    a: "After verification, you'll land on your dashboard. We recommend completing your company profile in My Business, then creating your first role. The welcome tour will highlight key features.",
    category: "getting-started",
  },
  {
    q: "How do I switch between accounts or companies?",
    a: "If you have access to multiple companies or accounts, use the account switcher in the user menu (top right). Sign out and sign in with different credentials if you're managing separate organisations.",
    category: "getting-started",
  },
  // Dashboard
  {
    q: "What do the dashboard metrics mean?",
    a: "Active Roles shows your open positions. Total Candidates includes all applicants and shortlisted candidates. Interviews This Week shows scheduled interviews. Time to Hire is the average days from posting to offer. Each metric updates in real time.",
    category: "dashboard",
  },
  {
    q: "Can I customize my dashboard view?",
    a: "Dashboard widgets and layout are configurable on Growth and Enterprise plans. You can rearrange metrics, add or remove sections, and set date ranges for your preferred view. Basic plans show the default view.",
    category: "dashboard",
  },
  {
    q: "What is Recent Activity?",
    a: "Recent Activity shows recent events such as new applications, completed interviews, AI recruitment runs, and role updates. It helps you stay on top of hiring without checking each section.",
    category: "dashboard",
  },
  {
    q: "How do I interpret the Performance Overview?",
    a: "Applications to Interview Rate shows what % of applicants reach interview. Interview to Offer Rate shows conversion from interview to offer. Offer Acceptance Rate shows how many offers are accepted. Use these to spot bottlenecks in your funnel.",
    category: "dashboard",
  },
  {
    q: "Where can I see quick actions on the dashboard?",
    a: "Quick actions appear in the dashboard header and sidebar. You can create a role, add a candidate, run AI recruitment, or view analytics with one click. Customize shortcuts in Settings.",
    category: "dashboard",
  },
  {
    q: "How often does dashboard data refresh?",
    a: "Dashboard data refreshes automatically every few minutes. You can also manually refresh. Real-time updates apply to notifications and new applications.",
    category: "dashboard",
  },
  // Roles & Jobs
  {
    q: "How do I create my first job posting?",
    a: "Navigate to the 'Roles' tab and click 'Create New Role'. Fill in the job details including title, department, location, and description. You can use our AI powered job description generator to help create compelling descriptions. Once saved, your job posting will be active and visible to candidates.",
    category: "roles-jobs",
  },
  {
    q: "How do I edit or update a job posting?",
    a: "Go to Roles, find the job, and click Edit. Update any fields and save. Changes take effect immediately. If the role is already published elsewhere, we may need to sync the update—check job board status.",
    category: "roles-jobs",
  },
  {
    q: "How do I close a position?",
    a: "Open the role and click 'Close Position' or change status to Closed. Confirm your choice. Closed roles remain visible for reporting but no longer accept applications or appear on job boards.",
    category: "roles-jobs",
  },
  {
    q: "Can I duplicate an existing role?",
    a: "Yes. Open the role and click 'Duplicate'. A copy is created with the same details but a new ID. Edit the copy as needed before publishing. Useful for similar roles or seasonal hiring.",
    category: "roles-jobs",
  },
  {
    q: "What are the different job statuses?",
    a: "Draft: not published. Active: live and accepting applications. Paused: temporarily hidden. Closed: no longer hiring. Use Paused for seasonal roles or when you need to pause hiring.",
    category: "roles-jobs",
  },
  {
    q: "How do I add a salary range to a job?",
    a: "In the role editor, use the Salary field. You can enter a range (e.g. £40k–£55k) or show 'Competitive'. Market Intelligence can suggest salary ranges based on role and location.",
    category: "roles-jobs",
  },
  {
    q: "Can I post to multiple job boards at once?",
    a: "Yes. Connect your job board licenses (LinkedIn, Indeed, Broadbean, etc.) in My Business > Integrations. When creating roles, select which boards to publish to. Enterprise plans support bulk posting.",
    category: "roles-jobs",
  },
  {
    q: "How do I use the AI job description generator?",
    a: "When creating a role, click 'Generate with AI'. Enter the job title and key requirements. The AI will draft a description you can edit. Save and publish when ready.",
    category: "roles-jobs",
  },
  {
    q: "What is the 3 Touch Point Hire System?",
    a: "Our workflow: (1) Job board posting and sourcing, (2) Screening and shortlisting, (3) Interview and follow-up. UPhire streamlines these steps with AI-powered sourcing, screening, and scheduling.",
    category: "roles-jobs",
  },
  {
    q: "How do I set job board visibility?",
    a: "In the role editor, use the Visibility or Publishing section. Choose which connected boards to publish to. You can also set visibility per board (e.g. LinkedIn only, or Indeed + LinkedIn).",
    category: "roles-jobs",
  },
  // Candidates
  {
    q: "How does the AI candidate matching work?",
    a: "Our AI analyzes candidate profiles against your job requirements, considering skills, experience, education, and other factors. It provides a match score (0-100%) and ranking to help you identify the best candidates quickly. The AI learns from your hiring patterns to improve recommendations over time.",
    category: "candidates",
  },
  {
    q: "How do I schedule interviews with candidates?",
    a: "After shortlisting candidates, you can schedule interviews directly from the candidate profile. Click 'Schedule Interview' and choose to integrate with Calendly for seamless scheduling, or add interview details manually. Candidates will receive an email invitation with all the details.",
    category: "candidates",
  },
  {
    q: "How do I shortlist or reject candidates?",
    a: "Open the candidate profile and use Shortlist or Reject. You can add notes. Shortlisted candidates move to the next stage. Rejected candidates receive an optional email (configurable in settings).",
    category: "candidates",
  },
  {
    q: "Can I add notes to candidate profiles?",
    a: "Yes. Open the candidate and use the Notes section. Add private notes visible only to your team. Notes are timestamped and can include interview feedback, skills, or follow-up reminders.",
    category: "candidates",
  },
  {
    q: "How do I view candidate application history?",
    a: "Open the candidate profile and check the Application History or Timeline tab. You'll see all applications, status changes, interviews, and communications for that candidate.",
    category: "candidates",
  },
  {
    q: "What are pipeline stages?",
    a: "Pipeline stages (e.g. Applied, Screening, Interview, Offer, Hired) represent where candidates are in your process. Move candidates between stages and track conversion rates. Customize stages in Settings.",
    category: "candidates",
  },
  {
    q: "How do I import candidates from a CSV?",
    a: "Go to Candidates > Import. Upload a CSV with columns for name, email, phone, and any custom fields. Map columns and map to a role. Review and confirm before import.",
    category: "candidates",
  },
  {
    q: "Can I bulk email candidates?",
    a: "Yes. Select multiple candidates and use the Bulk Actions menu. Choose an email template or send a custom message. Useful for status updates, interview reminders, or rejections.",
    category: "candidates",
  },
  {
    q: "How does the CV screening chat work?",
    a: "Our AI screening chat lets candidates answer questions in a conversational format. You can review transcripts and scores. Configure screening questions per role in the role editor.",
    category: "candidates",
  },
  {
    q: "How do I prevent duplicate candidates?",
    a: "UPhire uses email as the primary identifier. Duplicate detection runs on import and application. You can merge duplicate profiles manually if they appear.",
    category: "candidates",
  },
  // Analytics
  {
    q: "What is the Market Intelligence feature?",
    a: "Market Intelligence provides real-time salary data, market demand analysis, and competitive insights for job roles. It helps you set competitive salaries, understand market trends, and optimize your hiring strategy. Data is updated daily from multiple sources.",
    category: "analytics",
  },
  {
    q: "How do I generate a hiring report?",
    a: "Go to Analytics and choose a report type (e.g. Time to Hire, Source Performance, Conversion Funnel). Set date range and filters. Export as PDF or CSV.",
    category: "analytics",
  },
  {
    q: "What metrics can I track?",
    a: "Track applications per role, time to hire, source of hire, conversion rates, interview-to-offer ratio, offer acceptance rate, and cost per hire. Custom metrics available on Enterprise.",
    category: "analytics",
  },
  {
    q: "How do I measure cost per hire?",
    a: "Navigate to the Cost Savings or Analytics section. Cost per hire is calculated from job board spend, time invested, and platform costs. Compare to industry benchmarks.",
    category: "analytics",
  },
  {
    q: "Can I compare hiring performance over time?",
    a: "Yes. Analytics supports date range comparison. Compare this month vs last month, or this quarter vs last. Visualize trends and spot improvements or bottlenecks.",
    category: "analytics",
  },
  {
    q: "How do I export analytics data?",
    a: "In any analytics view, click Export. Choose CSV or PDF. Data is exported for the current filters and date range. Scheduled exports available on Enterprise.",
    category: "analytics",
  },
  {
    q: "What is the hiring funnel?",
    a: "The funnel shows candidates at each stage: Applied, Screening, Interview, Offer, Hired. Drop-off rates help identify where candidates leave. Use it to improve conversion.",
    category: "analytics",
  },
  // Features
  {
    q: "Can I export candidate data?",
    a: "Yes! You can export candidate lists, job postings, and analytics reports. Go to the relevant section (Candidates, Roles, or Analytics) and click the 'Export' button. Data is exported as CSV files that can be opened in Excel or Google Sheets.",
    category: "features",
  },
  {
    q: "How does Calendly integration work?",
    a: "Connect Calendly in My Business > Integrations. When scheduling interviews, choose Calendly to send a booking link. Candidates pick a slot and it syncs to your calendar. Supports round-robin and team scheduling.",
    category: "features",
  },
  {
    q: "What is the AI recruitment outreach feature?",
    a: "UPhireIQ AI Recruitment finds and engages candidates from your job boards. It runs sequences, sends outreach, and screens responses. You review AI-generated candidates and shortlist.",
    category: "features",
  },
  {
    q: "How do VR simulation interviews work?",
    a: "VR simulations let candidates complete role-based scenarios in a virtual environment. Assess skills, problem-solving, and behaviour. Available on Enterprise. Configure scenarios per role.",
    category: "features",
  },
  {
    q: "How do I manage employee documents?",
    a: "Go to Documents or Employees. Upload offer letters, contracts, NDAs, and onboarding docs. Organise by employee or document type. Access control and audit logs on Enterprise.",
    category: "features",
  },
  {
    q: "Can I use contract templates?",
    a: "Yes. Document templates are available for common contracts. Customise placeholders and use Auto-Send to send to new hires automatically. Available on Growth and Enterprise.",
    category: "features",
  },
  {
    q: "What job boards does UPhire support?",
    a: "We support LinkedIn, Indeed, Broadbean, and other major boards. Connect your own licenses via API or integrations. Enterprise plans include dedicated job board support.",
    category: "features",
  },
  {
    q: "How do I set up webhooks?",
    a: "In Settings or Integrations, add a webhook URL. Choose events (e.g. new application, status change). UPhire sends webhooks when events occur. Useful for ATS sync or custom workflows.",
    category: "features",
  },
  {
    q: "What is the DEI (Diversity) score?",
    a: "The DEI score shows how well a role or hiring process aligns with diversity goals. It considers factors like inclusive language and outreach. Use it to improve hiring equity.",
    category: "features",
  },
  // Account & Billing
  {
    q: "How do I add team members to my account?",
    a: "Go to 'My Business' -> 'Team Members' and click 'Add Member'. Enter their email address and assign a role (Admin, HR Manager, or Recruiter). They'll receive an invitation email to join your team.",
    category: "account-billing",
  },
  {
    q: "What are the subscription plans?",
    a: "Free: core features. Growth: AI recruitment, Market Intelligence, more integrations. Enterprise: SSO, dedicated support, custom integrations, compliance features. See pricing for details.",
    category: "account-billing",
  },
  {
    q: "How do I upgrade or downgrade?",
    a: "Go to Subscription > Upgrade or Manage Subscription. Choose plan and confirm. Upgrades are immediate. Downgrades take effect at the next billing cycle.",
    category: "account-billing",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Subscription > Manage Subscription. Click Cancel. Your subscription remains active until the end of the billing period. Export your data before cancellation if needed.",
    category: "account-billing",
  },
  {
    q: "Where can I find my invoices?",
    a: "Invoices are in Subscription > Billing History. Download PDFs for past invoices. Update payment method in Settings.",
    category: "account-billing",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit cards (Visa, Mastercard, Amex) and bank transfer for annual Enterprise plans. Payment is processed securely via Stripe.",
    category: "account-billing",
  },
  {
    q: "What are the different user roles?",
    a: "Admin: full access. HR Manager: manage roles, candidates, team. Recruiter: manage candidates and roles. Interviewer: view interviews and feedback. Custom roles on Enterprise.",
    category: "account-billing",
  },
  {
    q: "How do I remove a team member?",
    a: "Go to My Business > Team Members. Find the user and click Remove. They lose access immediately. Reassign their data if needed before removal.",
    category: "account-billing",
  },
  {
    q: "How do I update my company profile?",
    a: "Go to My Business > Company Profile. Update company name, logo, address, and industry. Changes appear on job postings and candidate communications.",
    category: "account-billing",
  },
  // Troubleshooting
  {
    q: "How do I reset my password?",
    a: "Navigate to the login page and click 'Forgot password'. Enter your email address and we'll send you a reset link. If you don't receive the email within a few minutes, check your spam folder or contact support.",
    category: "troubleshooting",
  },
  {
    q: "Why can't I see my job postings?",
    a: "Ensure your job posting status is set to 'Active' rather than 'Draft'. If you've recently created a role, it may take a few minutes to appear. Check that you're viewing the correct job board or integration. If the issue persists, contact support.",
    category: "troubleshooting",
  },
  {
    q: "The AI matching is not showing results. What should I do?",
    a: "Verify that your job description has enough detail (skills, experience level, requirements). Ensure candidates have completed profiles with relevant information. Try broadening your search criteria. If issues continue, our support team can help diagnose.",
    category: "troubleshooting",
  },
  {
    q: "Why is my page loading slowly?",
    a: "Clear your browser cache and try again. Use a supported browser (Chrome, Firefox, Edge, Safari). Check your internet connection. If the issue persists, contact support—we may be experiencing high load.",
    category: "troubleshooting",
  },
  {
    q: "I'm getting an error when creating a role. What could it be?",
    a: "Common causes: missing required fields (title, description), invalid salary format, or character limits. Check validation messages. If the error persists, try a different browser or contact support.",
    category: "troubleshooting",
  },
  {
    q: "Why aren't my integrations syncing?",
    a: "Check that integrations are connected and authorised. Reconnect if tokens expire. Some integrations sync on a schedule (e.g. every 15 minutes). Check Integration status in Settings.",
    category: "troubleshooting",
  },
  {
    q: "Why can't I log in?",
    a: "Verify your email and password. Use Forgot password if needed. Ensure your account is verified (check email). If you use SSO, ensure it's configured correctly. Contact support if locked out.",
    category: "troubleshooting",
  },
  {
    q: "Why is my exported data incomplete?",
    a: "Exports apply to current filters and date range. Ensure you've selected the right scope. Large exports may be paginated—check for multiple files. Contact support for large exports.",
    category: "troubleshooting",
  },
  // Video Tutorials
  {
    q: "Where can I find video tutorials?",
    a: "Video tutorials are available in our Help Center under the Video Tutorials section. We cover getting started, creating roles, managing candidates, and using AI features. New videos are added regularly.",
    category: "video-tutorials",
  },
  {
    q: "Is there a video for the AI recruitment feature?",
    a: "Yes. Our 'UPhireIQ AI Recruitment' guide walks you through setting up AI sequences, customizing prompts, and reviewing AI-generated matches. Check the Video Tutorials section or contact support for the latest links.",
    category: "video-tutorials",
  },
  {
    q: "Is there a video for creating roles?",
    a: "Yes. Our 'Creating Your First Role' video covers setting up a job posting, using the AI description generator, and publishing to job boards. Find it in the Video Tutorials section.",
    category: "video-tutorials",
  },
  {
    q: "Is there a video for Market Intelligence?",
    a: "Yes. The Market Intelligence tutorial shows how to use salary data, market demand, and trends to optimise your hiring. Available in Video Tutorials.",
    category: "video-tutorials",
  },
  {
    q: "Is there a video for Calendly integration?",
    a: "Yes. Our integration setup video walks through connecting Calendly and scheduling interviews. Check the Video Tutorials section.",
    category: "video-tutorials",
  },
  {
    q: "Is there a video for the dashboard?",
    a: "Yes. The dashboard overview video explains metrics, widgets, and quick actions. Available in Video Tutorials.",
    category: "video-tutorials",
  },
  // Documentation
  {
    q: "Where is the full API documentation?",
    a: "API documentation is available for enterprise customers. It covers authentication, endpoints for roles, candidates, and analytics, and webhook configuration. Contact your account manager or support for access.",
    category: "documentation",
  },
  {
    q: "How do I integrate with my ATS?",
    a: "See our Integration Guide in the Documentation section. We support integrations via API, webhooks, and CSV import. Enterprise plans include dedicated integration support.",
    category: "documentation",
  },
  {
    q: "How do I use the API?",
    a: "API access requires an API key from Settings. Use REST endpoints for roles, candidates, and analytics. See the API docs for authentication (Bearer token) and rate limits.",
    category: "documentation",
  },
  {
    q: "What webhook events are available?",
    a: "Events include: application.created, candidate.shortlisted, candidate.rejected, interview.scheduled, role.closed. See the webhook documentation for payload schemas and retry logic.",
    category: "documentation",
  },
  {
    q: "Is there a data dictionary or schema?",
    a: "Yes. Our documentation includes schema definitions for roles, candidates, applications, and analytics. Useful for integrations and custom reporting.",
    category: "documentation",
  },
  {
    q: "How do I set up SSO for my organisation?",
    a: "SSO (SAML/OIDC) is available on Enterprise. Contact your account manager or support. We support WorkOS, Okta, Azure AD, and other providers.",
    category: "documentation",
  },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchTrimmed = search.trim().toLowerCase();
  const searchWords = searchTrimmed
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const faqMatchesSearch = (faq: { q: string; a: string; category: string }) => {
    if (!searchWords.length) return true;
    const cat = categories.find((c) => c.id === faq.category);
    const searchableText = [
      faq.q,
      faq.a,
      cat?.title ?? "",
      cat?.description ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ");
    return searchWords.every((word) => searchableText.includes(word));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faqMatchesSearch(faq);
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    if (searchTrimmed) {
      return matchesSearch;
    }
    return matchesCategory && matchesSearch;
  });

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
            const isSelected = selectedCategory === cat.id;
            const isContactSupport = cat.id === "contact-support";
            const baseClasses = "block w-full text-left p-6 rounded-lg border transition-all";
            const selectedClasses = "bg-slate-50 border-slate-400 shadow-md ring-2 ring-slate-300";
            const defaultClasses = "bg-white border-gray-200 hover:border-slate-300 hover:shadow-md";
            const buttonClassName = `${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`;
            const linkClassName = `${baseClasses} ${defaultClasses}`;

            if (isContactSupport) {
              return (
                <Link
                  key={cat.id}
                  to="/support"
                  className={linkClassName}
                >
                  <Icon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
                </Link>
              );
            }

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(isSelected ? null : cat.id);
                  setSearch("");
                  document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={buttonClassName}
              >
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
              </button>
            );
          })}
        </div>

        <div id="faq-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Frequently Asked Questions
              {selectedCategory && (
                <span className="ml-2 text-base font-normal text-slate-600">
                  ({categories.find((c) => c.id === selectedCategory)?.title})
                </span>
              )}
            </h2>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Show all
              </button>
            )}
          </div>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
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
              ))
            ) : (
              <p className="text-gray-500 py-8 text-center">
                {search
                  ? "No FAQs match your search. Try different keywords."
                  : "No FAQs in this category yet. Browse other categories or contact support."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
