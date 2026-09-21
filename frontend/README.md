# 🎨 HireHub Frontend

Modern, responsive client application for **HireHub**, built with React 19, Vite 6, and Tailwind CSS 4.

---

## ⚡ Tech Stack

- **Framework**: React 19 + Vite 6
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4 + Lucide Icons
- **State Management**: Redux Toolkit + Redux Persist
- **UI Components**: Radix UI primitives (`@radix-ui/react-*`), Sonner (Toasts)
- **Charts & Dashboards**: Recharts
- **Animations**: Framer Motion

---

## 🚀 Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Configure API base URL in .env
# VITE_API_BASE_URL=http://localhost:8000/api/v1

# 4. Start local development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 🏗️ Production Build

```bash
npm run build
```

The compiled output is generated in the `dist/` directory, ready for deployment on **Vercel**, **Netlify**, or any static CDN. SPA client-side routes are configured in `vercel.json`.

---

## 📂 Key Directories

```
src/
├── components/
│   ├── admin/           # Recruiter panel (Dashboard, Job posting, Applicants, ATS Review)
│   ├── auth/            # Sign In / Sign Up flows
│   ├── jobscard/        # Job cards, filter sidebar, search UI
│   ├── shared/          # Navbar, Footer, Notifications popover
│   ├── ui/              # Radix UI + Tailwind styled primitives
│   └── Appliedjob.jsx   # Candidate's applied jobs & ATS re-evaluation drawer
├── hooks/               # Custom data-fetching & auth hooks
├── redux/               # Redux slices (auth, jobs, applications, company)
└── util/                # Constants and API endpoint configs
```
