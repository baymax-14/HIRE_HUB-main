<div align="center">

# 🚀 HireHub — Smart AI-Powered Job Portal

**A full-stack job search & recruitment platform with AI resume analysis, real-time notifications, and a recruiter analytics dashboard.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [AI Resume Analyzer](#-ai-resume-analyzer)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**HireHub** is a modern, full-stack job portal that connects **job seekers** with **recruiters**. It features an intelligent **AI-powered ATS (Applicant Tracking System)** that automatically evaluates resumes against job requirements, providing match scores, skill gap analysis, and actionable feedback — powered by either **Google Gemini AI** or a built-in **local NLP engine**.

### Two User Roles

| 👨‍💻 Job Seeker (Student) | 🏢 Recruiter |
|---|---|
| Browse & search jobs | Register companies |
| Apply with resume upload | Post & manage job listings |
| Track application status | Review applicants with AI scores |
| Save jobs for later | Accept/reject candidates |
| Profile management with skills | Analytics dashboard with charts |
| Email & in-app notifications | Hiring funnel & ATS insights |

---

## ✨ Features

### 🎯 Core
- **Job Search & Filtering** — Search by title, keyword, location, salary range, and job type
- **One-Click Apply** — Apply to jobs with resume upload (PDF support)
- **Application Tracking** — Real-time status updates (Pending → Accepted / Rejected)
- **Saved Jobs** — Bookmark jobs for later

### 🤖 AI-Powered ATS
- **Automatic Resume Evaluation** — Every application is scored automatically on submission
- **Dual Engine Architecture** — Google Gemini AI (primary) with local NLP fallback
- **Skill Gap Analysis** — Identifies matching and missing skills against job requirements
- **ATS Score (0-100)** — Quantified candidate-job alignment with verdict labels
- **Resume PDF Parsing** — Extracts and analyzes text content from uploaded PDF resumes

### 📊 Recruiter Dashboard
- **At-a-Glance Stats** — Total jobs, companies, applicants, and avg ATS score
- **Hiring Funnel** — Visual breakdown of pending/accepted/rejected applications
- **ATS Score Distribution** — Bar chart showing candidate quality distribution
- **Applications Timeline** — 7-day trend chart of incoming applications
- **Top Jobs** — Most applied-to positions at a glance
- **Recent Activity Feed** — Latest applicant actions

### 📧 Email Notifications
- **Welcome Email** — Sent on user registration
- **Application Confirmation** — Sent to applicant upon successful submission
- **New Applicant Alert** — Sent to recruiter when someone applies
- **Status Update Email** — Sent to applicant when accepted/rejected
- **Flexible Transporter** — Supports real SMTP, Ethereal preview, and dev console mode

### 🔔 In-App Notifications
- Real-time notification bell with unread count
- Mark as read / mark all as read
- Notification types: `application_received`, `status_update`, `new_job`

### 🖼️ File Uploads
- **Profile Photos** — Cloudinary or local storage
- **Resumes** — PDF upload with Multer (10 MB limit)
- **Company Logos** — Image upload for branding

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **Redux Persist** | Persisted auth state |
| **React Router v7** | Client-side routing |
| **Radix UI** | Accessible headless components (Dialog, Popover, Select, Avatar) |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Dashboard charts & graphs |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express 5** | Web framework |
| **MongoDB + Mongoose 8** | Database & ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Cloudinary** | Cloud image storage |
| **Nodemailer** | Email service |
| **pdf-parse** | Resume PDF text extraction |
| **Google Gemini API** | AI resume evaluation (optional) |

---

## 📁 Project Structure

```
HIRE_HUB/
├── frontend/                    # React + Vite frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Recruiter panel
│   │   │   │   ├── Dashboard.jsx        # Analytics dashboard
│   │   │   │   ├── Adminjobs.jsx        # Job management
│   │   │   │   ├── Applicants.jsx       # Applicant review
│   │   │   │   ├── ApplicantsTable.jsx  # Applicant list with ATS scores
│   │   │   │   ├── AiEvaluationModal.jsx# AI evaluation details modal
│   │   │   │   ├── Companies.jsx        # Company management
│   │   │   │   ├── Postjobs.jsx         # Job posting form
│   │   │   │   └── ProtectedRoute.jsx   # Auth guard
│   │   │   ├── auth/            # Login & Signup pages
│   │   │   ├── jobscard/        # Job listing cards
│   │   │   ├── shared/          # Navbar & shared components
│   │   │   ├── ui/              # Reusable UI primitives (shadcn/ui)
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Herosection.jsx  # Hero with search bar
│   │   │   ├── Viewprofile.jsx  # User profile page
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   ├── redux/               # Redux slices & store
│   │   ├── lib/                 # Utility functions
│   │   └── util/                # Constants & helpers
│   ├── .env.example             # Frontend env template
│   └── vite.config.js
│
├── backhand/                    # Node.js + Express backend
│   ├── controller/
│   │   ├── usercontroller.js        # Auth, profile, saved jobs
│   │   ├── jobcontroller.js         # CRUD jobs, search, filters
│   │   ├── applicationcontroller.js # Apply, status, AI evaluation
│   │   ├── companycontro.js         # Company CRUD
│   │   ├── notificationcontroller.js# In-app notifications
│   │   └── analyticscontroller.js   # Dashboard aggregation stats
│   ├── models/
│   │   ├── usermodel.js         # User schema (student/recruiter)
│   │   ├── jobmodel.js          # Job listing schema
│   │   ├── applicationmodel.js  # Application + AI evaluation
│   │   ├── companymodel.js      # Company schema
│   │   └── notificationmodel.js # Notification schema
│   ├── route/                   # Express route definitions
│   ├── middleware/
│   │   ├── isAuthenticate.js    # JWT auth middleware
│   │   ├── multer.js            # File upload config
│   │   └── asyncHandler.js      # Async error wrapper
│   ├── utils/
│   │   ├── resumeAnalyzer.js    # AI/NLP resume evaluation engine
│   │   ├── emailService.js      # Email templates & transporter
│   │   ├── cloudinary.js        # Cloudinary config
│   │   ├── db.js                # MongoDB connection
│   │   ├── datauri.js           # File-to-DataURI converter
│   │   ├── fileHandler.js       # Local file storage handler
│   │   └── seedData.js          # Database seeding script
│   ├── .env.example             # Backend env template
│   └── index.js                 # Server entry point
│
├── package.json                 # Root package (frontend scripts)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/HIRE_HUB.git
cd HIRE_HUB
```

### 2. Setup Backend

```bash
cd backhand
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables) below).

Start the backend server:

```bash
npm run dev
```

> The server runs on `http://localhost:8000` by default.

### 3. Setup Frontend

Open a new terminal:

```bash
# From the project root
npm install
```

Create the frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

Start the development server:

```bash
npm run dev
```

> The frontend runs on `http://localhost:5173` by default.

### 4. Open in Browser

Navigate to **http://localhost:5173** — you're all set! 🎉

---

## 🔐 Environment Variables

### Backend (`backhand/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `8000`) |
| `MONOGOURL` | **Yes** | MongoDB connection string |
| `SECRET_KEY` | **Yes** | JWT signing secret |
| `CLOUD_NAME` | No | Cloudinary cloud name |
| `API_KEY` | No | Cloudinary API key |
| `API_SECRET` | No | Cloudinary API secret |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: `http://localhost:5173`) |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI resume evaluation |
| `SMTP_HOST` | No | SMTP server host for real email delivery |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP auth username |
| `SMTP_PASS` | No | SMTP auth password |
| `SMTP_FROM` | No | Sender email address |

