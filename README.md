<div align="center">

# 🚀 HireHub — Smart AI-Powered Job Portal & ATS Platform

**An enterprise-grade, full-stack recruitment platform with AI-driven ATS resume scoring, automated candidate screening, real-time in-app notifications, and dual-channel email alerts.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [AI ATS Resume Scoring Engine](#-ai-ats-resume-scoring-engine)
- [Deployment Guide (Render & Vercel)](#-deployment-guide-render--vercel)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**HireHub** is an intelligent, full-stack recruitment ecosystem that connects **Job Seekers (Students/Candidates)** with **Recruiters (Hiring Managers)**. It features an automated **AI-powered ATS (Applicant Tracking System)** that parses candidate resumes, scores them across a standardized 100-point rubric, provides deep skill gap analyses, breaks candidates into 5 score tiers, and equips recruiters with an adjustable bulk-screening tool to instantly reject underqualified applications.

### User Roles & Capabilities

| 👨‍💻 Job Seeker (Student) | 🏢 Recruiter (Admin) |
|---|---|
| Browse, search & filter jobs by title, location, salary & type | Enterprise Company Management with logo branding & HQ tracking |
| **Interactive ATS Pre-Check** before applying | Post, update, and manage job listings with salary in LPA & openings |
| One-click apply with PDF resume parsing | **Recruiter Command Center** with 4 KPI cards & Table/Grid views |
| Real-time application tracker (Pending, Accepted, Rejected) | **5-Tier ATS Score Distribution** (1-20, 20-40, 40-60, 60-80, 80-100) |
| Bookmark jobs for later | **Adjustable Bulk-Rejection Tool** with score slider & instant email alerts |
| Profile portfolio with skills, bio & resume preview | Deep **AI Evaluation Modal** with matching/missing skills & feedback |
| In-app notification bell & transactional email alerts | Real-time recruiter analytics dashboard with Recharts trends |

---

## ✨ Key Features

### 🤖 1. AI-Powered ATS Resume Engine
- **Standardized 100-Point Scoring Rubric** — 70 points for exact/semantic technical skill overlap + 30 points for verifiable practical evidence (projects, experience, education).
- **Automated PDF Parsing** — Supports `pdf-parse` (v1 & v2) for robust local and cloud PDF extraction.
- **Pre-Apply ATS Fit Check** — Candidates can preview their alignment against a job before submitting their resume.
- **Deep Evaluation Feedback** — Evaluates matching skills, missing skills, strengths, concerns, and on-demand resume re-analysis.

### 🎯 2. 5-Tier ATS Distribution & Adjustable Bulk Screening
- **5 Score Performance Tiers** — Automatically partitions candidate pools into `1-20%` *(Low Match)*, `20-40%` *(Partially Qualified)*, `40-60%` *(Moderate Fit)*, `60-80%` *(Qualified)*, and `80-100%` *(Top Match)*.
- **Interactive Tier Filtering** — Clicking any tier card immediately isolates that cohort in the applicants table.
- **Applicant Pool Spectrum** — Horizontal stacked progress bar visualizing the overall candidate distribution at a glance.
- **Adjustable Bulk Rejection** — Recruiters can adjust a minimum ATS cutoff score (slider, numeric input, or quick presets `<30%`, `<40%`, etc.), preview affected candidates, and bulk-reject underqualified applicants with automated email notifications.

### 🏢 3. Recruiter Command Center (Jobs & Companies)
- **4 Live KPI Metric Cards for Jobs** — Total Postings, Total Applications Received, Active Pipelines, and Email Alerts status.
- **4 Live KPI Metric Cards for Companies** — Total Companies, Active Jobs Hosted, Actively Hiring count, and Branding Readiness.
- **Table vs. Cards Grid Switcher** — Smooth toggle between high-density data tables and interactive card grids.
- **Direct Applicant Review Buttons** — `👥 X Applicants (Review →)` takes the recruiter directly into the candidate scoring pipeline.
- **Smart Filtering & Sorting** — Live multi-field search across title, company, location, and requirements; quick status tabs; and sorting by newest, salary, or applicant volume.

### 📧 4. Multi-Channel Notifications & Resilient Email Engine
- **In-App Notifications** — Bell badge with real-time counter, unread indicators, and mark-all-as-read actions.
- **Dual Email Transport** — Dispatches candidate confirmations, recruiter alerts, and status changes via standard SMTP or automated HTTPS fallback (Resend / Brevo) to avoid egress port restrictions on cloud platforms like Render.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Modern reactive component architecture |
| **Vite 6** | Ultra-fast development server & production bundler |
| **Tailwind CSS 4** | Utility-first responsive styling and modern design system |
| **Redux Toolkit** | Centralized application state management |
| **Redux Persist** | Persistent user authentication across page reloads |
| **React Router v7** | Client-side routing with role-based `ProtectedRoute` |
| **Radix UI** | Accessible headless UI primitives (Dialog, Popover, Select, Avatar) |
| **Framer Motion** | Micro-interactions and smooth page transitions |
| **Recharts** | Interactive recruiter analytics charts |
| **Lucide React** | Consistent, modern icon set |
| **Sonner** | Floating toast notification system |
| **Axios** | Promised-based HTTP client with credentials |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js (ESM)** | JavaScript runtime |
| **Express 5** | RESTful web framework |
| **MongoDB + Mongoose 8** | Document database with relational schema population |
| **JWT (JSON Web Tokens)** | Stateless HTTP-only cookie-based authentication |
| **bcryptjs** | Salted password hashing |
| **Multer** | Multi-part form data handling |
| **Cloudinary** | Cloud-hosted storage for resumes, logos, and avatars |
| **pdf-parse** | Server-side PDF text extraction |
| **Nodemailer + Resend / Brevo** | Dual-channel transactional email delivery |

---

## 📁 Project Structure

```
HIRE_HUB/
├── backhand/                                 # Express Backend API
│   ├── controller/
│   │   ├── applicationcontroller.js          # Apply, bulk-reject, re-analyze, applicant status
│   │   ├── companycontro.js                  # Company CRUD, profile setup
│   │   ├── jobcontroller.js                  # Job CRUD, search, filters, alert toggles
│   │   ├── notificationcontroller.js         # In-app notifications
│   │   └── usercontroller.js                 # Auth, profile, saved jobs
│   ├── middleware/
│   │   ├── isAuthenticate.js                 # JWT cookie verification middleware
│   │   └── multer.js                         # File upload handling
│   ├── models/
│   │   ├── applicationmodel.js               # Application & AI ATS evaluation schema
│   │   ├── companymodel.js                   # Company schema
│   │   ├── jobmodel.js                       # Job listing schema
│   │   ├── notificationmodel.js              # Notification schema
│   │   └── usermodel.js                      # User schema (Student & Recruiter roles)
│   ├── route/                                # API routes (/user, /job, /company, /application)
│   ├── utils/
│   │   ├── resumeAnalyzer.js                 # 100-pt ATS evaluator & PDF text parser
│   │   ├── emailService.js                   # Dual-transport email delivery engine
│   │   ├── cloudinary.js                     # Cloudinary media configuration
│   │   └── db.js                             # MongoDB connection handler
│   └── index.js                              # Server bootstrap, CORS & cookie parser
│
├── frontend/                                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                        # Recruiter Command Center
│   │   │   │   ├── Adminjobs.jsx             # Job listings hero & 4 KPI cards
│   │   │   │   ├── AdminjobsTable.jsx        # Job table/grid views & quick actions
│   │   │   │   ├── Applicants.jsx            # Applicants page container & breadcrumbs
│   │   │   │   ├── ApplicantsTable.jsx       # Candidate ATS scoring table & filters
│   │   │   │   ├── AtsScoreDistribution.jsx  # 5-tier distribution & bulk-rejection tool
│   │   │   │   ├── AiEvaluationModal.jsx     # Deep AI evaluation breakdown modal
│   │   │   │   ├── Companies.jsx             # Enterprise company directory & 4 KPI cards
│   │   │   │   ├── Companiestable.jsx        # Company table/grid views & actions
│   │   │   │   ├── Dashboard.jsx             # Analytics dashboard with charts
│   │   │   │   └── Postjobs.jsx              # Job posting & editing form
│   │   │   ├── auth/                         # Login & Registration views
│   │   │   ├── shared/                       # Navbar, Footer & notification bell
│   │   │   ├── ui/                           # Reusable UI primitives (dialog, popover, badge)
│   │   │   ├── Appliedjob.jsx                # Candidate application status tracker
│   │   │   ├── Jobdexcription.jsx            # Job details & interactive ATS pre-check
│   │   │   └── Viewprofile.jsx               # Candidate profile & resume preview
│   │   ├── redux/                            # Redux slices (auth, job, company, notification)
│   │   ├── hooks/                            # Custom data fetching hooks
│   │   └── util/const.js                     # Endpoints & formatSalary helper
│   ├── index.html
│   └── vite.config.js
│
├── PROJECT_WALKTHROUGH.md                    # In-depth architectural documentation
├── package.json                              # Root scripts & dependencies
└── vercel.json                               # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/baymax-14/HIRE_HUB-main.git
cd HIRE_HUB-main
```

### 2. Setup Backend
```bash
cd backhand
npm install
cp .env.example .env
```
Edit `backhand/.env` with your credentials, then run:
```bash
npm run dev
# Backend runs on http://localhost:8000
```

### 3. Setup Frontend
Open a new terminal in the project root:
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backhand/.env`)
| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `8000`) |
| `MONOGOURL` | **Yes** | MongoDB connection string (Atlas or local) |
| `SECRET_KEY` | **Yes** | JWT signing secret |
| `CLOUD_NAME` | No | Cloudinary cloud name |
| `API_KEY` | No | Cloudinary API key |
| `API_SECRET` | No | Cloudinary API secret |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: `http://localhost:5173`) |
| `SMTP_HOST` | No | SMTP host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (`465` or `587`) |
| `SMTP_USER` | No | Sender email address |
| `SMTP_PASS` | No | SMTP App Password |
| `RESEND_API_KEY` | No | Resend HTTPS email fallback API key |
| `BREVO_API_KEY` | No | Brevo HTTPS email fallback API key |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | Backend API URL (default: `http://localhost:8000/api/v1`) |

---

## 📡 API Endpoints

### Authentication & Users — `/api/v1/user`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user (`student` or `recruiter`) |
| `POST` | `/login` | Authenticate user & issue HTTP-only JWT cookie |
| `GET` | `/logout` | Clear auth cookie |
| `POST` | `/profile/update` | Update profile, bio, skills, and upload resume |
| `POST` | `/save-job/:jobId` | Bookmark / unbookmark a job |
| `GET` | `/saved-jobs` | Get all bookmarked jobs |

### Companies — `/api/v1/company`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register an organization profile |
| `GET` | `/get` | Get recruiter's registered companies |
| `GET` | `/get/:id` | Get company details by ID |
| `PUT` | `/update/:id` | Update company profile, branding & website |
| `DELETE` | `/delete/:id` | Delete company and associated jobs |

### Jobs — `/api/v1/job`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/post` | Post a new job listing |
| `GET` | `/get` | Get all jobs (with search, location, salary & type filters) |
| `GET` | `/getadminjobs` | Get recruiter's posted jobs with application metadata |
| `GET` | `/get/:id` | Get job details by ID |
| `PUT` | `/update/:id` | Update job details, salary & requirements |
| `PUT` | `/toggle-alerts/:id` | Toggle candidate email notification alerts |
| `DELETE` | `/delete/:id` | Delete job posting & candidate records |

### Applications & ATS — `/api/v1/application`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/apply/:id` | Apply to a job (triggers automated AI ATS resume evaluation) |
| `GET` | `/get` | Get student's application history & statuses |
| `GET` | `/:id/applicants` | Get all applicants for a job with ATS scores |
| `POST` | `/status/:id/update` | Update candidate status (`accepted` / `rejected`) |
| `POST` | `/:jobId/bulk-reject` | **Bulk-reject candidates below an adjustable ATS threshold score** |
| `POST` | `/:id/reanalyze` | On-demand resume re-evaluation |

### Notifications & Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/notifications` | Get user notifications |
| `PATCH` | `/api/v1/notifications/:id/read` | Mark notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | Mark all notifications as read |
| `GET` | `/api/v1/analytics/dashboard` | Get recruiter analytics & hiring funnel stats |

---

## 🤖 AI ATS Resume Scoring Engine

HireHub uses a standardized **100-Point Evaluation Rubric** modeled after enterprise ATS platforms:

$$\text{ATS Score (100 pts)} = \text{Technical Skill Overlap (70 pts)} + \text{Practical Evidence (30 pts)}$$

| Component | Max Points | Evaluation Criteria |
|---|:---:|---|
| **Technical Skill Overlap** | **70 pts** | Exact & synonym matching against job requirements (regex word boundary matching) |
| **Engineering Projects & Portfolio** | **12 pts** | Identifies production verbs & architectures (`developed`, `built`, `deployed`, `frontend`, `backend`, `fullstack`) |
| **Real-World Experience** | **8 pts** | Identifies internships, work history, hackathons, and certifications |
| **Role Tenure & Experience Fit** | **5 pts** | Evaluates seniority alignment against the target role |
| **Verified Resume Text** | **5 pts** | Minimum valid characters extracted from uploaded PDF resume |

### Verdict Thresholds
* **80 – 100%**: ✅ **Highly Qualified** *(Top Match — strong skills & verifiable project delivery)*
* **60 – 79%**: 🟢 **Qualified** *(Solid match — meets core requirements with minor gaps)*
* **40 – 59%**: 🟡 **Partially Qualified** *(Foundation present — needs further experience)*
* **0 – 39%**: 🔴 **Not Qualified** *(Significant skill gap for this position)*

---

## 🚢 Deployment Guide (Render & Vercel)

### Architecture Overview
```
┌────────────────────────────────┐         Cross-Origin Requests (CORS + Cookies)        ┌────────────────────────────────┐
│         Vercel (Frontend)      │ ─────────────────────────────────────────────────────▶ │         Render (Backend)       │
│  https://your-app.vercel.app   │ ◀───────────────────────────────────────────────────── │ https://your-app.onrender.com  │
└────────────────────────────────┘                                                        └───────────────┬────────────────┘
                                                                                                          │
                                                                                                          ▼
                                                                                           ┌──────────────────────────────┐
                                                                                           │        MongoDB Atlas         │
                                                                                           │   mongodb+srv://...          │
                                                                                           └──────────────────────────────┘
```

1. **Deploy Backend to Render**:
   - Create a Web Service pointing to `backhand/`.
   - Build Command: `npm install`, Start Command: `npm start`.
   - Set environment variables (`MONOGOURL`, `SECRET_KEY`, `FRONTEND_URL`, `NODE_ENV=production`).
2. **Deploy Frontend to Vercel**:
   - Import the repository into Vercel.
   - Build Command: `npm run build`, Output Directory: `frontend/dist`.
   - Set `VITE_API_BASE_URL` to your Render API URL.
   - `vercel.json` automatically handles SPA client-side route rewrites.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React 19, Node.js, Express, MongoDB & AI**

⭐ Star this repository if you find it helpful!

</div>
