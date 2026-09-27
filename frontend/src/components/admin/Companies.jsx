import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import CompanisTable from "./Companiestable";
import UsegetAllcompanies from "@/hooks/usegetAllcompanies";
import Usegetalladminjobs from "@/hooks/usegetAlladminjobs";
import { useSelector } from "react-redux";
import {
  Building2,
  Briefcase,
  TrendingUp,
  Globe,
  Plus,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Companies() {
  UsegetAllcompanies();
  Usegetalladminjobs();
  const navigate = useNavigate();

  const { companies = [] } = useSelector((store) => store.company);
  const { alladminjob = [] } = useSelector((store) => store.job);

  // Compute KPI statistics
  const totalCompanies = companies.length;
  
  // Total jobs across all user's companies
  const totalJobsHosted = alladminjob.length;

  // Companies that have at least 1 job posted
  const hiringCompaniesCount = companies.filter((c) =>
    alladminjob.some((j) => j?.company?._id === c._id || j?.company === c._id)
  ).length;

  // Companies with completed profile (logo + website)
  const completeProfilesCount = companies.filter(
    (c) => c.logo && c.website
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
              <span>Enterprise Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
              Registered Companies
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Manage your registered employer organizations, branding assets, headquarters, and associated job openings.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/jobs")}
              className="rounded-xl text-xs sm:text-sm font-semibold border-gray-200 hover:bg-gray-50 h-10 px-3.5 cursor-pointer flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span>View All Jobs</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/companies/create")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-sm h-10 px-4 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Company</span>
            </Button>
          </div>
        </div>

        {/* ── KPI OVERVIEW STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Companies */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {totalCompanies}
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Registered Companies
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Organizations in workspace
              </div>
            </div>
          </div>

          {/* Card 2: Total Jobs Hosted */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {totalJobsHosted}
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Active Job Postings
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Across all company profiles
              </div>
            </div>
          </div>

          {/* Card 3: Hiring Activity */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {hiringCompaniesCount}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  / {totalCompanies}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Actively Hiring
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Companies with live jobs
              </div>
            </div>
          </div>

          {/* Card 4: Complete Profiles */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {completeProfilesCount}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  Verified
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">
                Branding Ready
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Logo & website configured
              </div>
            </div>
          </div>
        </div>

        {/* ── COMPANIES TABLE & GRID COMPONENT ── */}
        <CompanisTable />
      </div>
    </div>
  );
}
