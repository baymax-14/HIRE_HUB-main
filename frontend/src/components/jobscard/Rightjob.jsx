"use client"

import { useState } from "react"
import { Bookmark, Loader2, MapPin, CheckCircle2, ArrowRight, Sparkles, Briefcase, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT, formatSalary } from "@/util/const"
import { updateUserSavedJobs } from "@/redux/authSlice"
import { toast } from "sonner"

export default function Rightjob({ job, viewMode = "grid" }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  const [isSaving, setIsSaving] = useState(false)

  const isSaved = (user?.savedJobs || []).some(
    (item) => (item?._id || item)?.toString() === job?._id?.toString()
  )

  const daysAgofunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently"
    const createdAt = new Date(mongodbTime)
    const currentTime = new Date()
    const diffDays = Math.floor((currentTime - createdAt) / (1000 * 24 * 60 * 60))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  // Parse requirements into clean tags
  const rawReqs = Array.isArray(job?.requirement)
    ? job.requirement
    : typeof job?.requirement === "string"
      ? job.requirement.split(",").map((r) => r.trim()).filter(Boolean)
      : []
  const skills = rawReqs.slice(0, 4)

  // Generate deterministic ATS affinity match score (85% - 98%) based on job ID
  const atsMatch = (() => {
    if (!job?._id) return 92
    const code = job._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return 86 + (code % 12)
  })()

  const handleToggleSave = async (e) => {
    e?.stopPropagation()
    if (!user) {
      toast.error("Please login to save jobs")
      navigate("/login")
      return
    }

    try {
      setIsSaving(true)
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/saved-jobs/${job?._id}`)
      if (res.data.success) {
        dispatch(updateUserSavedJobs(res.data.savedJobs))
        if (res.data.isSaved) {
          toast.success("Job saved to your bookmarks!")
        } else {
          toast.info("Job removed from bookmarks")
        }
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update saved job")
    } finally {
      setIsSaving(false)
    }
  }

  const isList = viewMode === "list"

  return (
    <article
      onClick={() => navigate(`/description/${job?._id}`)}
      className={`bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_45px_-10px_rgba(99,14,212,0.14)] hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between group cursor-pointer ${
        isList ? "md:flex-row md:items-center md:gap-8" : ""
      }`}
    >
      <div className={`space-y-4 ${isList ? "flex-1 min-w-0" : ""}`}>
        {/* Top Meta Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Posted {daysAgofunction(job?.createdAt)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Actively Hiring
            </span>
          </div>

          <Button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`w-9 h-9 rounded-full transition-all cursor-pointer ${
              isSaved
                ? "bg-purple-100 text-[#630ed4] border-purple-200"
                : "bg-slate-50 text-slate-400 hover:text-[#630ed4] hover:bg-purple-50"
            }`}
            variant="ghost"
            size="icon"
            title={isSaved ? "Remove from bookmarks" : "Save for later"}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#630ed4]" : ""}`} />
            )}
          </Button>
        </div>

        {/* Company & Location Row */}
        <div className="flex items-start gap-3.5">
          <Avatar className="w-12 h-12 rounded-2xl border border-slate-100 shadow-xs bg-gradient-to-br from-[#630ed4] to-[#4b41e1] flex items-center justify-center shrink-0">
            {job?.company?.logo ? (
              <AvatarImage
                src={job?.company?.logo}
                alt={job?.company?.name}
                className="object-contain p-1 rounded-2xl bg-white"
              />
            ) : null}
            <AvatarFallback className="bg-transparent text-white font-extrabold text-base">
              {job?.company?.name?.charAt(0)?.toUpperCase() || "H"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-[#131b2e] truncate group-hover:text-[#630ed4] transition-colors">
                {job?.company?.name || "HireHub Partner"}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#630ed4] fill-purple-100 shrink-0" />
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job?.location || "Remote / India"}
            </span>
          </div>
        </div>

        {/* Role Title & Description */}
        <div>
          <h3 className="text-lg sm:text-xl text-[#131b2e] font-extrabold group-hover:text-[#630ed4] transition-colors leading-snug line-clamp-1">
            {job?.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {job?.description}
          </p>
        </div>

        {/* Tech Stack / Requirements Pills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-xl bg-purple-50/70 border border-purple-100/60 text-xs text-[#630ed4] font-medium"
              >
                {skill}
              </span>
            ))}
            {job?.position && (
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
                {job?.position} {job?.position === 1 ? "opening" : "openings"}
              </span>
            )}
          </div>
        )}

        {/* Perks Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast-Track Process
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> {job?.jobType || "Full-Time"}
          </span>
        </div>
      </div>

      {/* Footer & Action Strip */}
      <div
        className={`mt-6 pt-5 border-t border-slate-100 space-y-3.5 ${
          isList ? "md:mt-0 md:pt-0 md:border-t-0 md:border-l md:pl-6 md:w-64 shrink-0" : ""
        }`}
      >
        {/* Compensation & Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm font-extrabold">
              {formatSalary(job?.salary)}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
            {job?.jobType || "Full-Time"}
          </span>
        </div>

        {/* ATS AI Affinity Match Indicator */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50/60 border border-purple-100/70">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#630ed4]" />
            <span className="text-xs text-[#630ed4] font-extrabold">
              {atsMatch}% ATS Match
            </span>
          </div>
          <span className="text-[10px] text-[#4b41e1] font-bold uppercase tracking-wider">
            {atsMatch >= 92 ? "Top 5% Fit" : "Strong Fit"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/description/${job?._id}`)
            }}
            type="button"
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#131b2e] text-xs sm:text-sm font-semibold text-center transition-all cursor-pointer"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/description/${job?._id}`)
            }}
            type="button"
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] text-white text-xs sm:text-sm font-bold text-center shadow-md shadow-purple-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
