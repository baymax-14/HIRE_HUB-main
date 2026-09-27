import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import AdminjobsTable from "./AdminjobsTable";
import { Plus, Briefcase, Users, TrendingUp, Bell, Building2, Sparkles } from "lucide-react";
import Usegetalladminjobs from "@/hooks/usegetAlladminjobs";
import { useSelector } from "react-redux";

export default function Jobsadmin() {
  Usegetalladminjobs();
  const navigate = useNavigate();
  const { alladminjob = [] } = useSelector((store) => store.job);

  // Compute KPI statistics
  const totalJobs = alladminjob.length;
  const totalApplicants = alladminjob.reduce((acc, job) => {
    return acc + (Array.isArray(job?.application) ? job.application.length : 0);
  }, 0);
  const jobsWithApplicants = alladminjob.filter(
    (job) => Array.isArray(job?.application) && job.application.length > 0
  ).length;
  const activeAlertsCount = alladminjob.filter(
    (job) => job?.emailAlerts !== false
  ).length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto my-6 sm:my-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ── HERO HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-2.5 py-1 rounded-full w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recruiter Command Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
              Job Listings & Pipelines
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Manage your active postings, track incoming applicant pipelines, and review AI-driven ATS qualifications in one place.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="rounded-xl text-xs sm:text-sm font-semibold border-gray-200 hover:bg-gray-50 h-10 px-3.5 cursor-pointer flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-gray-600" />
              <span>Companies</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-sm h-10 px-4 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Button>
          </div>
        </div>

        {/* ── KPI METRIC STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Jobs */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {totalJobs}
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Total Job Postings
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Live in recruiter portal
              </div>
            </div>
          </div>

          {/* Card 2: Total Applicants */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {totalApplicants}
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Candidate Applications
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Across all job postings
              </div>
            </div>
          </div>

          {/* Card 3: Active Pipelines */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {jobsWithApplicants}
                <span className="text-xs font-normal text-gray-400 ml-1">/ {totalJobs}</span>
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Active Pipelines
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Jobs with applicants
              </div>
            </div>
          </div>

          {/* Card 4: Email Alerts */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {activeAlertsCount}
                <span className="text-xs font-normal text-gray-400 ml-1">Active</span>
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Instant Email Alerts
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {totalJobs - activeAlertsCount} listings muted
              </div>
            </div>
          </div>
        </div>

        {/* ── JOBS TABLE & GRID ── */}
        <AdminjobsTable />
      </div>
    </div>
  );
}