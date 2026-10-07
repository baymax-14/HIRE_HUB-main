import { useNavigate } from "react-router-dom"
import { Badge } from "./ui/badge"
import { MapPin, Briefcase, IndianRupee, ArrowUpRight, Bookmark, Loader2 } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import axios from "axios"
import { USER_API_END_POINT, formatSalary } from "@/util/const"
import { updateUserSavedJobs } from "@/redux/authSlice"
import { toast } from "sonner"

export default function Latestjobcard({ job }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  const [isSaving, setIsSaving] = useState(false)

  const isSaved = (user?.savedJobs || []).some(
    (item) => (item?._id || item)?.toString() === job?._id?.toString()
  )

  const handleToggleSave = async (e) => {
    e?.stopPropagation()
    if (!user) {
      toast.error("Please login to bookmark jobs")
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
      toast.error(err.response?.data?.message || "Failed to update bookmark")
    } finally {
      setIsSaving(false)
    }
  }

  // Generate a predictable gradient for company avatar based on company name
  const companyName = job?.company?.name || "Company"
  const companyInitial = companyName.charAt(0).toUpperCase()

  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-rose-500 to-orange-500",
    "from-emerald-500 to-teal-600",
    "from-blue-600 to-cyan-500",
    "from-purple-600 to-pink-500",
  ]
  const gradientIndex = companyName.charCodeAt(0) % gradients.length
  const selectedGradient = gradients[gradientIndex]

  // Calculate days ago
  const calculateDaysAgo = (timeData) => {
    if (!timeData) return "Just now"
    const createdAt = new Date(timeData)
    const currentTime = new Date()
    const timeDiff = currentTime - createdAt
    const days = Math.floor(timeDiff / (1000 * 24 * 60 * 60))
    if (days === 0) return "Posted today"
    if (days === 1) return "Posted 1d ago"
    return `Posted ${days}d ago`
  }

  // Derive tech stack pills from requirements or title
  const techPills = Array.isArray(job?.requirements) && job.requirements.length > 0
    ? job.requirements.slice(0, 3)
    : ["React", "Node.js", "TypeScript"]

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="bg-white p-6 rounded-3xl border border-[#f1f5f9] shadow-xs card-glow-hover flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Top Header: Company Avatar + Name & Location + Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {job?.company?.logo ? (
              <img
                src={job.company.logo}
                alt={companyName}
                className="w-12 h-12 rounded-2xl object-contain border border-[#f1f5f9] p-1 bg-white shadow-2xs"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedGradient} text-white font-extrabold flex items-center justify-center text-xl shadow-md font-heading`}
              >
                {companyInitial}
              </div>
            )}
            <div>
              <h4 className="font-heading font-bold text-base text-[#131b2e] leading-tight flex items-center gap-1.5 group-hover:text-[#630ed4] transition-colors">
                {companyName}
                <span className="w-4 h-4 rounded-full bg-[#630ed4]/10 text-[#630ed4] flex items-center justify-center text-[10px]">
                  ✓
                </span>
              </h4>
              <div className="flex items-center gap-1 text-xs text-[#64748b] font-mono mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#4b41e1] shrink-0" />
                <span className="truncate max-w-[140px]">{job?.location || "Remote"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isSaving}
            aria-label="Save job"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? "bg-[#630ed4]/10 text-[#630ed4]"
                : "bg-[#f2f3ff] text-[#64748b] hover:bg-[#eaedff] hover:text-[#630ed4]"
            }`}
            title={isSaved ? "Remove bookmark" : "Save for later"}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#630ed4]" : ""}`} />
            )}
          </button>
        </div>

        {/* Job Title & Snippet */}
        <h3 className="font-heading font-bold text-lg text-[#131b2e] group-hover:text-[#630ed4] transition-colors line-clamp-1">
          {job?.title}
        </h3>
        <p className="text-sm text-[#4a4455] mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {job?.description}
        </p>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {techPills.map((tech, i) => (
            <span
              key={i}
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#f2f3ff] text-[#4a4455] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Compensation and tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#f1f5f9]">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-mono text-xs font-bold flex items-center">
            <IndianRupee className="w-3 h-3 mr-0.5 inline-block" />
            {formatSalary(job?.salary)}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#131b2e] font-mono text-xs font-medium">
            {job?.jobType || "Full-Time"}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#630ed4]/10 text-[#630ed4] font-mono text-[11px] font-semibold">
            {job?.position || 1} {job?.position === 1 ? "Opening" : "Openings"}
          </span>
        </div>
      </div>

      {/* Footer: Posted time + Apply Now */}
      <div className="mt-5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
        <span className="font-mono text-xs text-[#64748b]">
          {calculateDaysAgo(job?.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-[#630ed4] font-bold group-hover:gap-2 transition-all">
          <span>Apply Now</span>
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  )
}
