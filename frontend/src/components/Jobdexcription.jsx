import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT, formatSalary } from "@/util/const"
import { useDispatch, useSelector } from "react-redux"
import { setsinglejob } from "@/redux/jobslice"
import { setuser, updateUserSavedJobs } from "@/redux/authSlice"
import { toast } from "sonner"
import Navbar from "./shared/Navbar"
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Bookmark,
  TrendingUp,
  Target,
  Edit3,
  Check,
  X,
  Zap,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import Updateprofile from "./Updateprofilejob"

export default function Jobdexcription() {
  const { singlejob } = useSelector((store) => store.job)
  const { user } = useSelector((store) => store.auth)
  const isinitiallyApplied = singlejob?.application?.some((application) => application.applicant === user?._id) || false
  const [isApplied, setIsapplied] = useState(isinitiallyApplied)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedResumeFile, setSelectedResumeFile] = useState(null)
  const [submittingApplication, setSubmittingApplication] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const params = useParams()
  const navigate = useNavigate()
  const jobid = params.id
  const dispatch = useDispatch()

  const hasResume = !!user?.profile?.resume
  const isSaved = (user?.savedJobs || []).some(
    (item) => (item?._id || item)?.toString() === jobid?.toString()
  )

  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Please login to save jobs")
      navigate("/login")
      return
    }

    try {
      setIsSaving(true)
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/saved-jobs/${jobid}`)
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

  // Look up if this student already applied and has an official ATS evaluation
  const userApplication = singlejob?.application?.find((app) => {
    const applicantId = typeof app.applicant === "object" ? app.applicant?._id : app.applicant;
    return applicantId?.toString() === user?._id?.toString();
  });
  const officialEvaluation = userApplication?.aiEvaluation;
  const isEvaluated = Boolean(
    officialEvaluation &&
    typeof officialEvaluation.score === "number" &&
    officialEvaluation.score > 0
  );

  // Candidate skills & raw requirements
  const candidateSkills = (user?.profile?.skills || []).map((s) => s.toLowerCase().trim())
  const rawRequirements = (singlejob?.requirement || [])
    .flatMap((r) => r.split(/[,;|/\n]+/))
    .map((r) => r.trim())
    .filter(Boolean)

  const matchedSkills = []
  const missingSkills = []

  rawRequirements.forEach((req) => {
    const reqLower = req.toLowerCase()
    const isMatched = candidateSkills.some(
      (cs) => cs === reqLower || cs.includes(reqLower) || reqLower.includes(cs)
    )
    if (isMatched) {
      if (!matchedSkills.includes(req)) matchedSkills.push(req)
    } else {
      if (!missingSkills.includes(req)) missingSkills.push(req)
    }
  })

  // Pre-Check Match Score (consistent with backend weighting)
  const totalFactors = Math.max(rawRequirements.length, 1)
  const baseSkillRatio = Math.min(1, matchedSkills.length / totalFactors)
  let preCheckScore = Math.round(baseSkillRatio * 60 + (hasResume ? 20 : 10))
  if (candidateSkills.length === 0 && !hasResume) preCheckScore = 15
  preCheckScore = Math.min(100, Math.max(10, preCheckScore))

  // Displayed Score & Data: Priority given to the official application evaluation
  const displayedScore = isEvaluated ? officialEvaluation.score : preCheckScore
  const displayedVerdict = isEvaluated
    ? officialEvaluation.verdict || "Qualified"
    : displayedScore >= 80
      ? "Highly Qualified"
      : displayedScore >= 60
        ? "Qualified"
        : displayedScore >= 40
          ? "Partially Qualified"
          : "Not Qualified"

  const displayedMatchedSkills = (isEvaluated && officialEvaluation.matchingSkills?.length)
    ? officialEvaluation.matchingSkills
    : matchedSkills

  const displayedMissingSkills = (isEvaluated && officialEvaluation.missingSkills?.length)
    ? officialEvaluation.missingSkills
    : missingSkills

  let scoreBadgeColor = "text-rose-700 bg-rose-50 border-rose-200"
  let scoreBarColor = "bg-rose-500"

  if (displayedScore >= 80) {
    scoreBadgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200"
    scoreBarColor = "bg-emerald-500"
  } else if (displayedScore >= 60) {
    scoreBadgeColor = "text-indigo-700 bg-indigo-50 border-indigo-200"
    scoreBarColor = "bg-indigo-600"
  } else if (displayedScore >= 40) {
    scoreBadgeColor = "text-amber-700 bg-amber-50 border-amber-200"
    scoreBarColor = "bg-amber-500"
  }

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please login to apply for jobs")
      navigate("/login")
      return
    }
    if (user.role === "recruiter") {
      toast.error("Recruiter accounts cannot apply for jobs")
      return
    }
    setApplyModalOpen(true)
  }

  const applyJobHandler = async (e) => {
    e?.preventDefault()

    try {
      setSubmittingApplication(true)
      axios.defaults.withCredentials = true

      const formData = new FormData()
      if (selectedResumeFile) {
        formData.append("file", selectedResumeFile)
      }

      const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobid}`, formData, {
        headers: selectedResumeFile ? { "Content-Type": "multipart/form-data" } : {},
      })

      if (res.data.success) {
        setIsapplied(true)
        if (selectedResumeFile) {
          dispatch(
            setuser({
              ...user,
              profile: {
                ...user?.profile,
                resumeOriginalName: selectedResumeFile.name,
              },
            })
          )
        }

        // Fetch fresh job to immediately load official ATS evaluation from backend
        try {
          const freshJobRes = await axios.get(`${JOB_API_END_POINT}/get/${jobid}`, { withCredentials: true })
          if (freshJobRes.data?.success) {
            dispatch(setsinglejob(freshJobRes.data.job))
          }
        } catch (fetchErr) {
          console.error("Error fetching fresh job evaluation:", fetchErr)
        }

        toast.success(res.data.message || "Application submitted successfully! Your resume has been evaluated.")
        setApplyModalOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to submit application")
    } finally {
      setSubmittingApplication(false)
    }
  }

  useEffect(() => {
    const fetchSinglejobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobid}`, { withCredentials: true })
        if (res.data.success) {
          dispatch(setsinglejob(res.data.job))
          const applied = res.data.job.application?.some((application) => {
            const applicantId = typeof application.applicant === "object" ? application.applicant?._id : application.applicant;
            return applicantId?.toString() === user?._id?.toString();
          })
          setIsapplied(Boolean(applied))
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchSinglejobs()
  }, [jobid, dispatch, user?._id])

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 sm:mb-6 gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-2xl border border-gray-200/90 shadow-xs">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14 rounded-2xl border border-gray-100 shadow-2xs bg-white shrink-0">
              <AvatarImage src={singlejob?.company?.logo || "/placeholder.svg"} className="object-contain p-1.5" />
              <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-lg">
                {singlejob?.company?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-500 mb-0.5">{singlejob?.company?.name}</div>
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-2.5 text-gray-900">{singlejob?.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className="text-blue-700 bg-blue-50 border-blue-200 font-bold text-xs sm:text-sm" variant="outline">
                  {singlejob?.position} Positions
                </Badge>
                <Badge className="text-[#F83002] bg-orange-50 border-orange-200 text-xs sm:text-sm" variant="outline">
                  {singlejob?.jobType}
                </Badge>
                <Badge className="text-[#7209b7] bg-purple-50 border-purple-200 text-xs sm:text-sm font-semibold" variant="outline">
                  {formatSalary(singlejob?.salary)}
                </Badge>
                <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200 text-xs sm:text-sm">
                  {singlejob?.location}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Bookmark button */}
            <Button
              onClick={handleToggleSave}
              disabled={isSaving}
              variant="outline"
              className={`rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer transition-all ${
                isSaved
                  ? "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
                  : "text-gray-700 hover:text-purple-700 hover:border-purple-200"
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-purple-700" : ""}`} />
              )}
              {isSaved ? "Bookmarked" : "Save Job"}
            </Button>

            {/* Apply Button */}
            <Button
              onClick={isApplied ? null : handleApplyClick}
              disabled={isApplied}
              className={`rounded-xl flex-1 sm:flex-none px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold cursor-pointer shadow-sm transition-all ${
                isApplied
                  ? "bg-gray-400 hover:bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f1a87] text-white hover:shadow-md hover:scale-[1.02]"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* ── AI Match Pre-Check & Gap Analysis Widget ── */}
        {user?.role === "student" && (
          <div className="mt-6 rounded-2xl border border-purple-200/90 bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-white p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base sm:text-lg text-gray-900">
                      {isEvaluated ? "Official AI ATS Evaluation" : "AI Match Pre-Check & Gap Analysis"}
                    </h2>
                    <Badge variant="outline" className={`text-xs font-bold border ${scoreBadgeColor}`}>
                      {displayedVerdict}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isEvaluated
                      ? "Official ATS score evaluated and submitted to the recruiter for your application"
                      : "Pre-assessed against your listed profile competencies and resume"}
                  </p>
                </div>
              </div>

              {/* Match Score Meter */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-2xs">
                <div className="text-right">
                  <span className="text-[11px] font-semibold uppercase text-gray-400 block tracking-wider">
                    {isEvaluated ? "Application ATS Score" : "ATS Match Score"}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-gray-900">
                    {displayedScore}%
                  </span>
                </div>
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${scoreBarColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${displayedScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Skills Alignment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
              {/* Matched Skills */}
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm text-gray-900">
                    Matching Skills in Your Profile ({displayedMatchedSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                  {displayedMatchedSkills.length > 0 ? (
                    displayedMatchedSkills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium"
                        variant="outline"
                      >
                        <Check className="w-3 h-3 mr-1 text-emerald-600" />
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No matching requirements found in your profile skills yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm text-gray-900">
                    Recommended Job Requirements ({displayedMissingSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                  {displayedMissingSkills.length > 0 ? (
                    displayedMissingSkills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-medium"
                        variant="outline"
                      >
                        <Zap className="w-3 h-3 mr-1 text-amber-600" />
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">
                      All listed core requirements are covered in your profile!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Gap Advice Footer */}
            <div className="mt-4 pt-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <Target className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  {displayedMissingSkills.length > 0
                    ? `Pro Tip: Highlighting ${displayedMissingSkills.slice(0, 3).join(", ")} in your resume can boost your ATS qualification.`
                    : "Your profile strongly matches this position's listed qualifications."}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditProfileOpen(true)}
                className="text-xs text-purple-700 border-purple-200 hover:bg-purple-50 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Update Profile Skills
              </Button>
            </div>
          </div>
        )}

        {!user && (
          <div className="mt-6 p-4 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-bold text-gray-900">Want to see your AI ATS match score?</span> Log in as a job seeker to see your personalized qualification pre-check.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs cursor-pointer shrink-0"
            >
              Log in to Check Fit
            </Button>
          </div>
        )}

        <h1 className="border-b-2 border-b-gray-300 font-medium py-3 sm:py-4 mt-6 sm:mt-8 text-base sm:text-lg">
          Job Description
        </h1>

        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Role:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4">
              {singlejob?.title}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Location:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4">
              {singlejob?.location}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Description:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4 leading-relaxed">
              {singlejob?.description}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Requirements:</h1>
            <div className="flex flex-wrap gap-1.5 mt-1 sm:mt-0 sm:pl-4">
              {singlejob?.requirement?.length > 0 ? (
                singlejob?.requirement.map((req, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-slate-50 text-slate-700">
                    {req}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Experience:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4">
              {singlejob?.experiance} Year(s)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Salary:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4">
              {formatSalary(singlejob?.salary)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Total Applicants:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4">
              {singlejob?.application?.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start">
            <h1 className="font-bold text-sm sm:text-base min-w-[120px] sm:min-w-[140px]">Posted Date:</h1>
            <span className="font-normal text-gray-800 text-sm sm:text-base mt-1 sm:mt-0 sm:pl-4">
              {singlejob?.createdAt?.split("T")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Apply with Resume Dialog */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              AI-Powered ATS Application
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              Apply for {singlejob?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Your resume will be automatically parsed and scored against the job requirements by our ATS engine.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={applyJobHandler} className="space-y-4 pt-2">
            {/* If user already has a resume */}
            {hasResume && !selectedResumeFile ? (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block">
                        Using Saved Profile Resume
                      </span>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                        {user?.profile?.resumeOriginalName || "Resume.pdf"}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <span className="text-gray-600">Want to use a tailored resume?</span>
                  <label className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline">
                    Upload different file
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setSelectedResumeFile(file)
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* If no resume or user clicked upload different file */
              <div className="space-y-3">
                <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-5 text-center">
                  <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <Label htmlFor="resume-upload" className="font-semibold text-sm text-gray-800 block cursor-pointer">
                    {selectedResumeFile ? selectedResumeFile.name : "Select your Resume (PDF)"}
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedResumeFile
                      ? "File ready for submission and ATS analysis"
                      : "Upload a PDF resume, or submit now to use your profile skills"}
                  </p>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setSelectedResumeFile(file)
                    }}
                    className="mt-3 cursor-pointer text-xs"
                  />
                </div>

                {hasResume && selectedResumeFile && (
                  <button
                    type="button"
                    onClick={() => setSelectedResumeFile(null)}
                    className="text-xs text-indigo-600 hover:underline cursor-pointer"
                  >
                    ← Revert to using saved profile resume
                  </button>
                )}
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyModalOpen(false)}
                disabled={submittingApplication}
                className="w-full sm:w-auto cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingApplication}
                className="w-full sm:w-auto bg-[#7209b7] hover:bg-[#5f1a87] text-white cursor-pointer"
              >
                {submittingApplication ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing & Applying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Updateprofile open={editProfileOpen} setOpen={setEditProfileOpen} />
    </>
  )
}
