<div align="center">

# 🚀 HireHub — AI-Powered Talent Discovery & ATS Platform

**An enterprise-grade, full-stack recruitment ecosystem featuring autonomous AI ATS resume scoring, real-time competency gap analysis, Google Stitch design architecture, and end-to-end recruiter pipelines.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Design](https://img.shields.io/badge/Design-Google_Stitch-630ed4?style=for-the-badge&logoColor=white)](https://stitch.google)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Google Stitch Design Architecture](#-1-google-stitch-design-architecture)
  - [2. Next-Gen Job Profile & ATS Telemetry](#-2-next-gen-job-profile--ats-telemetry)
  - [3. AI-Powered ATS Resume Engine](#-3-ai-powered-ats-resume-engine)
  - [4. 5-Tier Applicant Distribution & Bulk Screening](#-4-5-tier-applicant-distribution--bulk-screening)
  - [5. Recruiter Command Center](#-5-recruiter-command-center)
  - [6. Multi-Channel Notifications & Resilient Delivery](#-6-multi-channel-notifications--resilient-delivery)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [AI ATS Resume Scoring Engine](#-ai-ats-resume-scoring-engine)
- [Deployment Guide (Render & Vercel)](#-deployment-guide-render--vercel)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**HireHub** bridges the gap between ambitious **Candidates (Job Seekers)** and **Recruiting Teams (Hiring Leaders)** through a cutting-edge interface and autonomous evaluation intelligence.

Built on **React 19**, **Node.js/Express 5**, and **MongoDB**, HireHub incorporates the **Google Stitch** design system, delivering micro-animated interactions, glassmorphism telemetry cards, and frictionless mobile-ready workflows.

### User Roles & Capabilities

| 👨‍💻 Job Seeker (Candidate) | 🏢 Recruiter (Hiring Manager) |
|---|---|
| Explore verified openings with live keyword, salary & location filters | Enterprise Company Directory with custom branding & logo uploads |
| **Autonomous ATS Pre-Flight Check** with donut score meter before applying | Post, edit & manage job listings with CTC/LPA compensation |
| **Instant 1-Click AI Apply** with saved resume or tailored PDF upload | **Recruiter Command Center** with 4 KPI overview cards & Table/Grid views |
| Skill alignment gap breakdown (Direct Matched vs Recommended Skills) | **5-Tier ATS Candidate Spectrum** (`1-20%` to `80-100%`) |
| Real-time application tracking dashboard (Pending, Accepted, Rejected) | **Adjustable Bulk-Screening Slider** with instant candidate rejections |
| Bookmark jobs to private saved list & copy shareable direct links | Deep **AI Evaluation Dossier** with resume text breakdown & re-analysis |
| In-app notification bell & automatic transactional email alerts | Real-time candidate analytics pipeline with Recharts visual charts |

---

## ✨ Key Features

### 🎨 1. Google Stitch Design Architecture
- **Curated Color Tokens** — Rich Iris/Violet primary (`#630ed4`), Indigo accents (`#4b41e1`), soft lilac canvas (`#faf8ff`), and emerald indicators (`#10b981`).
- **Typography Pairing** — *Plus Jakarta Sans* for editorial headlines, *Inter* for body readability, and *JetBrains Mono* for technical badges.
- **Ambient Lighting Effects** — Floating mesh orbs (`.orb-glow-1/2`), subtle radial grid textures, dynamic shimmer transitions (`.shimmer-fx`), and smooth card lifts.
- **Continuous Brand Marquee** — 32-second infinite CSS loop showcasing verified enterprise partner hiring badges.
- **Role-Aware Navigation** — Clean, uncluttered navbar offering role-specific pathways (`Find Jobs`, `My Applications`, `Dashboard`, `Companies`) with integrated recruiter guards.

### 🎯 2. Next-Gen Job Profile & ATS Telemetry (`/description/:id`)
- **Breadcrumb & Context Header** — Live department hierarchy, pulsing *"Actively Interviewing"* signal, and verified employer partner checks.
- **Role Header Hero Card** — Company logo avatar with gradient accents, compensation badge with formatted LPA/currency, location scope, applicant counters, and one-click bookmarking.
- **Autonomous ATS Pre-Flight Check**:
  - **Radial Donut Meter** — SVG circular chart calculating 0–100% fit score with percentile benchmarks.
  - **Skill Overlap Gauge** — Real-time progress bar computing direct requirement alignment.
  - **Verified vs. Recommended Skills Grid** — Visual pill badges highlighting matching strengths alongside high-yield keyword advice.
- **Two-Column Workspace**:
  - *Left Column (70%)*: Deep-dive role charter, mission & deliverables, candidate qualifications, verified tech stack tags, and a transparent 4-step interview timeline.
  - *Right Rail (30%)*: Sticky 1-Click Fast-Track application card, hiring manager leadership profile, total rewards overview, and similar role recommendations.
- **Interactive Application Modal** — One-click submit using saved profile resume or drag-and-drop tailored PDF upload with an optional executive pitch note.

### 🤖 3. AI-Powered ATS Resume Engine
- **Standardized 100-Point Rubric** — 70 points for exact & semantic skill alignment + 30 points for verifiable practical evidence (projects, certifications, tenure).
- **Synonym & Alias Awareness** — Matches technical equivalents seamlessly (e.g., `golang` ↔ `go`, `k8s` ↔ `kubernetes`, `react.js` ↔ `react`).
- **Automated PDF Parsing** — Server-side text extraction using `pdf-parse`.
- **Google Gemini AI Integration** — Optional `GEMINI_API_KEY` unlocks high-order semantic reasoning; falls back automatically to local NLP heuristics if omitted.

### 📊 4. 5-Tier Applicant Distribution & Bulk Screening
- **5 Score Performance Tiers** — Classifies candidates into:
  - `1-20%` *(Low Match)*
  - `20-40%` *(Partially Qualified)*
  - `40-60%` *(Moderate Fit)*
  - `60-80%` *(Qualified)*
  - `80-100%` *(Top Match)*
- **Interactive Cohort Filtering** — Click any tier card in the recruiter table to instantly isolate that applicant bracket.
- **Applicant Pool Spectrum** — Horizontal stacked progress bar visualizing the overall talent distribution.
- **Adjustable Bulk Rejection** — Cutoff score slider with quick presets (`<30%`, `<40%`) to reject underqualified candidates with automated email feedback.

### 🏢 5. Recruiter Command Center
- **4 Live KPI Metric Cards for Jobs** — Total Postings, Applications Received, Active Pipelines, and Alerts Status.
- **4 Live KPI Metric Cards for Companies** — Total Companies, Active Jobs Hosted, Actively Hiring count, and Branding Readiness.
- **Table vs. Cards Grid Switcher** — Instant toggle between dense data tables and card layouts.
- **Direct Applicant Pipeline** — One-click review buttons navigate straight to candidate dossiers.

### 📧 6. Multi-Channel Notifications & Resilient Delivery
- **In-App Notification Bell** — Unread count badge, real-time polling, and mark-all-as-read actions.
- **Dual-Channel Email Engine** — Sends status updates and recruiter confirmations via SMTP with automatic HTTPS fallback (Resend / Brevo) to circumvent cloud outbound port restrictions.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|:---:|---|
| **React** | 19 | Modern reactive component architecture |
| **Vite** | 6 | Ultra-fast dev server & production bundler |
| **Tailwind CSS** | 4 | Utility-first styling & design tokens |
| **Redux Toolkit** | ^2 | Centralized application state management |
| **Redux Persist** | ^6 | Persistent authentication across sessions |
| **React Router** | v7 | Client-side routing with `ProtectedRoute` |
| **Radix UI** | ^1 | Accessible headless UI primitives (Dialog, Popover) |
| **Framer Motion** | ^12 | Fluid micro-interactions & animated reveals |
| **Recharts** | ^3 | Recruiter hiring funnel analytics |
| **Lucide React** | ^0.5 | Modern icon library |
| **Sonner** | ^2 | Toast notification system |
| **Axios** | ^1 | Promise-based HTTP client with cookie support |

### Backend
| Technology | Version | Purpose |
|---|:---:|---|
| **Node.js (ESM)** | ≥ 18 | Scalable JavaScript runtime |
| **Express** | 5 | RESTful web framework |
| **MongoDB + Mongoose** | 8 | Document database with relational population |
| **JWT** | ^9 | Stateless HTTP-only cookie authentication |
| **bcryptjs** | ^3 | Salted password hashing |
| **Multer** | ^2 | Multipart form-data file uploads |
| **Cloudinary** | ^2 | Cloud media storage for logos & avatars |
| **pdf-parse** | ^2 | Server-side PDF text extraction |
| **Nodemailer** | ^10 | SMTP transactional email transport |
| **Axios** | ^1 | Fallback email dispatch via HTTPS APIs |

---

## 📁 Project Structure

```
HIRE_HUB/
├── backhand/                                 # Express Backend API
│   ├── controller/
│   │   ├── applicationcontroller.js          # Apply, bulk-reject, re-analyze, applicant status
│   │   ├── companycontro.js                  # Company CRUD, profile setup
│   │   ├── jobcontroller.js                  # Job CRUD, search filters, alert toggles, populated company
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
│   ├── route/                                # API routes (/user, /job, /company, /application, /notifications)
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
│   │   │   ├── shared/                       # Navbar, Footer & NotificationBell
│   │   │   ├── ui/                           # Reusable UI primitives (dialog, popover, badge)
│   │   │   ├── Appliedjob.jsx                # Candidate application status tracker
│   │   │   ├── Categoery.jsx                 # 8-discipline engineering category grid
│   │   │   ├── CompanyMarquee.jsx            # 32s infinite marquee partner showcase
│   │   │   ├── CtaBanner.jsx                 # Dual conversion CTA banners (Candidate & Recruiter)
│   │   │   ├── Herosection.jsx               # Stitch hero with floating live toasts & capsule search
│   │   │   ├── HowItWorks.jsx                # 3-step Autonomous Match Engine overview
│   │   │   ├── Jobdexcription.jsx            # Stitch Job Profile, ATS telemetry & 1-Click apply
│   │   │   ├── Latestjob.jsx                 # Curated latest jobs showcase
│   │   │   ├── Latestjobcard.jsx             # Modern job cards with tech pills & bookmarking
│   │   │   ├── Updateprofilejob.jsx          # Profile competencies & resume upload modal
│   │   │   └── Viewprofile.jsx               # Candidate profile dossier & applied job history
│   │   ├── redux/                            # Redux Toolkit slices (auth, job, company, notification)
│   │   ├── hooks/                            # Custom data fetching hooks
│   │   └── util/const.js                     # API endpoints & formatSalary helper
│   ├── index.html                            # Plus Jakarta Sans & Inter font loading
│   └── vite.config.js
│
├── vercel.json                               # Vercel deployment SPA rewrite configuration
├── render.yaml                               # Render infrastructure-as-code blueprint
└── package.json                              # Root monorepo scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier supported)
- **npm** ≥ 9.x

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/HIRE_HUB.git
cd HIRE_HUB
```

### 2. Setup the Backend
```bash
cd backhand
npm install
cp .env.example .env
# Configure your MongoDB URI and secrets in backhand/.env
npm run dev
# ✅ Backend running on http://localhost:8000
```

### 3. Setup the Frontend
Open a **new terminal window** in the project root:
```bash
cd frontend
npm install
npm run dev
# ✅ Frontend running on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `backhand/.env`

| Variable | Required | Description |
|---|:---:|---|
| `PORT` | No | Server port (default: `8000`) |
| `MONOGOURL` | **Yes** | MongoDB connection string (Atlas URI or local) |
| `SECRET_KEY` | **Yes** | JWT signing secret key |
| `FRONTEND_URL` | No | Allowed CORS origin (default: `http://localhost:5173`) |
| `GEMINI_API_KEY` | No | Google Gemini API key for advanced semantic evaluation |
| `CLOUD_NAME` | No | Cloudinary cloud name for image & resume storage |
| `API_KEY` | No | Cloudinary API key |
| `API_SECRET` | No | Cloudinary API secret |
| `SMTP_HOST` | No | SMTP host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (`465` for SSL, `587` for TLS) |
| `SMTP_USER` | No | Sender email address |
| `SMTP_PASS` | No | SMTP app password |
| `SMTP_FROM` | No | Display name/address for outgoing emails |

### Frontend — `frontend/.env`
| Variable | Required | Description |
|---|:---:|---|
| `VITE_API_BASE_URL` | **Yes** | Backend API base URL (default: `http://localhost:8000/api/v1`) |

---

## 📡 API Endpoints

### Authentication & Users — `/api/v1/user`
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/register` | ❌ | Register new candidate or recruiter |
| `POST` | `/login` | ❌ | Authenticate & issue HTTP-only JWT cookie |
| `GET` | `/logout` | ✅ | Clear authentication cookie |
| `POST` | `/profile/update` | ✅ | Update bio, skills, profile photo & resume |
| `POST` | `/saved-jobs/:id` | ✅ | Bookmark / unbookmark a job listing |
| `GET` | `/saved-jobs` | ✅ | Retrieve all saved jobs for current user |

### Companies — `/api/v1/company`
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/register` | ✅ | Register a new enterprise company profile |
| `GET` | `/get` | ✅ | Fetch companies registered by recruiter |
| `GET` | `/get/:id` | ✅ | Retrieve company details by ID |
| `PUT` | `/update/:id` | ✅ | Update company profile, branding & website |
| `DELETE` | `/delete/:id` | ✅ | Delete company and associated listings |

### Jobs — `/api/v1/job`
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/post` | ✅ | Create and publish a new job opening |
| `GET` | `/get` | ❌ | Fetch all jobs (keyword, location, salary & type filters) |
| `GET` | `/getadminjobs` | ✅ | Fetch recruiter's listings with application stats |
| `GET` | `/get/:id` | ❌ | Fetch detailed job opening (populates company & applications) |
| `PUT` | `/update/:id` | ✅ | Update job requirements, title, or compensation |
| `PUT` | `/toggle-alerts/:id` | ✅ | Toggle candidate email notification alerts |
| `DELETE` | `/delete/:id` | ✅ | Delete job listing & associated records |

### Applications & ATS — `/api/v1/application`
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/apply/:id` | ✅ | Submit application (triggers automated AI ATS parsing) |
| `GET` | `/get` | ✅ | Fetch candidate's active application history |
| `GET` | `/:id/applicants` | ✅ | Retrieve all applicants for a job with ATS scores |
| `POST` | `/status/:id/update` | ✅ | Update candidate status (`accepted` / `rejected`) |
| `POST` | `/:jobId/bulk-reject` | ✅ | Bulk-reject candidates below ATS score threshold |
| `POST` | `/:id/reanalyze` | ✅ | Re-run automated resume evaluation |

### Notifications & Analytics
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/notifications` | ✅ | Fetch in-app notifications |
| `PATCH` | `/api/v1/notifications/:id/read` | ✅ | Mark specific notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | ✅ | Mark all notifications as read |
| `GET` | `/api/v1/analytics/dashboard` | ✅ | Fetch recruiter analytics & hiring funnel stats |

---

## 🤖 AI ATS Resume Scoring Engine

HireHub implements a standardized **100-Point Evaluation Rubric** modeled after enterprise recruiting platforms:

$$\text{ATS Score (100 pts)} = \text{Technical Skill Overlap (70 pts)} + \text{Practical Evidence (30 pts)}$$

| Component | Max Points | Evaluation Criteria |
|---|:---:|---|
| **Technical Skill Overlap** | **70 pts** | Exact & synonym matching against requirements (regex boundary matching) |
| **Engineering Projects & Portfolio** | **12 pts** | Detection of production verbs (`developed`, `built`, `engineered`, `deployed`) |
| **Real-World Experience** | **8 pts** | Internships, work history, hackathons, and certifications |
| **Role Seniority & Tenure Fit** | **5 pts** | Evaluates seniority alignment against the target role requirement |
| **Verified Resume Text** | **5 pts** | Minimum valid characters extracted from uploaded PDF document |

### Score Verdict Thresholds

| Score Range | Verdict | Candidate Meaning |
|:---:|---|---|
| 80 – 100 | ✅ **Highly Qualified** | Top Match — strong skill coverage & verifiable delivery |
| 60 – 79 | 🟢 **Qualified** | Solid Match — meets core qualifications with minor gaps |
| 40 – 59 | 🟡 **Partially Qualified** | Foundation present — requires additional domain tenure |
| 0 – 39 | 🔴 **Not Qualified** | Significant skill gap for target position |

---

## 🚢 Deployment Guide (Render & Vercel)

```
┌──────────────────────────┐    CORS + Cookies    ┌──────────────────────────┐
│      Vercel (Frontend)   │ ──────────────────▶  │     Render (Backend)     │
│  https://app.vercel.app  │ ◀──────────────────  │ https://app.onrender.com │
└──────────────────────────┘                       └────────────┬─────────────┘
                                                                │
                                                                ▼
                                                   ┌────────────────────────┐
                                                   │      MongoDB Atlas     │
                                                   │  mongodb+srv://...     │
                                                   └────────────────────────┘
```

### Step 1 — Deploy Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backhand`.
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Configure environment variables (`MONOGOURL`, `SECRET_KEY`, `FRONTEND_URL`, etc.).

### Step 2 — Deploy Frontend (Vercel)
1. Import the repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Set `VITE_API_BASE_URL` to your Render backend API URL (e.g., `https://your-app.onrender.com/api/v1`).
5. `vercel.json` automatically manages client-side SPA route rewrites.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React 19, Express 5, MongoDB & Google Stitch Architecture**

⭐ Star this repository if you find it helpful!

</div>
