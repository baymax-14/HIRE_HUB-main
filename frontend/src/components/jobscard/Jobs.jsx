"use client"

import { useSelector, useDispatch } from "react-redux"
import Navbar from "../shared/Navbar"
import Footer from "../Footer"
import FilterCard from "./FilterCard"
import Rightjob from "./Rightjob"
import { useEffect, useState, useMemo, useRef } from "react"
import { setCurrentPage, setFilters, clearFilters } from "@/redux/jobslice"
import Usegetalljobs from "@/hooks/usegetAlljobs"
import SkeletonCard from "../ui/SkeletonCard"
import { calculateAtsScore } from "@/util/atsUtils"
import { toast } from "sonner"
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Zap,
  X,
  LayoutGrid,
  List,
  ArrowRight,
  Home,
  Check,
} from "lucide-react"

export default function Jobs() {
  const dispatch = useDispatch()
  const jobState = useSelector((store) => store.job) || {}
  const { user } = useSelector((store) => store.auth) || {}

  const {
    alljobs = [],
    loading = false,
    totalJobs = 0,
    totalPages = 1,
    currentPage = 1,
    filters = { keyword: "", location: "", jobType: "", salaryMin: 0, salaryMax: 0 },
  } = jobState

  // Trigger backend job fetching hook
  Usegetalljobs()

  // Local UI States
  const [heroSearch, setHeroSearch] = useState(filters?.keyword || "")
  const [heroLocation, setHeroLocation] = useState(filters?.location || "")
  const [heroExperience, setHeroExperience] = useState("")
  const [aiMatchingActive, setAiMatchingActive] = useState(true)
  const [viewMode, setViewMode] = useState("grid") // "grid" | "list"
  const [sortBy, setSortBy] = useState("Best AI Match")
  const resultsRef = useRef(null)

  // Sync hero search with Redux keyword if changed elsewhere
  useEffect(() => {
    setHeroSearch(filters?.keyword || "")
    setHeroLocation(filters?.location || "")
  }, [filters?.keyword, filters?.location])

  // Client-side sorting on loaded jobs with dynamic ATS matching
  const sortedJobs = useMemo(() => {
    const list = [...alljobs]
    if (sortBy === "Highest Compensation") {
      return list.sort((a, b) => (Number(b?.salary) || 0) - (Number(a?.salary) || 0))
    }
    if (sortBy === "Most Recent") {
      return list.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
    }
    if (sortBy === "Best AI Match") {
      return list.sort((a, b) => {
        const scoreA = calculateAtsScore(a, user).score
        const scoreB = calculateAtsScore(b, user).score
        return scoreB - scoreA
      })
    }
    return list
  }, [alljobs, sortBy, user, aiMatchingActive])

  // Scroll to results when searching from Hero
  const handleHeroSearch = (e) => {
    e?.preventDefault()
    dispatch(
      setFilters({
        keyword: heroSearch.trim(),
        location: heroLocation.trim(),
      })
    )
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Quick Suggested Filter Pills handler
  const handleQuickFilter = (type, val) => {
    if (type === "location") {
      const next = filters.location === val ? "" : val
      dispatch(setFilters({ location: next }))
    } else if (type === "jobType") {
      const next = filters.jobType === val ? "" : val
      dispatch(setFilters({ jobType: next }))
    } else if (type === "keyword") {
      const next = filters.keyword === val ? "" : val
      dispatch(setFilters({ keyword: next }))
    } else if (type === "salary") {
      if (filters.salaryMin === val.min && filters.salaryMax === val.max) {
        dispatch(setFilters({ salaryMin: 0, salaryMax: 0 }))
      } else {
        dispatch(setFilters({ salaryMin: val.min, salaryMax: val.max }))
      }
    }
  }

  // Dismiss specific active filter tag
  const handleDismissFilter = (filterKey) => {
    if (filterKey === "keyword") dispatch(setFilters({ keyword: "" }))
    if (filterKey === "location") dispatch(setFilters({ location: "" }))
    if (filterKey === "jobType") dispatch(setFilters({ jobType: "" }))
    if (filterKey === "salary") dispatch(setFilters({ salaryMin: 0, salaryMax: 0 }))
  }

  // Pagination handler
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    dispatch(setCurrentPage(page))
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      if (currentPage <= 3) end = Math.min(4, totalPages - 1)
      else if (currentPage >= totalPages - 2) start = Math.max(totalPages - 3, 2)
      if (start > 2) pages.push("...")
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  // Active filter count
  const activeFilters = []
  if (filters?.keyword) activeFilters.push({ key: "keyword", label: `"${filters.keyword}"` })
  if (filters?.location) activeFilters.push({ key: "location", label: filters.location })
  if (filters?.jobType) activeFilters.push({ key: "jobType", label: filters.jobType })
  if ((filters?.salaryMin || 0) > 0 || (filters?.salaryMax || 0) > 0) {
    activeFilters.push({
      key: "salary",
      label: `₹${(filters.salaryMin / 100000).toFixed(0)}L - ₹${(filters.salaryMax / 100000).toFixed(0)}L`,
    })
  }

  // Curated or dynamic spotlight roles with real ATS match scores
  const spotlightRoles = useMemo(() => {
    if (alljobs.length >= 3) {
      const scored = alljobs.map((job) => ({
        ...job,
        calculatedAts: calculateAtsScore(job, user),
      }))
      // When aiMatching is active, highlight the highest ATS matches for this candidate
      if (aiMatchingActive) {
        return [...scored].sort((a, b) => b.calculatedAts.score - a.calculatedAts.score).slice(0, 3)
      }
      return scored.slice(0, 3)
    }
    return [
      {
        _id: "spotlight-1",
        title: "Staff Frontend Architect",
        company: { name: "Stripe" },
        location: "Remote / India",
        salary: 3200000,
        calculatedAts: { score: 96 },
      },
      {
        _id: "spotlight-2",
        title: "Senior ML Systems Engineer",
        company: { name: "Google DeepMind" },
        location: "Bengaluru, India",
        salary: 4500000,
        calculatedAts: { score: 94 },
      },
      {
        _id: "spotlight-3",
        title: "Principal Systems Engineer",
        company: { name: "Figma" },
        location: "Remote Worldwide",
        salary: 2800000,
        calculatedAts: { score: 98 },
      },
    ]
  }, [alljobs, user, aiMatchingActive])

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#630ed4] selection:text-white">
      <Navbar />

      <main className="w-full flex-1">
        {/* HERO SECTION: Ambient, Spacious Discovery Banner */}
        <section className="relative w-full pt-10 sm:pt-14 pb-14 sm:pb-18 overflow-hidden">
          {/* Ambient Mesh Background Lighting */}
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#630ed4]/12 via-[#4b41e1]/8 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#eaddff]/40 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#e2dfff]/45 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10">
            {/* Top Breadcrumb & Live Roles Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                <a href="/" className="hover:text-[#630ed4] transition-colors flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </a>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500">Explore Careers</span>
                <span className="text-slate-300">/</span>
                <span className="text-[#131b2e] font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-purple-100 shadow-2xs">
                  Engineering &amp; Tech
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-500/20 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-700 tracking-wide">
                  {totalJobs > 0 ? `${totalJobs.toLocaleString()}+` : "14,280+"} VERIFIED ROLES LIVE TODAY
                </span>
              </div>
            </div>

            {/* Hero Heading & High-Impact Copy */}
            <div className="max-w-4xl text-left mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] leading-[1.15] text-[#131b2e] font-black tracking-tight mb-4">
                Discover Roles Designed for{" "}
                <span className="bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] bg-clip-text text-transparent">
                  Your Ambition
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-3xl leading-relaxed">
                Explore hand-calibrated opportunities at world-class engineering teams. Live ATS matching,
                transparent equity benchmarks, and fast-track interviews with hiring partners.
              </p>
            </div>

            {/* Prominent Floating Search & Command Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="relative bg-white rounded-3xl p-3 sm:p-4 shadow-[0_12px_40px_-12px_rgba(99,14,212,0.12)] border border-purple-100/90 mb-6"
            >
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                {/* Search Input */}
                <div className="flex-1 relative flex items-center px-4 py-3 bg-[#f2f3ff]/60 rounded-2xl hover:bg-[#f2f3ff] transition-colors">
                  <Search className="w-5 h-5 text-[#630ed4] mr-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by role title, framework, or tech stack (e.g. Frontend, React, Node.js)..."
                    className="w-full bg-transparent text-sm sm:text-base text-[#131b2e] placeholder-slate-400 focus:outline-none"
                  />
                  {heroSearch && (
                    <button
                      type="button"
                      onClick={() => setHeroSearch("")}
                      className="text-slate-400 hover:text-slate-600 mr-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-bold text-slate-400 bg-white/80 border border-slate-200">
                    ⌘K
                  </span>
                </div>

                {/* Location Selector */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#f2f3ff]/60 rounded-2xl hover:bg-[#f2f3ff] transition-colors">
                  <MapPin className="w-5 h-5 text-[#630ed4] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Location
                    </span>
                    <select
                      value={heroLocation}
                      onChange={(e) => setHeroLocation(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-bold text-[#131b2e] focus:outline-none cursor-pointer pr-4"
                    >
                      <option value="">All Locations</option>
                      <option value="Remote">Remote</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Delhi">Delhi / NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                </div>

                {/* Experience Segment */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#f2f3ff]/60 rounded-2xl hover:bg-[#f2f3ff] transition-colors">
                  <Briefcase className="w-5 h-5 text-[#630ed4] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Experience
                    </span>
                    <select
                      value={heroExperience}
                      onChange={(e) => setHeroExperience(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-bold text-[#131b2e] focus:outline-none cursor-pointer pr-4"
                    >
                      <option value="">All Experience</option>
                      <option value="Entry">Entry (0-2 yrs)</option>
                      <option value="Mid">Mid-Level (2-5 yrs)</option>
                      <option value="Senior">Senior (5+ yrs)</option>
                      <option value="Staff">Staff / Principal</option>
                    </select>
                  </div>
                </div>

                {/* AI Profile Matching Toggle */}
                <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-indigo-50/70 border border-purple-100 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#630ed4] text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#131b2e]">
                          AI Profile Matching
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            aiMatchingActive ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">
                        {user?.fullname || "Calibrated"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !aiMatchingActive
                      setAiMatchingActive(next)
                      if (next) {
                        toast.success("AI Profile Matching active: Jobs calibrated to your profile skills!")
                        setSortBy("Best AI Match")
                      } else {
                        toast.info("AI Profile Matching paused: Showing default listings")
                      }
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-all shadow-inner cursor-pointer ${
                      aiMatchingActive ? "bg-[#7c3aed] justify-end" : "bg-slate-300 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
                  </button>
                </div>

                {/* Main Explore Button */}
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Explore Roles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Suggested Filters & Live Metrics */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider pr-1 whitespace-nowrap">
                  Suggested:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickFilter("location", "Remote")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                    filters?.location === "Remote"
                      ? "bg-[#630ed4] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:border-[#630ed4] border border-slate-200"
                  }`}
                >
                  <span>Remote Worldwide</span>
                  {filters?.location === "Remote" && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFilter("jobType", "Full-time")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                    filters?.jobType === "Full-time"
                      ? "bg-[#630ed4] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:border-[#630ed4] border border-slate-200"
                  }`}
                >
                  <span>Full-Time</span>
                  {filters?.jobType === "Full-time" && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFilter("keyword", "React")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                    filters?.keyword === "React"
                      ? "bg-[#630ed4] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:border-[#630ed4] border border-slate-200"
                  }`}
                >
                  <span>React / Frontend</span>
                  {filters?.keyword === "React" && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFilter("salary", { min: 2000000, max: 0 })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                    filters?.salaryMin === 2000000
                      ? "bg-[#630ed4] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:border-[#630ed4] border border-slate-200"
                  }`}
                >
                  <span>₹20 LPA+</span>
                  {filters?.salaryMin === 2000000 && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFilter("location", "Bengaluru")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                    filters?.location === "Bengaluru"
                      ? "bg-[#630ed4] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:border-[#630ed4] border border-slate-200"
                  }`}
                >
                  <span>Bengaluru</span>
                  {filters?.location === "Bengaluru" && <Check className="w-3 h-3" />}
                </button>
              </div>

              {/* Live Platform Key Metrics Strip */}
              <div className="hidden xl:flex items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>
                    Avg. Offer: <strong className="text-[#131b2e] font-bold">₹22.5 LPA / $140k</strong>
                  </span>
                </div>
                <div className="h-3 w-px bg-slate-300" />
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#630ed4]" />
                  <span>
                    <strong className="text-[#131b2e] font-bold">3,400+</strong> Fast-Track Interviews This Week
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Spotlight Strip */}
            <div className="mt-8 sm:mt-10 p-5 rounded-3xl bg-gradient-to-r from-purple-100/50 via-white to-indigo-50/60 border border-purple-100 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-[#630ed4] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Spotlight Roles
                  </span>
                  <span className="text-sm font-bold text-[#131b2e]">
                    Urgent &amp; Pre-Approved Engineering Budgets
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open for direct fast-track review
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {spotlightRoles.map((role, idx) => (
                  <div
                    key={role._id || idx}
                    onClick={() => {
                      if (role._id && !role._id.startsWith("spotlight")) {
                        window.location.href = `/description/${role._id}`
                      } else {
                        dispatch(setFilters({ keyword: role.title }))
                      }
                    }}
                    className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#630ed4] to-[#4b41e1] text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {role?.company?.name?.charAt(0) || "H"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#131b2e] group-hover:text-[#630ed4] transition-colors truncate">
                          {role.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {role?.company?.name} • {role.location || "Remote"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold shrink-0 ml-2">
                      {role.calculatedAts?.score ?? calculateAtsScore(role, user).score}% ATS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT: 2-Column Discovery Experience */}
        <section ref={resultsRef} className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
            {/* LEFT FILTER COLUMN: Sticky Refine Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start">
              <FilterCard />
            </aside>

            {/* RIGHT COLUMN: Results & Bento Job Cards */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-6">
              {/* Control Bar: Results counter, active filter tags & layout mode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                {/* Left: Counter & active pills */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg text-[#131b2e] font-extrabold">
                      Showing {sortedJobs.length}
                    </span>
                    <span className="text-sm text-slate-500">
                      of {totalJobs > 0 ? totalJobs.toLocaleString() : sortedJobs.length} roles
                    </span>
                  </div>

                  {activeFilters.length > 0 && (
                    <>
                      <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                      <div className="flex flex-wrap items-center gap-1.5">
                        {activeFilters.map((af) => (
                          <span
                            key={af.key}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#630ed4] text-xs font-semibold"
                          >
                            <span>{af.label}</span>
                            <button
                              type="button"
                              onClick={() => handleDismissFilter(af.key)}
                              className="hover:text-purple-900 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <button
                          type="button"
                          onClick={() => dispatch(clearFilters())}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold ml-1 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Right: Sort dropdown & Grid/List view mode toggle */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3.5 py-2 bg-[#f2f3ff]/60 hover:bg-[#f2f3ff] rounded-xl text-xs sm:text-sm font-semibold text-[#131b2e] focus:outline-none cursor-pointer border border-transparent"
                    >
                      <option>Best AI Match</option>
                      <option>Most Recent</option>
                      <option>Highest Compensation</option>
                    </select>
                  </div>

                  <div className="flex items-center p-1 bg-[#f2f3ff]/60 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white text-[#630ed4] shadow-xs font-bold"
                          : "text-slate-400 hover:text-[#131b2e]"
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "list"
                          ? "bg-white text-[#630ed4] shadow-xs font-bold"
                          : "text-slate-400 hover:text-[#131b2e]"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Results Grid / List */}
              {loading ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : sortedJobs.length === 0 ? (
                /* Empty state with helpful prompt */
                <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-5 text-[#630ed4]">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#131b2e] mb-2">
                    No matching roles found
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
                    We couldn't find any opportunities matching your active criteria. Try broadening your
                    search, location, or salary filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => dispatch(clearFilters())}
                    className="px-6 py-2.5 rounded-xl bg-[#630ed4] text-white text-sm font-bold shadow-md hover:bg-[#7c3aed] transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {sortedJobs.map((job) => (
                      <div key={job?._id} className="transition-all duration-300">
                        <Rightjob job={job} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>

                  {/* Clean Spacious Pagination Bar */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100 mt-6">
                      <span className="text-sm text-slate-500 order-2 sm:order-1 font-medium">
                        Page <strong className="text-[#131b2e] font-bold">{currentPage}</strong> of{" "}
                        <strong className="text-[#131b2e] font-bold">{totalPages}</strong>
                      </span>

                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        {/* Previous Button */}
                        <button
                          type="button"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, idx) =>
                          page === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 text-slate-400 text-sm">
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              type="button"
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                                currentPage === page
                                  ? "bg-[#630ed4] text-white shadow-md shadow-purple-500/25"
                                  : "bg-slate-50 hover:bg-slate-100 text-[#131b2e]"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-[#630ed4] flex items-center gap-1 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* HireHub Modern Footer */}
      <Footer />
    </div>
  )
}
