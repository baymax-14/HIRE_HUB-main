import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT, formatSalary } from "@/util/const"
import { useDispatch, useSelector } from "react-redux"
import { setsinglejob } from "@/redux/jobslice"
import { setuser, updateUserSavedJobs } from "@/redux/authSlice"
import { toast } from "sonner"
import Navbar from "./shared/Navbar"
import Footer from "./Footer"
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Bookmark,
  Share2,
  ExternalLink,
  Target,
  Edit3,
  Check,
  Zap,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  Clock,
  Send,
  Eye,
  RefreshCw,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import Updateprofile from "./Updateprofilejob"

export default function Jobdexcription() {
  const { singlejob, allJobs } = useSelector((store) => store.job)
  const { user } = useSelector((store) => store.auth)
  const isinitiallyApplied = singlejob?.application?.some((application) => {
    const applicantId = typeof application.applicant === "object" ? application.applicant?._id : application.applicant
    return applicantId?.toString() === user?._id?.toString()
  }) || false

  const [isApplied, setIsapplied] = useState(isinitiallyApplied)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedResumeFile, setSelectedResumeFile] = useState(null)
  const [submittingApplication, setSubmittingApplication] = useState(false)
  const [pitchNote, setPitchNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const params = useParams()
  const navigate = useNavigate()
  const jobid = params.id
  const dispatch = useDispatch()

  const hasResume = !!user?.profile?.resume
  const isSaved = (user?.savedJobs || []).some(
    (item) => (item?._id || item)?.toString() === jobid?.toString()
  )

  // Derive company object safely whether populated or referenced in allJobs
  const companyObj =
    typeof singlejob?.company === "object" && singlejob?.company !== null
      ? singlejob.company
      : (allJobs || []).find(
          (j) =>
            (j?._id || j)?.toString() === jobid?.toString() ||
            (j?.company?._id || j?.company)?.toString() === singlejob?.company?.toString()
        )?.company || {}

  const companyName = companyObj?.name || singlejob?.companyName || "Hiring Company"
  const companyLogo = companyObj?.logo || singlejob?.companyLogo || ""
  const companyWebsite = companyObj?.website || ""

  // Find 2-3 similar jobs
  const similarJobs = (allJobs || [])
    .filter((j) => j._id !== jobid)
    .slice(0, 2)

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      toast.success("Job link copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  // Intelligent Skill Matcher with Synonym & Alias Awareness
  const isSkillMatch = (candidateSkill, requiredSkill) => {
    if (!candidateSkill || !requiredSkill) return false
    const a = candidateSkill.toLowerCase().trim()
    const b = requiredSkill.toLowerCase().trim()

    if (a === b) return true

    const SYNONYMS = [
      ["go", "golang"],
      ["react", "react.js", "reactjs"],
      ["node", "node.js", "nodejs"],
      ["express", "express.js", "expressjs"],
      ["mongo", "mongodb"],
      ["k8s", "kubernetes"],
      ["postgres", "postgresql"],
      ["aws", "amazon web services"],
      ["gcp", "google cloud", "google cloud platform"],
      ["js", "javascript"],
      ["ts", "typescript"],
      ["py", "python"],
      ["tailwind", "tailwindcss", "tailwind css"],
      ["next", "next.js", "nextjs"],
      ["vue", "vue.js", "vuejs"],
      ["angular", "angularjs"],
      ["docker", "containerization", "containers"],
      ["ci/cd", "cicd", "continuous integration", "continuous delivery"],
      ["c++", "cpp"],
      ["c#", "csharp", ".net", "dotnet"],
      ["rest", "rest api", "restful api", "restful apis"],
      ["html", "html5"],
      ["css", "css3"],
      ["prometheus", "grafana", "monitoring"],
      ["sre", "site reliability engineering", "devops"],
    ]

    for (const group of SYNONYMS) {
      const hasA = group.some((item) => a === item)
      const hasB = group.some((item) => b === item)
      if (hasA && hasB) return true
    }

    const escapedA = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const escapedB = b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    if (new RegExp(`(^|[^a-zA-Z0-9])${escapedA}([^a-zA-Z0-9]|$)`, "i").test(b)) return true
    if (new RegExp(`(^|[^a-zA-Z0-9])${escapedB}([^a-zA-Z0-9]|$)`, "i").test(a)) return true

    const wordsA = a.split(/\s+/).filter((w) => w.length > 2)
    const wordsB = b.split(/\s+/).filter((w) => w.length > 2)
    if (wordsA.length > 1 && wordsB.length > 1) {
      const common = wordsA.filter((w) => wordsB.includes(w))
      if (common.length >= Math.min(wordsA.length, wordsB.length)) return true
    }

    return false
  }

  // Look up if user already applied and has an official ATS evaluation
  const userApplication = singlejob?.application?.find((app) => {
    const applicantId = typeof app.applicant === "object" ? app.applicant?._id : app.applicant
    return applicantId?.toString() === user?._id?.toString()
  })
  const officialEvaluation = userApplication?.aiEvaluation
  const isEvaluated = Boolean(
    officialEvaluation &&
    typeof officialEvaluation.score === "number" &&
    officialEvaluation.score > 0
  )

  // Candidate skills & raw requirements
  const candidateSkills = (user?.profile?.skills || []).map((s) => String(s).trim()).filter(Boolean)
  const rawRequirements = (singlejob?.requirement || [])
    .flatMap((r) => String(r).split(/[,;|/\n]+/))
    .map((r) => r.trim())
    .filter(Boolean)

  const rawMatched = []
  const rawMissing = []

  rawRequirements.forEach((req) => {
    const isMatched = candidateSkills.some((cs) => isSkillMatch(cs, req))
    if (isMatched) {
      if (!rawMatched.includes(req)) rawMatched.push(req)
    } else {
      if (!rawMissing.includes(req)) rawMissing.push(req)
    }
  })

  const matchedSkills = rawMatched
  const missingSkills = rawMissing.filter(
    (ms) => !matchedSkills.some((m) => isSkillMatch(m, ms))
  )

  // 1. Skill Match Component (Max 70 Points)
  const totalFactors = Math.max(rawRequirements.length, 1)
  const skillRatio = matchedSkills.length / totalFactors
  const skillScore = Math.round(skillRatio * 70)

  // 2. Experience & Practical Evidence Component (Max 30 Points)
  let expPoints = 0
  if (hasResume) expPoints += 5

  const candidateBio = user?.profile?.bio || ""
  const hasProjects =
    candidateSkills.length >= 3 ||
    /project|projects|developed|built|engineered|deployed|implemented|designed|created|fullstack|frontend|backend/i.test(candidateBio)
  if (hasProjects) expPoints += 12

  const hasValidation =
    candidateSkills.length >= 4 ||
    /intern|internship|hackathon|competition|fellowship|bootcamp|certification|certified|contributor/i.test(candidateBio)
  if (hasValidation) expPoints += 8

  const reqExp = parseInt(singlejob?.experiance || "0", 10)
  if (reqExp <= 1) expPoints += 5
  else if (reqExp <= 3) expPoints += 3
  else expPoints += 1

  const finalExpScore = Math.min(30, expPoints)

  let preCheckScore = Math.min(100, Math.max(10, Math.round(skillScore + finalExpScore)))
  if (matchedSkills.length === 0 && !hasResume) {
    preCheckScore = 15
  }

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

  const rawDisplayedMatched = (isEvaluated && Array.isArray(officialEvaluation.matchingSkills) && officialEvaluation.matchingSkills.length > 0)
    ? officialEvaluation.matchingSkills
    : matchedSkills

  const rawDisplayedMissing = (isEvaluated && Array.isArray(officialEvaluation.missingSkills) && officialEvaluation.missingSkills.length > 0)
    ? officialEvaluation.missingSkills
    : missingSkills

  const displayedMatchedSkills = [...new Set(rawDisplayedMatched)]
  const displayedMissingSkills = [...new Set(rawDisplayedMissing)].filter(
    (skill) => !displayedMatchedSkills.some((m) => isSkillMatch(m, skill))
  )

  let scoreBadgeColor = "text-rose-700 bg-rose-50 border-rose-200"
  let scoreBarColor = "from-rose-500 to-rose-600"

  if (displayedScore >= 80) {
    scoreBadgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200"
    scoreBarColor = "from-emerald-500 to-teal-500"
  } else if (displayedScore >= 60) {
    scoreBadgeColor = "text-[#630ed4] bg-purple-50 border-purple-200"
    scoreBarColor = "from-[#630ed4] to-[#7c3aed]"
  } else if (displayedScore >= 40) {
    scoreBadgeColor = "text-amber-700 bg-amber-50 border-amber-200"
    scoreBarColor = "from-amber-500 to-orange-500"
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
      if (pitchNote) {
        formData.append("pitchNote", pitchNote)
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
            const applicantId = typeof application.applicant === "object" ? application.applicant?._id : application.applicant
            return applicantId?.toString() === user?._id?.toString()
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
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans flex flex-col selection:bg-purple-100 selection:text-[#630ed4]">
      <Navbar />

      <main className="w-full pt-6 pb-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#630ed4]/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#4b41e1]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* ── 1. BREADCRUMB & CONTEXT HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#131b2e] hover:text-[#630ed4] shadow-xs hover:shadow-sm border border-slate-200/80 transition-all text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Openings</span>
              </button>
              <span className="text-slate-300 text-xs">/</span>
              <span
                onClick={() => navigate("/jobs")}
                className="text-xs font-medium text-slate-500 hover:text-[#131b2e] cursor-pointer transition-colors"
              >
                {singlejob?.category || "Technology & Engineering"}
              </span>
              <span className="text-slate-300 text-xs">/</span>
              <span className="text-xs text-[#630ed4] font-semibold truncate max-w-xs">
                {companyName} • {singlejob?.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-slate-700 text-xs shadow-2xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="uppercase tracking-wider text-[11px] font-semibold">Actively Interviewing</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#630ed4] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Partner</span>
              </div>
            </div>
          </div>

          {/* ── 2. ROLE HEADER HERO CARD ── */}
          <section className="mt-2 rounded-3xl bg-white shadow-md p-6 lg:p-8 relative overflow-hidden border border-slate-200/80">
            {/* Ambient Corner Mesh */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-100 via-indigo-100 to-transparent rounded-full opacity-60 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Company & Title Cluster */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
                <div className="relative shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#630ed4] to-[#4b41e1] p-1 shadow-md">
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-black bg-gradient-to-tr from-[#630ed4] to-[#4b41e1] bg-clip-text text-transparent">
                        {companyName.charAt(0) || "C"}
                      </span>
                    )}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs shadow-xs"
                    title="Verified Employer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-slate-900">{companyName}</span>
                    {companyWebsite && (
                      <a
                        href={companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-slate-400 hover:text-[#630ed4] transition-colors"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {singlejob?.location || "Remote / Hybrid"}
                    </span>
                  </div>

                  <h1 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight mt-1.5">
                    {singlejob?.title}
                  </h1>

                  <p className="text-sm text-slate-600 mt-1 max-w-2xl line-clamp-2">
                    {singlejob?.description || "Architect mission-critical applications and scale modern systems with our world-class engineering team."}
                  </p>
                </div>
              </div>

              {/* Action Cluster */}
              <div className="flex flex-row lg:flex-col sm:items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSave}
                    disabled={isSaving}
                    className={`p-3 rounded-2xl border transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                      isSaved
                        ? "bg-purple-50 text-[#630ed4] border-purple-200 hover:bg-purple-100"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-[#630ed4]"
                    }`}
                    title={isSaved ? "Saved in Bookmarks" : "Save this Job"}
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Bookmark className={`w-5 h-5 ${isSaved ? "fill-[#630ed4]" : ""}`} />
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#630ed4] border border-slate-200 transition-all shadow-xs flex items-center justify-center cursor-pointer"
                    title="Share Job Link"
                  >
                    {isCopied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  onClick={isApplied ? null : handleApplyClick}
                  disabled={isApplied}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                    isApplied
                      ? "bg-slate-300 text-slate-600 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isApplied ? "Already Applied" : "1-Click AI Apply"}</span>
                </button>

                <span className="text-[11px] text-slate-400 text-center lg:text-right font-medium">
                  {isApplied ? "Application under review" : "No cover letter required • ATS Pre-Scored"}
                </span>
              </div>
            </div>

            {/* Key Metadata Pills Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-5 border-t border-slate-100">
              <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Compensation</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5">{formatSalary(singlejob?.salary)}</span>
                <span className="text-[11px] text-[#630ed4] font-semibold">+ Benefits & Bonus</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Location Scope</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 truncate">{singlejob?.location || "Flexible"}</span>
                <span className="text-[11px] text-slate-500">Hybrid / Remote</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Seniority Level</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5">{singlejob?.experiance || "0"} Yr(s) Min</span>
                <span className="text-[11px] text-slate-500">Professional Exp</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Employment Type</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5">{singlejob?.jobType || "Full-Time"}</span>
                <span className="text-[11px] text-slate-500">Direct Contract</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Applicants</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5">
                  {singlejob?.application?.length || 0} Candidates
                </span>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Screening Live
                </span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Posted Date</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5">
                  {singlejob?.createdAt ? singlejob?.createdAt.split("T")[0] : "Recently"}
                </span>
                <span className="text-[11px] text-slate-500">Open for applications</span>
              </div>
            </div>
          </section>

          {/* ── 3. AI MATCH PRE-CHECK & ATS TELEMETRY HERO SECTION ── */}
          {user?.role === "student" && (
            <section className="mt-6 rounded-3xl bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/30 p-6 lg:p-8 shadow-md relative overflow-hidden border border-purple-200/80">
              {/* Sparkle Glow Backdrop */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#630ed4] to-[#4b41e1] flex items-center justify-center text-white shadow-md shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {isEvaluated ? "Official AI ATS Evaluation" : "Autonomous ATS Pre-Flight Check"}
                      </h2>
                      <Badge variant="outline" className={`text-xs font-bold border ${scoreBadgeColor}`}>
                        {displayedVerdict}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isEvaluated
                        ? "Evaluated and submitted to recruiter with verified application packet"
                        : user?.profile?.resumeOriginalName
                          ? `Synchronized against active resume: ${user.profile.resumeOriginalName}`
                          : "Calculated from your profile competencies and experience"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#630ed4] text-xs font-semibold shadow-2xs border border-purple-200/70 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update Profile Skills</span>
                </button>
              </div>

              {/* Telemetry Breakdown Cards (3 Cards Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* 1. Donut ATS Match Meter */}
                <div className="rounded-2xl bg-white p-4 shadow-2xs border border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall ATS Score</span>
                    <span className="text-3xl font-black text-slate-900 mt-1">
                      {displayedScore}
                      <span className="text-lg font-bold text-[#630ed4]">%</span>
                    </span>
                    <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {displayedScore >= 80 ? "Above 90th Percentile" : "Competitive Candidate Fit"}
                    </span>
                  </div>

                  {/* SVG Donut Chart */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-[#630ed4]"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray={`${displayedScore}, 100`}
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[#630ed4]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* 2. Skill Overlap Gauge */}
                <div className="rounded-2xl bg-white p-4 shadow-2xs border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skill Competency Ratio</span>
                    <span className="text-xs font-bold text-[#630ed4]">
                      {displayedMatchedSkills.length} / {Math.max(rawRequirements.length, 1)} Matched
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${scoreBarColor} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.min(100, Math.round((displayedMatchedSkills.length / Math.max(rawRequirements.length, 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
                    <span>Role Requirements</span>
                    <span className="font-semibold text-emerald-600">
                      {Math.round((displayedMatchedSkills.length / Math.max(rawRequirements.length, 1)) * 100)}% Direct Overlap
                    </span>
                  </div>
                </div>

                {/* 3. Experience & Calibration */}
                <div className="rounded-2xl bg-white p-4 shadow-2xs border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience Calibration</span>
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="mt-1">
                    <span className="text-base font-bold text-slate-900">
                      {singlejob?.experiance || "0"} Year(s) Requirement
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {hasResume ? "Resume credentials detected and verified." : "Add projects or resume to optimize fit."}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[#630ed4] text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Domain & stack compatibility verified</span>
                  </div>
                </div>
              </div>

              {/* Skills Alignment Tags & Pro Tip Strip */}
              <div className="mt-4 rounded-2xl bg-white p-4 shadow-2xs border border-slate-100 flex flex-col gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Direct Verified Skills Found in Candidate Profile
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {displayedMatchedSkills.length > 0 ? (
                      displayedMatchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No direct matching skills listed yet.</span>
                    )}
                  </div>
                </div>

                {displayedMissingSkills.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Recommended Job Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {displayedMissingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Tip Strip */}
                <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">ATS Gap Optimization Suggestion</span>
                      <p className="text-xs text-slate-600">
                        {displayedMissingSkills.length > 0
                          ? `Highlighting ${displayedMissingSkills.slice(0, 3).join(", ")} in your projects can boost your match score to 95%+.`
                          : "Your profile strongly matches this position's listed qualifications and prerequisites."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditProfileOpen(true)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#630ed4] text-xs font-semibold shadow-2xs border border-purple-200 cursor-pointer"
                  >
                    Edit Competencies
                  </button>
                </div>
              </div>
            </section>
          )}

          {!user && (
            <div className="mt-6 p-5 rounded-2xl bg-white border border-purple-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#630ed4] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Want to see your Autonomous ATS Pre-Flight Check?</h3>
                  <p className="text-xs text-slate-500">
                    Log in as a job seeker to see your personalized 0-100% skill alignment and resume fit.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-semibold px-5 rounded-xl cursor-pointer shrink-0"
              >
                Log In to Check Fit
              </Button>
            </div>
          )}

          {/* ── 4. TWO-COLUMN MAIN CONTENT WORKSPACE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
            {/* LEFT COLUMN: DEEP DIVE SPEC (70% - 8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* SECTION: ROLE OVERVIEW & CULTURE */}
              <div className="rounded-3xl bg-white p-6 lg:p-8 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-2 text-[#630ed4] text-xs font-bold uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Role Context & Charter</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  About the Opportunity at {companyName}
                </h2>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
                  <p className="whitespace-pre-line">{singlejob?.description}</p>
                </div>

                {/* High Impact Stat Callouts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Positions</span>
                    <span className="text-lg font-bold text-slate-900 mt-1">{singlejob?.position || 1} Seat(s)</span>
                    <span className="text-xs text-slate-500 mt-0.5">Direct team expansion</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</span>
                    <span className="text-lg font-bold text-slate-900 mt-1">{singlejob?.experiance || "0"}+ Years</span>
                    <span className="text-xs text-slate-500 mt-0.5">Required industry tenure</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Work Mode</span>
                    <span className="text-lg font-bold text-slate-900 mt-1">{singlejob?.location || "Hybrid"}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{singlejob?.jobType || "Full-Time"}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: WHAT YOU WILL DELIVER & BUILD */}
              <div className="rounded-3xl bg-white p-6 lg:p-8 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-2 text-[#630ed4] text-xs font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Mission & Deliverables</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  What You'll Architect & Build
                </h2>
                <div className="mt-5 flex flex-col gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#630ed4] shrink-0 mt-0.5 font-bold">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Scalable System Architecture</h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Design resilient services and modular client runtimes that deliver ultra-low latency and zero-downtime performance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#630ed4] shrink-0 mt-0.5 font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Production Reliability & Observability</h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Maintain end-to-end tracing, synthetic metrics, and automated tests guaranteeing continuous deployment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#630ed4] shrink-0 mt-0.5 font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Technical Mentorship & Code Governance</h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Anchor code reviews, author RFC proposals, and elevate engineering standards across the product squad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: QUALIFICATIONS & REQUIREMENTS */}
              <div className="rounded-3xl bg-white p-6 lg:p-8 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-2 text-[#630ed4] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Candidate Qualifications</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  What We're Looking For
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {/* Core Requirements */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#630ed4]" />
                      <span>Role Requirements</span>
                    </div>
                    <ul className="flex flex-col gap-2 text-xs text-slate-600">
                      {singlejob?.requirement?.length > 0 ? (
                        singlejob?.requirement.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 italic">No specific requirements listed.</li>
                      )}
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{singlejob?.experiance || "0"}+ years hands-on production engineering experience.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Bonus Skills */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Standout Bonuses</span>
                    </div>
                    <ul className="flex flex-col gap-2 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Experience in distributed micro-services and cloud infrastructure.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Demonstrated contributions to open-source software libraries.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Deep appreciation for user experience, accessibility, and web speed.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION: TECH STACK & ECOSYSTEM */}
              <div className="rounded-3xl bg-white p-6 lg:p-8 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#630ed4] text-xs font-bold uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      <span>Ecosystem</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      Tech Stack & Architectural Arsenal
                    </h2>
                  </div>
                  <span className="text-slate-400 text-xs font-semibold">Verified Stack</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {rawRequirements.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs flex items-center gap-1.5 border border-slate-200/60"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#630ed4]" />
                      {tech}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs flex items-center gap-1.5 border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-[#4b41e1]" /> Git & CI/CD
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs flex items-center gap-1.5 border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Cloud Native
                  </span>
                </div>
              </div>

              {/* SECTION: INTERVIEW PROCESS ROADMAP */}
              <div className="rounded-3xl bg-white p-6 lg:p-8 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#630ed4] text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Transparent Hiring</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      Interview Process & Fast-Track SLA
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Avg Cycle: 7-10 Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-5">
                  <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-[#630ed4] text-white flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">Day 1</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 mt-2">HireHub ATS Sync</span>
                    <p className="text-xs text-slate-500 mt-1">Instant scoring & portfolio validation.</p>
                  </div>

                  <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">Day 3</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 mt-2">Team Screening</span>
                    <p className="text-xs text-slate-500 mt-1">30 min video sync with Engineering Lead.</p>
                  </div>

                  <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">Day 6</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 mt-2">System Deep-Dive</span>
                    <p className="text-xs text-slate-500 mt-1">Interactive discussion on architecture & code.</p>
                  </div>

                  <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        4
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600">Offer</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 mt-2">Executive Decision</span>
                    <p className="text-xs text-slate-500 mt-1">Formal offer, benefits & onboarding review.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY APPLICATION RAIL (30% - 4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              {/* CARD 1: FAST-TRACK 1-CLICK ACTION CARD */}
              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">1-Click Fast Track</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                    Instant Queue
                  </span>
                </div>

                {/* Attached Resume Status */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#630ed4] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {user?.profile?.resumeOriginalName || (hasResume ? "Saved Resume.pdf" : "No Resume on File")}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${hasResume ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {hasResume ? "Ready for ATS Analysis" : "Upload during apply"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="text-slate-400 hover:text-[#630ed4] transition-colors p-1 cursor-pointer"
                    title="Change / Upload Resume"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={isApplied ? null : handleApplyClick}
                    disabled={isApplied}
                    className={`w-full py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isApplied
                        ? "bg-slate-300 text-slate-600 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isApplied ? "Application Submitted" : "Submit Priority Application"}</span>
                  </button>

                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview AI Application Dossier</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  By applying, you authorize {companyName} to review your profile and ATS scoring.
                </p>
              </div>

              {/* CARD 2: HIRING TEAM & DECISION MAKER */}
              <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Hiring Leadership</span>
                  <span className="text-xs font-semibold text-[#630ed4]">Active Recruiter</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="w-13 h-13 rounded-2xl border border-slate-200 shadow-2xs bg-purple-50">
                    <AvatarImage src={companyLogo} className="object-contain p-1" />
                    <AvatarFallback className="bg-purple-100 text-[#630ed4] font-bold text-sm">
                      {companyName.charAt(0) || "HR"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {companyName} Talent Team
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#630ed4] shrink-0" />
                    </div>
                    <span className="text-xs text-slate-500">Technical Recruiting & Staffing</span>
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5 font-semibold">
                      <Clock className="w-3 h-3" /> Responds in 24-48 hours
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-900">{singlejob?.category || "Software Development"}</span>
                </div>
              </div>

              {/* CARD 3: TOTAL REWARDS & PERKS */}
              <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col gap-3">
                <span className="text-sm font-bold text-slate-900">Comprehensive Total Rewards</span>
                <div className="flex flex-col gap-2.5 mt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#630ed4] shrink-0" />
                    <span><strong>{formatSalary(singlejob?.salary)}</strong> Annual Direct Compensation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#630ed4] shrink-0" />
                    <span><strong>Flexible PTO</strong> & Parental Leave Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#630ed4] shrink-0" />
                    <span><strong>Remote / Hybrid</strong> Setup Stipend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#630ed4] shrink-0" />
                    <span>Comprehensive Health Insurance & Wellness Coverage</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: SIMILAR ROLES */}
              {similarJobs.length > 0 && (
                <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Similar Openings</span>
                    <Link to="/jobs" className="text-xs text-[#630ed4] hover:underline font-semibold">
                      View All
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {similarJobs.map((simJob) => (
                      <Link
                        key={simJob._id}
                        to={`/description/${simJob._id}`}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 transition-all flex items-center justify-between group"
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#630ed4] transition-colors truncate">
                            {simJob.company?.name || "Company"} • {simJob.title}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            {formatSalary(simJob.salary)} • {simJob.location}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#630ed4] transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── 5. INTERACTIVE MODAL: 1-CLICK ATS APPLICATION ── */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="sm:max-w-lg p-6 lg:p-7 rounded-3xl bg-white shadow-2xl border border-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#630ed4] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Autonomous ATS Fast-Track
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Apply for {singlejob?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {companyName} • Pre-screened with AI Match Score
            </DialogDescription>
          </DialogHeader>

          {/* ATS Score Header in Modal */}
          <div className="mt-2 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#630ed4]" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Fit</span>
                <span className="text-xs font-bold text-slate-900">{displayedVerdict}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#630ed4]">{displayedScore}%</span>
              <span className="text-[11px] text-slate-500 block">ATS Score</span>
            </div>
          </div>

          <form onSubmit={applyJobHandler} className="space-y-4 pt-2">
            {/* Resume Selection */}
            {hasResume && !selectedResumeFile ? (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
                        Using Saved Profile Resume
                      </span>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                        {user?.profile?.resumeOriginalName || "Resume.pdf"}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Want to use a tailored resume?</span>
                  <label className="text-[#630ed4] hover:text-[#7c3aed] font-semibold cursor-pointer underline">
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
              <div className="space-y-3">
                <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-2xl p-5 text-center">
                  <Upload className="w-8 h-8 text-[#630ed4] mx-auto mb-2" />
                  <Label htmlFor="resume-upload" className="font-bold text-sm text-slate-900 block cursor-pointer">
                    {selectedResumeFile ? selectedResumeFile.name : "Select your Resume (PDF)"}
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedResumeFile
                      ? "File ready for submission and ATS evaluation"
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
                    className="text-xs text-[#630ed4] hover:underline cursor-pointer"
                  >
                    ← Revert to using saved profile resume
                  </button>
                )}
              </div>
            )}

            {/* Optional Pitch Note */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                <span>Executive Pitch Note (Optional)</span>
                <span className="text-slate-400 text-[11px]">Direct to recruiter</span>
              </label>
              <textarea
                value={pitchNote}
                onChange={(e) => setPitchNote(e.target.value)}
                placeholder="Briefly state your relevant project experience and enthusiasm for this role..."
                rows={3}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#630ed4]/30 resize-none"
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyModalOpen(false)}
                disabled={submittingApplication}
                className="w-full sm:w-auto rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingApplication}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] hover:opacity-95 text-white font-bold cursor-pointer"
              >
                {submittingApplication ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing & Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Confirm & Transmit
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Updateprofile open={editProfileOpen} setOpen={setEditProfileOpen} />

      {/* Modern Stitch Footer */}
      <Footer />
    </div>
  )
}
