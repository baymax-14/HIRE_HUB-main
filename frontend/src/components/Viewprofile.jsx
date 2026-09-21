import {
  Contact,
  Mail,
  Pen,
  LogOut,
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Bell,
  BellOff,
  Sparkles,
  Bookmark,
  Trash2,
  Briefcase,
  MapPin,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Camera,
} from "lucide-react"
import Navbar from "./shared/Navbar"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import Appliedjob from "./Appliedjob"
import { useState, useRef, useEffect } from "react"
import Updateprofile from "./Updateprofilejob"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setuser, updateUserSavedJobs } from "@/redux/authSlice"
import useGetAllAppliedJobs from "@/hooks/useGetAllappliejobs"

export default function Viewprofile() {
  const [open, setOpen] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [togglingNotifications, setTogglingNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState("applied")
  const [savedJobsList, setSavedJobsList] = useState([])
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false)
  const [removingSavedId, setRemovingSavedId] = useState(null)
  const fileInputRef = useRef(null)
  const photoInputRef = useRef(null)

  const { user } = useSelector((store) => store.auth)
  const { allappliedjobs } = useSelector((store) => store.job)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isresume = !!user?.profile?.resume

  useGetAllAppliedJobs()

  // Calculate ATS Profile Strength (0 - 100)
  const skillsCount = user?.profile?.skills?.length || 0
  let profileStrength = 0
  if (isresume) profileStrength += 35
  if (skillsCount >= 5) profileStrength += 35
  else if (skillsCount >= 3) profileStrength += 25
  else if (skillsCount >= 1) profileStrength += 15
  if (user?.profile?.bio) profileStrength += 15
  if (user?.phoneNumber && user?.email) profileStrength += 15
  profileStrength = Math.min(100, profileStrength)

  // Fetch saved jobs when saved tab is selected
  const fetchSavedJobs = async () => {
    try {
      setLoadingSavedJobs(true)
      axios.defaults.withCredentials = true
      const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`)
      if (res.data.success) {
        setSavedJobsList(res.data.savedJobs || [])
      }
    } catch (err) {
      console.error("fetchSavedJobs error:", err)
    } finally {
      setLoadingSavedJobs(false)
    }
  }

  useEffect(() => {
    if (activeTab === "saved" && user?.role === "student") {
      fetchSavedJobs()
    }
  }, [activeTab, user?.role])

  const handleRemoveSavedJob = async (jobId) => {
    try {
      setRemovingSavedId(jobId)
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/saved-jobs/${jobId}`)
      if (res.data.success) {
        setSavedJobsList((prev) => prev.filter((j) => (j._id || j) !== jobId))
        dispatch(updateUserSavedJobs(res.data.savedJobs))
        toast.info("Job removed from bookmarks")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove saved job")
    } finally {
      setRemovingSavedId(null)
    }
  }

  const toggleGlobalEmailNotifications = async () => {
    const currentState = user?.profile?.emailNotifications !== false
    const newState = !currentState
    try {
      setTogglingNotifications(true)
      const formData = new FormData()
      formData.append("emailNotifications", newState)
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData)
      if (res.data.success) {
        dispatch(setuser(res.data.user))
        toast.success(
          newState
            ? "Applicant email alerts enabled for your account"
            : "Applicant email alerts muted. New applicants will only show on your dashboard."
        )
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to update notification setting")
    } finally {
      setTogglingNotifications(false)
    }
  }

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      })

      if (res.data.success) {
        dispatch(setuser(null))
        dispatch({ type: "auth/logout" })
        navigate("/")
        toast.success(res.data.message || "Logged out successfully")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(error?.response?.data?.message || "Failed to log out")
    }
  }

  // Direct fast resume upload from profile page
  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file for your resume")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("fullname", user?.fullname || "")
    formData.append("email", user?.email || "")
    formData.append("phoneNumber", user?.phoneNumber || "")

    try {
      setUploadingResume(true)
      toast.info("Uploading and processing resume...")
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.data.success) {
        dispatch(setuser(res.data.user))
        toast.success("Resume uploaded successfully! Recruiters and ATS can now evaluate your profile.")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to upload resume")
    } finally {
      setUploadingResume(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Direct fast profile picture upload by clicking avatar
  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)")
      return
    }

    const formData = new FormData()
    formData.append("profilePhoto", file)
    formData.append("fileType", "profilephoto")

    try {
      setUploadingPhoto(true)
      toast.info("Uploading profile picture...")
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.data.success) {
        dispatch(setuser(res.data.user))
        toast.success("Profile picture updated successfully!")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to upload profile picture")
    } finally {
      setUploadingPhoto(false)
      if (photoInputRef.current) photoInputRef.current.value = ""
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 my-3 sm:my-5 mx-4 sm:mx-auto shadow-xs">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Interactive Profile Picture with Quick Upload */}
            <div
              className="relative group cursor-pointer"
              onClick={() => photoInputRef.current?.click()}
              title="Click to change profile picture"
            >
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border shadow-xs transition-transform group-hover:scale-105">
                <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} className="object-cover" />
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingPhoto ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md transition-colors sm:flex hidden"
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handlePhotoFileChange}
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-gray-900">{user?.fullname}</h1>
                <Badge variant="outline" className="text-xs capitalize font-semibold bg-purple-50 text-purple-700 border-purple-200">
                  {user?.role || "Student"}
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-gray-500 mt-0.5">{user?.profile?.bio || "No bio added yet"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setOpen(true)} className="flex-1 sm:flex-none cursor-pointer">
              <Pen className="w-4 h-4 mr-2" />
              <span>Edit Profile</span>
            </Button>
            <Button
              variant="outline"
              onClick={logouthandler}
              className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </Button>
          </div>
        </div>

        {/* ── ATS Profile Health & Readiness Meter (Candidates) ── */}
        {user?.role === "student" && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white border border-purple-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Profile Strength & ATS Readiness
                  </h3>
                  <p className="text-xs text-gray-500">
                    Calculated from your uploaded resume, technical competencies, and bio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge
                  variant="outline"
                  className={`text-xs font-bold ${
                    profileStrength >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : profileStrength >= 50
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {profileStrength >= 80 ? "All-Star Profile" : profileStrength >= 50 ? "Intermediate Profile" : "Incomplete Profile"}
                </Badge>
                <span className="font-black text-sm text-gray-900">{profileStrength}%</span>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-2.5 bg-gray-200/80 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  profileStrength >= 80
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : profileStrength >= 50
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                      : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{ width: `${profileStrength}%` }}
              />
            </div>

            {/* Recommendations */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 pt-1 border-t border-purple-100/60">
              <div className="flex items-center gap-1">
                <CheckCircle2 className={`w-3.5 h-3.5 ${isresume ? "text-emerald-600" : "text-gray-300"}`} />
                <span>Resume Uploaded ({isresume ? "+35%" : "0%"})</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className={`w-3.5 h-3.5 ${skillsCount >= 5 ? "text-emerald-600" : "text-gray-300"}`} />
                <span>5+ Skills Listed ({skillsCount >= 5 ? "+35%" : skillsCount >= 3 ? "+25%" : "+15%"})</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className={`w-3.5 h-3.5 ${user?.profile?.bio ? "text-emerald-600" : "text-gray-300"}`} />
                <span>Bio & Contact ({user?.profile?.bio ? "+30%" : "+15%"})</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 sm:mt-6 border-t pt-4">
          <div className="flex items-center gap-3 my-2 text-gray-700">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span className="text-sm sm:text-base break-all">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2 text-gray-700">
            <Contact className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">Skills</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              className="text-xs text-purple-700 hover:text-purple-900 cursor-pointer h-7"
            >
              + Add Skills
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user?.profile?.skills.map((items, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100">
                  {items}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">No skills added. Click 'Edit Profile' to add skills.</span>
            )}
          </div>
        </div>

        {/* Recruiter Email Alert Notification Settings */}
        {user?.role === "recruiter" && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" />
              <span>Notification Preferences</span>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-purple-50/50 border border-purple-100 gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Applicant Email Notifications
                  </span>
                  {user?.profile?.emailNotifications !== false ? (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px]">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-200 text-gray-600 text-[10px]">
                      Muted
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 max-w-lg leading-relaxed">
                  Receive an automated email alert when a candidate applies to any of your jobs. Mute this if you prefer checking candidates only through the platform.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={togglingNotifications}
                onClick={toggleGlobalEmailNotifications}
                className={`rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                  user?.profile?.emailNotifications !== false
                    ? "bg-white text-purple-700 border-purple-200 hover:bg-purple-50 shadow-2xs"
                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {togglingNotifications ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : user?.profile?.emailNotifications !== false ? (
                  <BellOff className="w-3.5 h-3.5 mr-1 text-gray-500" />
                ) : (
                  <Bell className="w-3.5 h-3.5 mr-1 text-purple-600" />
                )}
                <span>
                  {user?.profile?.emailNotifications !== false ? "Mute All Email Alerts" : "Enable Email Alerts"}
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Dedicated Resume Section with Direct Upload */}
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="font-bold text-base text-gray-900">Your Resume (ATS Evaluated)</Label>
              <p className="text-xs text-gray-500">Recruiters will use this resume to assess your qualification for job applications.</p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleResumeFileChange}
              accept="application/pdf"
              className="hidden"
            />
          </div>

          {isresume ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-gray-900 break-all">
                      {user?.profile?.resumeOriginalName || "Resume.pdf"}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-xs text-emerald-700 font-medium">Ready for ATS Matching & Job Applications</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={user?.profile?.resume}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex-1 sm:flex-none"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Resume
                </a>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingResume}
                  className="text-xs cursor-pointer flex-1 sm:flex-none"
                >
                  {uploadingResume ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 mr-1" />
                  )}
                  Replace
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl p-6 text-center cursor-pointer transition-all group"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                {uploadingResume ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <h3 className="font-semibold text-sm text-gray-800">
                {uploadingResume ? "Uploading your resume..." : "Upload your resume (PDF)"}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Upload your resume once to unlock instant AI ATS qualification scoring when you apply for any job.
              </p>
              <Button
                size="sm"
                type="button"
                disabled={uploadingResume}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer"
              >
                Choose PDF File
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs Container: Applied Jobs & Saved Jobs ── */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 mx-4 sm:mx-auto shadow-xs my-5">
        <div className="flex items-center gap-6 border-b border-gray-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("applied")}
            className={`flex items-center gap-2 pb-2 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "applied"
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>Applied Jobs</span>
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 font-bold">
              {allappliedjobs?.length || 0}
            </Badge>
          </button>

          {user?.role === "student" && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 pb-2 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "saved"
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Saved Jobs</span>
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 font-bold">
                {user?.savedJobs?.length || savedJobsList.length || 0}
              </Badge>
            </button>
          )}
        </div>

        {/* Tab 1: Applied Jobs */}
        {activeTab === "applied" && <Appliedjob />}

        {/* Tab 2: Saved / Bookmarked Jobs */}
        {activeTab === "saved" && (
          <div>
            {loadingSavedJobs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
                <span className="text-xs text-gray-500">Loading your saved jobs...</span>
              </div>
            ) : savedJobsList.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">No bookmarked jobs yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Click the bookmark icon on any job card to save roles you want to review or apply to later.
                </p>
                <Button
                  onClick={() => navigate("/jobs")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-xs cursor-pointer"
                  size="sm"
                >
                  Explore Open Jobs
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobsList.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 rounded-xl border border-gray-200 bg-white hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          {job?.company?.logo ? (
                            <img
                              src={job.company.logo}
                              alt={job.company.name}
                              className="w-9 h-9 rounded-lg object-contain border p-1 bg-white"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                              {job?.company?.name?.charAt(0) || "C"}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-tight line-clamp-1">
                              {job?.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">{job?.company?.name || "Company"}</p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSavedJob(job._id)}
                          disabled={removingSavedId === job._id}
                          className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                          title="Remove bookmark"
                        >
                          {removingSavedId === job._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 my-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{job?.location || "India"}</span>
                        <span className="text-gray-300">•</span>
                        <span>{job?.jobType}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 my-2">
                        <Badge variant="outline" className="text-xs font-semibold text-purple-700 bg-purple-50 border-purple-100">
                          {job?.salary} LPA
                        </Badge>
                        <Badge variant="outline" className="text-xs text-blue-700 bg-blue-50 border-blue-100">
                          {job?.position} Openings
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="text-xs flex-1 cursor-pointer hover:bg-purple-50 hover:text-purple-700"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="text-xs flex-1 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Updateprofile open={open} setOpen={setOpen} />
    </div>
  )
}
