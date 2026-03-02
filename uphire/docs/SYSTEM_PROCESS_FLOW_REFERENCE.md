# UPhire IQ - System Process Flow Reference

Reference extracted from UPHIRE_SYSTEM_PROCESS_FLOW.docx for implementation alignment.

## Implemented Functionality

### 1. User Authentication & Onboarding
- [x] **Login** – Supabase Auth + admin login (demo@google / 123456)
- [x] **Sign up** – Supabase Auth sign up
- [x] **Forgot Password** – Link on login page, Supabase `resetPasswordForEmail`
- [x] Password strength indicator (min 8 chars, upper, lower, number, special)
- [x] Welcome tour for first-time users
- [x] Onboarding wizard (company info, team setup, integrations)

### 2. Job Role Management
- [x] **Create New Role** – Modal with Job Title, Department, Location, Salary, Priority, Status
- [x] **Status types** – Draft, Active, On Hold, Closed
- [x] **Priority** – Low, Medium, High, Urgent
- [x] **AI job description** – Generate with AI button
- [x] **Requirements & benefits** – Dynamic lists
- [x] Edit roles
- [x] Bulk editing
- [x] Role analytics dashboard

### 3. AI-Powered Recruitment
- [x] **Start AI Recruitment** – Button on role cards
- [x] AIRecruitmentModal with campaign types (Standard, Aggressive, Gentle, Custom)
- [ ] Job board / LinkedIn / Indeed / GitHub sourcing
- [ ] AI matching algorithm (skills 40%, experience 30%, qualifications 20%)
- [ ] Candidate profile generation

### 4. Outreach System
- [x] **Outreach Dashboard** – Overview, Active Sequences, Candidates, Analytics
- [x] **Start New Outreach** – Button
- [x] CreateOutreachSequenceModal – Candidate selection, job role, sequence config
- [ ] Message generation (AI)
- [ ] Response classification

### 5. Candidate Management
- [x] **Candidates tab** – List with status, skills, AI match
- [x] **Schedule Interview** – Button
- [x] **View Profile, Send Message, Make Offer**
- [x] Shortlisting workflow
- [ ] Vetting call scheduling

### 6. Support & Admin
- [x] **Support Tickets** – List, search, filter
- [x] **New Ticket** – Modal with title, description, priority, category
- [x] **Help Center** – Categories, FAQs
- [x] Ticket creation via API (support_tickets table)

### 7. Market Intelligence
- [x] **Market Intelligence tab** – Search, salary data, market demand, skills
- [x] **UK market data** – Adzuna API, ITJobsWatch (parsed), Grok fallback, uploaded roles

### 8. Other Features
- [x] **Analytics** – KPIs, Hiring Funnel, Source Performance, Monthly Trends
- [x] **Documents** – Document library, filters, Upload, New Template
- [x] **Employees** – Employee directory, probation alerts
- [x] **Cost Savings & ROI** – Savings breakdown, ROI comparison
- [x] **Apply page** – Job application form at /apply/:roleId

## Database Tables (Supabase)
- profiles, roles, candidates, shortlisted_candidates
- interview_records, ai_predictions, documents
- support_tickets (migration 002)
- tenants, tenant_users, tenant_job_board_licenses
- job_board_analytics
