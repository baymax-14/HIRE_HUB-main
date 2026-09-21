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

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
    >
      <div>
        {/* Top Header: Company Avatar + Name & Location + Action Icon */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {job?.company?.logo ? (
              <img
                src={job.company.logo}
                alt={companyName}
                className="w-11 h-11 rounded-xl object-contain border border-gray-100 p-1 bg-white shadow-2xs"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedGradient} text-white font-extrabold flex items-center justify-center text-lg shadow-sm`}
              >
                {companyInitial}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
                {companyName}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate max-w-[140px]">{job?.location || "India"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={isSaving}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isSaved
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-50 text-gray-400 hover:bg-purple-50 hover:text-purple-600"
              }`}
              title={isSaved ? "Remove bookmark" : "Save for later"}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-purple-700" : ""}`} />
              )}
            </button>
            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-700 transition-all shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Job Title & Snippet */}
        <div className="mb-4">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors line-clamp-1">
            {job?.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-normal">
            {job?.description}
          </p>
        </div>
      </div>

      {/* Badges footer */}
      <div className="pt-3 border-t border-gray-100/90 flex flex-wrap items-center gap-1.5">
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none text-[11px] font-semibold px-2 py-0.5"
        >
          <Briefcase className="w-3 h-3 mr-1" />
          {job?.position || 1} {job?.position === 1 ? "Opening" : "Openings"}
        </Badge>

        <Badge
          variant="secondary"
          className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-none text-[11px] font-semibold px-2 py-0.5"
        >
          {job?.jobType || "Full-Time"}
        </Badge>

        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none text-[11px] font-bold px-2 py-0.5 ml-auto flex items-center"
        >
          <IndianRupee className="w-3 h-3 mr-0.5 inline-block" />
          {formatSalary(job?.salary)}
        </Badge>
      </div>
    </div>
  )
}
