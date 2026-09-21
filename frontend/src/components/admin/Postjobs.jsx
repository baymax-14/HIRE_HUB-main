import { useState, useEffect } from "react"
import Navbar from "../shared/Navbar"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useDispatch, useSelector } from "react-redux"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { setLoading } from "@/redux/authSlice"
import axios from "axios"
import { JOB_API_END_POINT } from "@/util/const"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"
import {
  Loader2,
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Sparkles,
  Plus,
  X,
  Eye,
  CheckCircle2,
  HelpCircle,
  Mail,
  Bell,
  BellOff,
} from "lucide-react"
import UsegetAllcompanies from "@/hooks/usegetAllcompanies"

export default function Postjobs() {
  // Ensure recruiter's companies are loaded even on direct page visit
  UsegetAllcompanies()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading } = useSelector((store) => store.auth)
  const { companies = [] } = useSelector((store) => store.company)

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirement: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experiance: "1-3",
    position: 1,
    companyId: "",
    emailAlerts: true,
  })

  // Local state for interactive requirement skill tags
  const [skillInput, setSkillInput] = useState("")
  const [skillsList, setSkillsList] = useState([
    "React",
    "Node.js",
    "TypeScript",
  ])

  // Sync skills array to input.requirement comma-separated string
  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      requirement: skillsList.join(", "),
    }))
  }, [skillsList])

  // Auto-select first company if available and none selected
  useEffect(() => {
    if (companies.length > 0 && !input.companyId) {
      setInput((prev) => ({ ...prev, companyId: companies[0]._id }))
    }
  }, [companies, input.companyId])

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const selectCompanyHandler = (companyId) => {
    setInput({ ...input, companyId })
  }

  const handleAddSkill = (e) => {
    e?.preventDefault()
    const trimmed = skillInput.trim().replace(/,/g, "")
    if (!trimmed) return
    if (!skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed])
    }
    setSkillInput("")
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove))
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const selectedCompany = companies.find((c) => c._id === input.companyId)

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!input.companyId) {
      toast.error("Please select a company to post for")
      return
    }

    if (
      !input.title ||
      !input.description ||
      !input.salary ||
      !input.location ||
      !input.jobType ||
      !input.experiance ||
      !input.position
    ) {
      toast.error("Please fill in all required job details")
      return
    }

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      if (res.data.success) {
        toast.success(res.data.message || "Job posted successfully!")
        navigate("/admin/jobs")
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Failed to post job")
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
          <div>
            <button
              onClick={() => navigate("/admin/jobs")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Job Listings</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 text-purple-700">
                <Briefcase className="w-4 h-4" />
              </span>
              Post a New Opportunity
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Publish job details, configure required skills, and screen applicants with AI.
            </p>
          </div>

          {/* Quick Stats or Tips */}
          <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-600 font-medium">
              Candidates are scored based on your requirements list
            </span>
          </div>
        </div>

        {/* Company check warning */}
        {companies.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center my-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-amber-950 mb-1">
              No Company Registered Yet
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 mb-6 max-w-md mx-auto">
              You need to register at least one company before you can publish a job opening.
            </p>
            <Link to="/admin/companies/create">
              <Button className="bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl">
                <Plus className="w-4 h-4 mr-1.5" />
                Register Company First
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Job Form (7 Cols) */}
            <form
              onSubmit={submitHandler}
              className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6"
            >
              {/* Section 1: Basic Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Basic Information
                </h3>

                <div className="space-y-4">
                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="title"
                      value={input.title}
                      onChange={changeEventHandler}
                      placeholder="e.g. Senior Frontend Engineer, Product Designer"
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>

                  {/* Company & Location (2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        Hiring Company <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={input.companyId}
                        onValueChange={selectCompanyHandler}
                      >
                        <SelectTrigger className="h-11 rounded-xl w-full">
                          <SelectValue placeholder="Select a Company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {companies.map((c) => (
                              <SelectItem key={c._id} value={c._id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        Location / Work Mode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                        placeholder="e.g. Remote, Bangalore, Mumbai"
                        className="h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Role Details & Compensation */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Role Specifics & Compensation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Job Type Selector */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={input.jobType}
                      onValueChange={(val) => setInput({ ...input, jobType: val })}
                    >
                      <SelectTrigger className="h-11 rounded-xl w-full">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level Selector */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Experience Required <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={input.experiance}
                      onValueChange={(val) => setInput({ ...input, experiance: val })}
                    >
                      <SelectTrigger className="h-11 rounded-xl w-full">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0-1">Fresher / 0-1 Years</SelectItem>
                          <SelectItem value="1-3">Mid / 1-3 Years</SelectItem>
                          <SelectItem value="3-5">Senior / 3-5 Years</SelectItem>
                          <SelectItem value="5+">Lead / 5+ Years</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary (LPA) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Annual Salary (in LPA) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="number"
                        name="salary"
                        min="0"
                        step="0.5"
                        value={input.salary}
                        onChange={changeEventHandler}
                        placeholder="e.g. 12 or 18.5"
                        className="pl-9 h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Number of Openings */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Number of Openings <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="position"
                      min="1"
                      value={input.position}
                      onChange={changeEventHandler}
                      placeholder="e.g. 2"
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Requirements & Skills */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Key Skills & Requirements
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type a skill (e.g. Docker, Python) and press Enter"
                      className="h-10 rounded-xl flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      variant="outline"
                      className="rounded-xl h-10 px-4 text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>

                  {/* Skill Badges List */}
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-200 min-h-[44px]">
                    {skillsList.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">
                        No skills added yet. Add skills to help ATS evaluate applicants.
                      </span>
                    ) : (
                      skillsList.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-white text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs font-medium"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Job Description & Responsibilities
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">
                    Full Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    name="description"
                    rows={6}
                    value={input.description}
                    onChange={changeEventHandler}
                    placeholder="Provide detailed responsibilities, day-to-day work, team dynamics, and qualifications..."
                    className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-2xl outline-none focus:border-purple-500 transition-colors leading-relaxed resize-y font-normal"
                    required
                  />
                  <p className="text-[11px] text-gray-400">
                    A thorough description yields 40% higher quality applications and more accurate ATS matching.
                  </p>
                </div>
              </div>

              {/* Section 5: Notification Preferences */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/60 to-indigo-50/60 border border-purple-100 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {input.emailAlerts ? (
                        <Bell className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : (
                        <BellOff className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <Label htmlFor="emailAlertsToggle" className="text-xs sm:text-sm font-bold text-gray-900 cursor-pointer">
                        Email Alerts for New Applicants
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                      {input.emailAlerts
                        ? "You will receive an instant email notification every time a candidate applies to this job."
                        : "Email notifications are muted. New applicants will only appear in your HireHub dashboard."}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      id="emailAlertsToggle"
                      type="checkbox"
                      checked={input.emailAlerts}
                      onChange={(e) => setInput({ ...input, emailAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100">
                {loading ? (
                  <Button
                    disabled
                    className="w-full h-12 rounded-xl bg-purple-600 text-white font-semibold text-base shadow-md cursor-not-allowed"
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing Opportunity...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-purple-500/20 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Publish Job Opening
                  </Button>
                )}
              </div>
            </form>

            {/* Right: Live Card Preview (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-purple-600" />
                <span>Live Candidate Preview</span>
              </div>

              {/* Live Preview Container */}
              <div className="p-6 rounded-3xl bg-white border border-purple-200 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase rounded-bl-xl border-l border-b border-purple-100">
                  Preview
                </div>

                {/* Company & Role header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-sm shrink-0">
                    {selectedCompany?.name ? selectedCompany.name.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs text-gray-500 truncate">
                      {selectedCompany?.name || "Company Name"}
                    </h4>
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 leading-snug line-clamp-1">
                      {input.title || "Job Title Will Appear Here"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{input.location || "Location"}</span>
                    </div>
                  </div>
                </div>

                {/* Description excerpt */}
                <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed bg-gray-50/70 p-2.5 rounded-xl">
                  {input.description ||
                    "Job description overview will be displayed here for job seekers..."}
                </p>

                {/* Requirements Chips */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Skills Required
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skillsList.length === 0 ? (
                      <span className="text-xs text-gray-400">None specified</span>
                    ) : (
                      skillsList.slice(0, 5).map((s, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-purple-50 text-purple-700 border-none text-[10px] px-2 py-0.5"
                        >
                          {s}
                        </Badge>
                      ))
                    )}
                    {skillsList.length > 5 && (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5"
                      >
                        +{skillsList.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Badges footer */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[11px]">
                      {input.position || 1} {input.position === 1 ? "Opening" : "Openings"}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-[11px]">
                      {input.jobType}
                    </Badge>
                  </div>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    ₹{input.salary || "0"} LPA
                  </span>
                </div>
              </div>

              {/* Helpful Tips Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Posting Tips</span>
                </div>
                <p className="text-indigo-800 leading-relaxed">
                  Be specific about your tech stack and daily expectations. You can review applicants in real-time under <strong>Manage Jobs</strong> once published.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
