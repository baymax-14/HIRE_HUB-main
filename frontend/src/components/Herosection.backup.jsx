import { Search, MapPin, Sparkles, ArrowRight, TrendingUp, Users, Building2, Briefcase } from "lucide-react"
import { Button } from "./ui/button"
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

  const trendingTags = ["Remote", "Frontend", "React", "Full Stack", "Data Science", "DevOps"]

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-radial-gradient">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-400/20 to-indigo-400/20 blur-3xl rounded-full" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Smart Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/60 shadow-xs mb-6 sm:mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-xs sm:text-sm font-semibold text-purple-900 tracking-wide">
            AI-Powered Career Matching • 10,000+ Jobs Live
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.15] mb-6">
          Find, Match & Land Your <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Dream Career
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed">
          Explore curated opportunities from fast-growing startups and Fortune 500 giants. 
          Screened with AI and ready for your next big step.
        </p>

        {/* Combined Dual Search Box */}
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl shadow-purple-500/5 border border-gray-200/80 hover:border-purple-300 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Keyword Search */}
            <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, skills, or company..."
                className="w-full bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 outline-none border-none font-medium"
              />
            </div>

            <div className="hidden sm:block w-px h-7 bg-gray-200" />

            {/* Location Search */}
            <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-[220px]">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Location (e.g. Remote, Delhi)"
                className="w-full bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 outline-none border-none font-medium"
              />
            </div>

            {/* Search Submit Button */}
            <Button
              onClick={() => searchHandler()}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-6 rounded-xl sm:rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs sm:text-sm text-gray-500">
          <span className="font-semibold text-gray-700 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> Trending:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag)
                searchHandler(tag)
              }}
              className="px-3 py-1 rounded-full bg-gray-100/90 hover:bg-purple-100 hover:text-purple-700 text-gray-600 transition-colors duration-150 cursor-pointer font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Live Social Proof & Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-12 sm:mt-16 pt-8 border-t border-gray-200/70">
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-1.5 text-purple-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">12,500+</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Verified Jobs</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">850+</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Top Companies</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-1.5 text-pink-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">45,000+</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Placed Candidates</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-500 mb-1">
              <span className="text-base">⭐</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">4.9/5</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Candidate Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
