import { Search, MapPin, Sparkles, ArrowRight, Flame, CheckCircle, Zap, Briefcase, Building2, UserCheck, Star } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setsearchedQuery } from "@/redux/jobslice"
import { useNavigate } from "react-router-dom"

export default function Herosection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const searchHandler = (searchVal = query) => {
    const finalQuery = location ? `${searchVal} ${location}`.trim() : searchVal.trim()
    dispatch(setsearchedQuery(finalQuery))
    navigate("/jobs")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandler()
    }
  }

  const trendingTags = [
    "Remote Worldwide",
    "Frontend / React",
    "AI / LLM Engineers",
    "Full Stack",
    "Kubernetes & Cloud",
  ]

  return (
    <section className="relative w-full pt-8 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#faf8ff] via-[#f2f3ff]/70 to-[#faf8ff]">
      {/* Glowing Animated Mesh Gradient Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[840px] h-[460px] bg-gradient-to-br from-[#eaddff] via-[#7c3aed]/20 to-[#e2dfff] blur-[90px] opacity-60 rounded-full pointer-events-none orb-glow-1" />
      <div className="absolute top-48 -left-28 w-96 h-96 bg-[#c3c0ff]/50 blur-[90px] opacity-40 rounded-full pointer-events-none orb-glow-2" />
      <div className="absolute top-36 -right-24 w-[420px] h-[420px] bg-[#ffd9e4]/40 blur-[100px] opacity-35 rounded-full pointer-events-none orb-glow-1" />

      {/* Decorative subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e7ff25_1px,transparent_1px),linear-gradient(to_bottom,#e2e7ff25_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* FLOATING INTERACTIVE TOAST 1 (Top Left) */}
        <div className="hidden xl:flex absolute top-16 left-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl shadow-purple-500/5 float-card-1 text-left">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4 text-[#10b981]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs font-bold text-[#131b2e]">Ananya S.</span>
              <span className="text-[10px] text-[#10b981] font-semibold px-1 py-0.5 bg-emerald-500/10 rounded">Offered</span>
            </div>
            <p className="text-[11px] text-[#64748b]">Staff ML Engineer at Google • 4m ago</p>
          </div>
        </div>

        {/* FLOATING INTERACTIVE TOAST 2 (Top Right) */}
        <div className="hidden xl:flex absolute top-20 right-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl shadow-purple-500/5 float-card-2 text-left">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#4f46e5] flex items-center justify-center shrink-0 text-white">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs font-bold text-[#131b2e]">Instant ATS Match</span>
              <span className="text-[10px] text-[#7c3aed] font-bold px-1 py-0.5 bg-purple-500/10 rounded">99.4%</span>
            </div>
            <p className="text-[11px] text-[#64748b]">Profile synced with Stripe & Figma</p>
          </div>
        </div>

        {/* Live Indicator Pill with glowing ripple dot */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/50 shadow-xs backdrop-blur-md mb-6 hover:border-purple-300 transition-colors">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981] ring-4 ring-emerald-500/20" />
          </span>
          <span className="text-xs sm:text-[13px] text-[#131b2e] flex items-center gap-1.5 font-medium">
            <span className="text-[#64748b]">Next-Gen AI Career Discovery</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#7c3aed] font-bold tracking-tight">14,200+ Verified Openings</span>
          </span>
          <Sparkles className="w-4 h-4 text-[#7c3aed] animate-pulse" />
        </div>

        {/* Editorial High-Contrast Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-[68px] leading-[1.1] tracking-[-0.035em] text-[#131b2e] max-w-4xl mx-auto font-black mb-3">
          Find, Match & Land Your <br className="hidden sm:inline" />
          <span className="gradient-animate-text bg-gradient-to-r from-[#630ed4] via-[#7c3aed] via-[#645efb] to-[#4b41e1] bg-clip-text text-transparent drop-shadow-xs">
            Dream Engineering Role
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-[#4a4455] max-w-2xl mt-4 mb-8 font-normal tracking-tight leading-relaxed">
          Autonomous AI skill screening, instant ATS score calibration, and verified salary transparency across hyper-growth unicorns and Fortune 500 engineering teams.
        </p>

        {/* Clean & Seamless Unified Search Pill Container */}
        <div className="w-full max-w-4xl bg-white border border-gray-200/80 shadow-lg rounded-full p-2 flex items-center transition-all duration-300 relative z-20 hover:border-purple-300 focus-within:border-purple-400 focus-within:shadow-xl focus-within:shadow-purple-500/5">
          {/* Role / Query Input */}
          <div className="flex-1 flex items-center gap-3 pl-4 pr-3 min-w-0">
            <Search className="w-5 h-5 text-[#7c3aed] shrink-0" />
            <input
              type="text"
              id="role-query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Role, skills, or company..."
              className="w-full bg-transparent border-0 p-0 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-medium"
            />
          </div>

          {/* Slim Vertical Divider */}
          <div className="w-px h-8 bg-gray-200 shrink-0" />

          {/* Location Input */}
          <div className="flex-1 flex items-center gap-3 px-3 sm:px-4 min-w-0">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              id="location-query-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Location or Remote"
              className="w-full bg-transparent border-0 p-0 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-medium"
            />
          </div>

          {/* Search CTA Button */}
          <button
            onClick={() => searchHandler()}
            id="search-cta-button"
            className="px-6 sm:px-7 py-3 bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] text-white rounded-full text-sm sm:text-base font-bold shadow-md shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shimmer-fx group whitespace-nowrap"
          >
            <span>Search Jobs</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Interactive Active Filters & Trending Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-[#64748b]">
          <span className="text-[#64748b] flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold font-mono">
            <Flame className="w-3.5 h-3.5 text-[#7c3aed]" /> Trending:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag)
                searchHandler(tag)
              }}
              className="px-3 py-1 rounded-full bg-white/80 border border-[#f1f5f9] text-[#131b2e] hover:border-purple-300 hover:text-[#7c3aed] transition-all text-xs font-medium cursor-pointer shadow-xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 4 Live Metrics Counters with modern borders and gradient badges */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 sm:mt-16 pt-2">
          {/* Metric 1 */}
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#f1f5f9] shadow-xs flex flex-col items-center justify-center text-center card-glow-hover group">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center mb-2.5 text-[#7c3aed] group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-heading text-2xl lg:text-3xl text-[#131b2e] font-extrabold tracking-tight">14,200+</span>
            <span className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mt-1">Verified Tech Jobs</span>
          </div>

          {/* Metric 2 */}
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#f1f5f9] shadow-xs flex flex-col items-center justify-center text-center card-glow-hover group">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-2.5 text-[#4f46e5] group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-heading text-2xl lg:text-3xl text-[#131b2e] font-extrabold tracking-tight">920+</span>
            <span className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mt-1">Vetted Tech Unicorns</span>
          </div>

          {/* Metric 3 */}
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#f1f5f9] shadow-xs flex flex-col items-center justify-center text-center card-glow-hover group">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2.5 text-[#10b981] group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="font-heading text-2xl lg:text-3xl text-[#131b2e] font-extrabold tracking-tight">52,000+</span>
            <span className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mt-1">Offers Extended</span>
          </div>

          {/* Metric 4 */}
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#f1f5f9] shadow-xs flex flex-col items-center justify-center text-center card-glow-hover group">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center mb-2.5 text-[#f59e0b] group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <span className="font-heading text-2xl lg:text-3xl text-[#131b2e] font-extrabold tracking-tight flex items-center gap-1">
              4.9<span className="text-base text-slate-400 font-normal font-sans">/5</span>
            </span>
            <span className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mt-1">Candidate Trust Score</span>
          </div>
        </div>
      </div>
    </section>
  )
}
