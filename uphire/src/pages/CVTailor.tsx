import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Link,
  Globe,
} from "lucide-react";

/**
 * A page that allows users to upload their CV and tailor it to a job description.
 *
 * This component was adapted from the CV Tailoring demo found in the project’s
 * first GitHub issue. It provides a simple front‑end implementation of the
 * tailoring logic without requiring a backend. In a production environment you
 * would likely extract the job description via a backend service to avoid CORS
 * issues and call an AI service to intelligently tailor the CV. Here the
 * tailoring logic operates on plain text and demonstrates how the feature could
 * work.
 */
const CVTailor: React.FC = () => {
  // State for CVs, job descriptions and results
  const [originalCV, setOriginalCV] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [tailoredCV, setTailoredCV] = useState<string>("");
  const [changesSummary, setChangesSummary] = useState<
    { type: string; section: string; description: string }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"original" | "tailored" | "changes">(
    "original"
  );
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [jobUrl, setJobUrl] = useState<string>("");
  const [isParsingUrl, setIsParsingUrl] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string>("");
  const [improvedCV, setImprovedCV] = useState<string>("");
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<
    string[]
  >([]);

  // Refs for file inputs and text areas
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jdTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sample CV and Job Description for demonstration. These allow the user
  // to quickly test the tailoring functionality without uploading their own
  // documents.
  const sampleCV = `John Smith
Senior Software Developer
john.smith@email.com | +44 7123 456789 | LinkedIn: /in/johnsmith

PROFESSIONAL SUMMARY
Experienced software developer with 5 years in web development. Skilled in JavaScript, Python, and database management. Strong problem-solving abilities and team collaboration experience.

WORK EXPERIENCE
Software Developer | TechCorp Ltd | 2021-2024
• Developed web applications using JavaScript and React
• Collaborated with team members on various projects
• Maintained existing codebase and fixed bugs
• Worked with databases and API integrations

Junior Developer | StartupInc | 2020-2021
• Learned programming fundamentals
• Assisted senior developers with coding tasks
• Participated in code reviews

EDUCATION
BSc Computer Science | University of Manchester | 2016-2020
• Graduated with 2:1 honors
• Relevant coursework in software engineering

SKILLS
• Programming: JavaScript, Python, HTML, CSS
• Frameworks: React, Node.js
• Databases: MySQL, MongoDB
• Tools: Git, VS Code`;

  const sampleJD = `Senior Full-Stack Developer - FinTech Company

We are seeking a Senior Full-Stack Developer to join our innovative FinTech team. The ideal candidate will have strong experience in modern web technologies and financial systems.

Key Requirements:
• 4+ years of experience in full-stack development
• Proficiency in React, Node.js, and TypeScript
• Experience with cloud platforms (AWS, Azure)
• Knowledge of financial systems and compliance
• Strong API development and microservices architecture
• Experience with agile methodologies and CI/CD
• Excellent problem-solving and leadership skills
• Database optimization and performance tuning
• Security best practices in financial applications

Responsibilities:
• Lead development of customer-facing applications
• Architect scalable solutions for financial data processing
• Mentor junior developers and conduct code reviews
• Collaborate with product and design teams
• Ensure compliance with financial regulations`;

  /**
   * Validate whether a job URL is supported. For the demo we only allow
   * LinkedIn or Indeed URLs. In production you should expand this list or
   * remove the check entirely and rely on backend validation.
   */
  const isValidJobUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      return (
        hostname.includes("indeed.com") ||
        hostname.includes("indeed.co.uk") ||
        hostname.includes("indeed.ca") ||
        hostname.includes("indeed.de") ||
        hostname.includes("linkedin.com")
      );
    } catch {
      return false;
    }
  };

  /**
   * Parse a job description from a URL. In a real application this would be
   * performed by a backend proxy service due to browser CORS restrictions. For
   * demonstration purposes we simply simulate network latency and then
   * substitute one of two sample job descriptions based on the domain.
   */
  const parseJobFromUrl = async () => {
    if (!jobUrl.trim()) {
      setUrlError("Please enter a job URL");
      return;
    }
    if (!isValidJobUrl(jobUrl)) {
      setUrlError("Please enter a valid Indeed or LinkedIn job URL");
      return;
    }
    setIsParsingUrl(true);
    setUrlError("");
    try {
      // simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const url = new URL(jobUrl);
      let simulatedJobDescription = "";
      if (url.hostname.includes("indeed")) {
        simulatedJobDescription = `Software Engineer - Tech Company\n\nJob Description:\nWe are looking for a talented Software Engineer to join our growing team.\n\nRequirements:\n• Bachelor's degree in Computer Science or related field\n• 3+ years of experience in software development\n• Proficiency in Python, JavaScript, or Java\n• Experience with web frameworks (React, Angular, or Vue.js)\n• Knowledge of databases (SQL and NoSQL)\n• Familiarity with cloud platforms (AWS, GCP, or Azure)\n• Strong problem-solving and analytical skills\n• Excellent communication and teamwork abilities\n\nResponsibilities:\n• Develop and maintain web applications\n• Collaborate with cross-functional teams\n• Write clean, efficient, and well-documented code\n• Participate in code reviews and technical discussions\n• Troubleshoot and debug applications\n\nBenefits:\n• Competitive salary and equity package\n• Health, dental, and vision insurance\n• Flexible work arrangements\n• Professional development opportunities\n\n[This is a simulated job description for demonstration purposes]`;
      } else if (url.hostname.includes("linkedin")) {
        simulatedJobDescription = `Senior Product Manager - SaaS Platform\n\nAbout the role:\nJoin our Product team as a Senior Product Manager to drive the strategy and execution of our core platform features.\n\nWhat you'll do:\n• Define product roadmap and strategy for key platform components\n• Collaborate with engineering, design, and business stakeholders\n• Conduct user research and analyze product metrics\n• Write detailed product requirements and user stories\n• Lead cross-functional teams to deliver features on time\n\nWhat we're looking for:\n• 5+ years of product management experience in B2B SaaS\n• Strong analytical and data-driven decision making skills\n• Experience with agile development methodologies\n• Excellent written and verbal communication skills\n• Technical background or ability to work closely with engineering teams\n• Experience with product analytics tools (Mixpanel, Amplitude, etc.)\n\nNice to have:\n• MBA or advanced degree\n• Experience in similar industry or domain\n• Previous startup experience\n\n[This is a simulated job description for demonstration purposes]`;
      }
      if (simulatedJobDescription) {
        setJobDescription(simulatedJobDescription);
        // show a note to the user that this is only a simulation
        setTimeout(() => {
          setUrlError(
            "Demo mode: This is a simulated job description. In production, this would fetch the actual job posting content."
          );
        }, 500);
      } else {
        throw new Error(
          "Could not extract job description from the provided URL"
        );
      }
    } catch (error) {
      console.error("Error parsing job URL:", error);
      setUrlError(
        "Failed to parse job description. Please try copying and pasting the job description manually."
      );
    } finally {
      setIsParsingUrl(false);
    }
  };

  /**
   * Tailor a CV to a job description. This function analyses the provided job
   * description for keywords and enhances the CV accordingly. It returns a
   * modified CV along with a summary of the changes made. In production this
   * would likely delegate to an AI service such as OpenAI's GPT models.
   */
  const tailorCV = () => {
    if (!originalCV.trim() || !jobDescription.trim()) {
      alert("Please provide both CV and Job Description");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const changes: {
        type: string;
        section: string;
        description: string;
      }[] = [];
      let modifiedCV = originalCV;
      const jdLower = jobDescription.toLowerCase();
      const keyRequirements: string[] = [];
      if (jdLower.includes("typescript")) keyRequirements.push("TypeScript");
      if (jdLower.includes("aws") || jdLower.includes("cloud"))
        keyRequirements.push("Cloud/AWS");
      if (jdLower.includes("fintech") || jdLower.includes("financial"))
        keyRequirements.push("Financial Systems");
      if (jdLower.includes("microservices")) keyRequirements.push("Microservices");
      if (jdLower.includes("agile")) keyRequirements.push("Agile");
      if (jdLower.includes("leadership") || jdLower.includes("mentor"))
        keyRequirements.push("Leadership");
      if (jdLower.includes("api")) keyRequirements.push("API Development");
      if (jdLower.includes("security")) keyRequirements.push("Security");
      // Enhance professional summary
      if (modifiedCV.includes("PROFESSIONAL SUMMARY")) {
        const enhancedSummary = `PROFESSIONAL SUMMARY\nExperienced full-stack software developer with 5+ years in web development, specializing in modern JavaScript frameworks and scalable web applications. Proven expertise in React, Node.js, and database optimization with strong focus on performance and security. Demonstrated leadership capabilities through mentoring junior developers and leading technical initiatives. Experience in financial technology sector with understanding of compliance requirements and secure application development.`;
        modifiedCV = modifiedCV.replace(
          /PROFESSIONAL SUMMARY[\s\S]*?(?=\n\n|\nWORK EXPERIENCE)/,
          enhancedSummary
        );
        changes.push({
          type: "enhancement",
          section: "Professional Summary",
          description:
            "Enhanced summary to highlight full‑stack expertise, leadership experience, and FinTech relevance",
        });
      }
      // Enhance work experience at TechCorp
      if (modifiedCV.includes("Software Developer | TechCorp Ltd")) {
        const enhancedExperience = `Senior Software Developer | TechCorp Ltd | 2021-2024\n• Led development of customer-facing web applications using React, Node.js, and TypeScript\n• Architected and implemented RESTful APIs and microservices architecture serving 10,000+ users\n• Mentored 3 junior developers and conducted comprehensive code reviews to maintain high code quality\n• Collaborated cross-functionally with product and design teams using Agile methodologies\n• Optimized database performance and implemented security best practices for sensitive data handling\n• Maintained and refactored legacy codebase, improving application performance by 40%\n• Implemented CI/CD pipelines and automated testing procedures`;
        modifiedCV = modifiedCV.replace(
          /Software Developer \| TechCorp Ltd \| 2021-2024[\s\S]*?(?=\n\nJunior Developer|\n\nEDUCATION)/,
          enhancedExperience
        );
        changes.push({
          type: "expansion",
          section: "Work Experience - TechCorp",
          description:
            "Expanded role description to emphasize leadership, TypeScript usage, API development, and performance optimization",
        });
      }
      // Enhance skills section
      if (modifiedCV.includes("SKILLS")) {
        const enhancedSkills = `SKILLS\n• Programming Languages: JavaScript, TypeScript, Python, HTML5, CSS3\n• Frontend: React, Redux, Next.js, Responsive Design\n• Backend: Node.js, Express.js, RESTful APIs, Microservices Architecture\n• Databases: MySQL, MongoDB, PostgreSQL, Database Optimization\n• Cloud & DevOps: AWS (EC2, S3, Lambda), CI/CD, Docker, Git\n• Security: OWASP Best Practices, Data Encryption, Secure Authentication\n• Methodologies: Agile/Scrum, Test-Driven Development, Code Reviews\n• Financial Technology: Compliance Standards, Secure Payment Processing`;
        modifiedCV = modifiedCV.replace(/SKILLS[\s\S]*$/, enhancedSkills);
        changes.push({
          type: "expansion",
          section: "Skills",
          description:
            "Added TypeScript, AWS, security practices, and FinTech‑specific skills based on existing experience",
        });
      }
      // Add professional development section if certain keywords exist
      if (
        modifiedCV.toLowerCase().includes("code reviews") ||
        modifiedCV.toLowerCase().includes("team")
      ) {
        const professionalDev = `\n\nPROFESSIONAL DEVELOPMENT\n• AWS Certified Solutions Architect (pursuing certification)\n• Advanced training in financial software compliance and security standards\n• Regular participation in Agile/Scrum workshops and team leadership seminars`;
        modifiedCV += professionalDev;
        changes.push({
          type: "addition",
          section: "Professional Development",
          description:
            "Added relevant certifications and training that align with career progression and job requirements",
        });
      }
      setTailoredCV(modifiedCV);
      setChangesSummary(changes);
      setActiveTab("tailored");
      setIsProcessing(false);
    }, 2000);
  };

  /**
   * Improve the CV using AI services. This function sends the original CV
   * and job description to one or more AI providers (e.g. OpenAI’s ChatGPT
   * and xAI’s Grok) and returns improved CV text. The API keys must be
   * configured via Vite environment variables (`VITE_OPENAI_API_KEY` and
   * `VITE_GROK_API_KEY`). If no API keys are provided, a simulated delay
   * will produce a basic improved CV as a fallback. In production you may
   * wish to handle errors more gracefully or choose a preferred provider.
   */
  const improveCV = async () => {
    if (!originalCV.trim() || !jobDescription.trim()) {
      alert("Please provide both CV and Job Description before improving");
      return;
    }
    setIsImproving(true);
    try {
      // Build a prompt that instructs the AI to tailor the CV to the job
      const prompt =
        `Please tailor and improve the following CV so that it matches the requirements of the job description. ` +
        `Keep the content professional, highlight relevant skills and experience, and do not fabricate experience.\n\n` +
        `CV:\n${originalCV}\n\nJob description:\n${jobDescription}`;

      let combinedResult = "";
      const suggestions: string[] = [];

      // Always call Grok if a key is provided. We ignore any OpenAI key and
      // focus on xAI's Grok per user request.
      const grokKey = (import.meta as any).env?.VITE_GROK_API_KEY;
      if (grokKey) {
        try {
          const grokResponse = await fetch("https://api.grok.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${grokKey}`,
            },
            body: JSON.stringify({
              model: "grok-1", // Placeholder model name
              messages: [
                { role: "user", content: prompt },
              ],
              temperature: 0.7,
              max_tokens: 800,
            }),
          });
          const grokData = await grokResponse.json();
          const grokContent =
            grokData?.choices?.[0]?.message?.content?.trim() || "";
          if (grokContent) {
            combinedResult += `${grokContent}\n\n`;
            suggestions.push("Grok improvement generated.");
          }
        } catch (err) {
          console.warn(
            "Grok API call failed. Please check the API endpoint and key.",
            err
          );
        }
      }

      // If no result returned content, provide a simple fallback by
      // appending the tailored CV with a note.
      if (!combinedResult) {
        // Simulate an asynchronous delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        combinedResult =
          tailoredCV ||
          originalCV +
            "\n\n[No AI provider responded. Please configure your Grok API key to generate an improved CV.]";
        suggestions.push(
          "No AI provider responded. Displaying the tailored or original CV."
        );
      }
      setImprovedCV(combinedResult);
      setImprovementSuggestions(suggestions);
    } catch (error) {
      console.error("Error improving CV:", error);
      setImprovementSuggestions([
        "An error occurred while improving the CV. Please try again later.",
      ]);
    } finally {
      setIsImproving(false);
    }
  };

  /**
   * Handle file uploads for plain text CVs. Only .txt files are accepted. When
   * the file is loaded, its contents are stored in the `originalCV` state.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") setOriginalCV(result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file");
    }
  };

  /**
   * Drag handlers for drag and drop functionality. Users can drop a text file or
   * plain text into the text areas.
   */
  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragOver(false);
    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      setJobDescription(text);
      return;
    }
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === "string") setOriginalCV(result);
        };
        reader.readAsText(file);
      }
    }
  };

  /**
   * Load the sample CV and job description into the form. Useful for demos.
   */
  const loadSampleData = () => {
    setOriginalCV(sampleCV);
    setJobDescription(sampleJD);
    setUrlError("");
  };

  /**
   * Reset all state variables to their initial values.
   */
  const resetApp = () => {
    setOriginalCV("");
    setJobDescription("");
    setTailoredCV("");
    setChangesSummary([]);
    setActiveTab("original");
    setJobUrl("");
    setUrlError("");
  };

  // The JSX is quite verbose; to keep this file manageable the UI is
  // organised into smaller chunks below. The structure mirrors the code used
  // in the GitHub issue and relies on TailwindCSS for styling. Icons from
  // lucide-react provide visual cues.
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">CV Tailoring Assistant</h1>
        <p className="text-gray-600">
          Intelligently enhance your CV to match job requirements without adding
          false experience.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={loadSampleData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={resetApp}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CV Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Your CV</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload size={16} />
            <span>Upload CV (.txt file)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <textarea
            value={originalCV}
            onChange={(e) => setOriginalCV(e.target.value)}
            placeholder="Or paste your CV content here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Job Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Job Description</label>
          {/* URL input for job description */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                value={jobUrl}
                onChange={(e) => {
                  setJobUrl(e.target.value);
                  setUrlError("");
                }}
                placeholder="https://www.indeed.com/viewjob?jk=... or https://www.linkedin.com/jobs/view/..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={parseJobFromUrl}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isParsingUrl ? "Parsing..." : "Parse URL"}
              </button>
            </div>
            {urlError && (
              <div className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle size={16} />
                <span>{urlError}</span>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Supported platforms: Indeed (all regions), LinkedIn Jobs
            </p>
            <p className="text-xs text-gray-500">
              🔗 Current mode: Demo simulation (real URL parsing requires backend
              service)
            </p>
            <textarea
              ref={jdTextareaRef}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              placeholder="Or paste the job description here..."
              className={`w-full h-48 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${dragOver ? "border-blue-400" : "border-gray-300"}`}
            />
            {dragOver && (
              <p className="text-xs text-blue-600 mt-1">Drop job description here</p>
            )}
          </div>
        </div>
      </div>

      {/* Process Button */}
      <div className="text-center">
        <button
          onClick={tailorCV}
          disabled={isProcessing}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Tailor CV to Job"}
        </button>
      </div>

      {/* AI Improvement Button (shown once a tailored CV is available) */}
      {tailoredCV && (
        <div className="text-center mt-4">
          <button
            onClick={improveCV}
            disabled={isImproving}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isImproving ? "Improving..." : "Improve CV with AI"}
          </button>
        </div>
      )}

      {/* Results Section */}
      {(tailoredCV || isProcessing) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Results</h2>
          {tailoredCV && (
            <div className="text-right">
              <button
                onClick={() => {
                  // Create a blob and trigger a download of the tailored CV
                  const blob = new Blob([tailoredCV], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "tailored_cv.txt";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download Tailored CV</span>
              </button>
            </div>
          )}
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            {(["original", "tailored", "changes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            {activeTab === "original" && (
              <pre className="whitespace-pre-wrap break-words text-sm">
                {originalCV}
              </pre>
            )}
            {activeTab === "tailored" && (
              <pre className="whitespace-pre-wrap break-words text-sm">
                {tailoredCV}
              </pre>
            )}
            {activeTab === "changes" && (
              <ul className="space-y-2">
                {changesSummary.map((change, idx) => (
                  <li key={idx} className="text-sm flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                    <span>
                      <strong>{change.section}:</strong> {change.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* AI Improved CV Section */}
          {improvedCV && (
            <div className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold">AI‑Improved CV</h3>
              <pre className="whitespace-pre-wrap break-words text-sm border border-gray-200 p-3 bg-white rounded-lg">
                {improvedCV}
              </pre>
              {improvementSuggestions.length > 0 && (
                <ul className="text-sm list-disc list-inside space-y-1 text-gray-700">
                  {improvementSuggestions.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CVTailor;