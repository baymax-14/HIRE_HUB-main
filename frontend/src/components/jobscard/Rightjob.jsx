"use client"

import { useState } from "react"
import { Bookmark, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { updateUserSavedJobs } from "@/redux/authSlice"
import { toast } from "sonner"

export default function Rightjob({ job }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  const [isSaving, setIsSaving] = useState(false)

  const isSaved = (user?.savedJobs || []).some(
    (item) => (item?._id || item)?.toString() === job?._id?.toString()
  )

  const daysAgofunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime)
    const currentTime = new Date()
    const timedifference = currentTime - createdAt
    return Math.floor(timedifference / (1000 * 24 * 60 * 60))
  }

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

  return (
    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {daysAgofunction(job?.createdAt) === 0 ? "Today" : `${daysAgofunction(job?.createdAt)} days ago`}
          </p>
          <Button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`rounded-full cursor-pointer transition-all duration-200 ${
              isSaved
                ? "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                : "text-gray-400 hover:text-purple-600 hover:bg-purple-50"
            }`}
            variant="outline"
            size="icon"
            title={isSaved ? "Remove from bookmarks" : "Save for later"}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-purple-600" : ""}`} />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3 my-3">
          <Avatar className="w-10 h-10 rounded-xl border border-gray-100 shadow-2xs">
            <AvatarImage src={job?.company?.logo || "/placeholder.svg"} className="object-contain p-0.5" />
          </Avatar>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
              {job?.company?.name || "Company"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{job?.location || "India"}</p>
          </div>
        </div>

        <div className="my-2">
          <h1 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1">{job?.title}</h1>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">{job?.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
          <Badge className="text-blue-700 bg-blue-50 border-blue-100 font-semibold text-xs" variant="secondary">
            {job?.position} Positions
          </Badge>
          <Badge className="text-orange-600 bg-orange-50 border-orange-100 text-xs" variant="secondary">
            {job?.jobType}
          </Badge>
          <Badge className="text-purple-700 bg-purple-50 border-purple-100 font-bold text-xs" variant="secondary">
            {job?.salary} LPA
          </Badge>
        </div>
      </div>

      <div className="flex mt-5 items-center gap-2 sm:gap-3 pt-3 border-t border-gray-100">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="text-xs sm:text-sm flex-1 cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
        >
          View Details
        </Button>
        <Button
          onClick={handleToggleSave}
          disabled={isSaving}
          className={`text-xs sm:text-sm cursor-pointer transition-colors ${
            isSaved
              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
              : "bg-[#7209b7] hover:bg-[#5f1a87] text-white"
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isSaved ? (
            "Bookmarked"
          ) : (
            "Save For Later"
          )}
        </Button>
      </div>
    </div>
  )
}