> **💡 Tip:** The app works fully without Cloudinary (uses local file storage), without Gemini (uses local NLP engine), and without SMTP (logs emails to console).

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | Backend API URL (default: `http://localhost:8000/api/v1`) |

---

## 📡 API Endpoints

### Authentication & Users — `/api/v1/user`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive JWT |
| `GET` | `/logout` | Logout (clear cookie) |
| `POST` | `/profile/update` | Update profile (with file upload) |
| `POST` | `/save-job/:jobId` | Toggle save/unsave a job |
| `GET` | `/saved-jobs` | Get all saved jobs |

### Companies — `/api/v1/company`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new company |
| `GET` | `/get` | Get recruiter's companies |
| `GET` | `/get/:id` | Get company by ID |
| `PUT` | `/update/:id` | Update company details |

### Jobs — `/api/v1/job`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/post` | Post a new job listing |
| `GET` | `/get` | Get all jobs (with filters) |
| `GET` | `/getadminjobs` | Get recruiter's own jobs |
| `GET` | `/get/:id` | Get job by ID |

### Applications — `/api/v1/application`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/apply/:id` | Apply to a job |
| `GET` | `/get` | Get user's applications |
| `GET` | `/:id/applicants` | Get job applicants (recruiter) |
| `POST` | `/status/:id/update` | Update application status |

### Notifications — `/api/v1/notifications`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get user's notifications |
| `PATCH` | `/:id/read` | Mark notification as read |
| `PATCH` | `/read-all` | Mark all as read |

### Analytics — `/api/v1/analytics`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Get recruiter dashboard stats |

---

## 🤖 AI Resume Analyzer

HireHub features a **dual-engine resume evaluation system** that runs automatically when a candidate applies:

```
┌─────────────────────────────────────────────────────┐
│                Application Submitted                 │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Extract PDF Text │  ◄── pdf-parse
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐     ╔═══════════════════╗
              │  Gemini API Key  │────▶║  Google Gemini AI  ║
              │  configured?     │ Yes ║  (Primary Engine)  ║
              └────────┬────────┘     ╚═══════════════════╝
                       │ No / Fails
                       ▼
              ╔═══════════════════╗
              ║  Local NLP Engine  ║
              ║  (Smart Fallback)  ║
              ╚═══════════════════╝
                       │
                       ▼
              ┌─────────────────┐
              │   ATS Result     │
              │  • Score (0-100) │
              │  • Verdict       │
              │  • Matching Skills│
              │  • Missing Skills │
              │  • Strengths     │
              │  • Concerns      │
              └─────────────────┘
```

### Verdict Scale

| Score | Verdict |
|---|---|
| 80 – 100 | ✅ Highly Qualified |
| 60 – 79 | 🟢 Qualified |
| 40 – 59 | 🟡 Partially Qualified |
| 0 – 39 | 🔴 Not Qualified |

---

## 🖼️ Screenshots

> _Add screenshots of your application here._
>
> Suggested screenshots:
> - Landing page / Hero section
> - Job listings with filters
> - Job description & apply modal
> - User profile page
> - Recruiter dashboard with charts
> - AI evaluation modal
> - Applicants table with ATS scores

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

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

**Built with ❤️ using React, Node.js, MongoDB & AI**

⭐ Star this repo if you found it helpful!

</div>
