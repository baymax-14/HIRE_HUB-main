"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setLoading } from "@/redux/authSlice"
import { toast } from "sonner"
import { CrowdCanvas } from "../ui/skiper39"
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Info,
  Loader2,
  UserCheck,
  Briefcase,
  Sparkles,
  UserPlus,
  Camera,
} from "lucide-react"

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(true)

  const navigate = useNavigate()
  const { loading, user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (selectedRole) => {
    setInput((prev) => ({ ...prev, role: selectedRole }))
  }

  const fileHandler = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, WEBP) for your profile picture. Resumes can be uploaded in your profile or when applying.")
        return
      }
      setInput((prev) => ({ ...prev, file: selectedFile }))
      setPhotoPreview(URL.createObjectURL(selectedFile))
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!input.fullname || !input.email || !input.password) {
      toast.error("Please fill in your name, email and password")
      return
    }

    if (!agreedTerms) {
      toast.error("Please agree to the Terms of Service to continue")
      return
    }

    const formData = new FormData()
    formData.append("fullname", input.fullname.trim())
    formData.append("email", input.email.trim())
    formData.append("phoneNumber", input.phoneNumber ? input.phoneNumber.trim() : "")
    formData.append("password", input.password)
    formData.append("role", input.role || "student")
    if (input.file) {
      formData.append("file", input.file)
    }

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully! Please sign in.")
        navigate("/login")
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    dispatch(setLoading(false))
    if (user) {
      navigate("/")
    }
  }, [user, navigate, dispatch])

  return (
    <div className="bg-gradient-to-b from-white via-[#faf9fe] to-[#f4f1fa] text-[#131b2e] min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-[#630ed4]/10 selection:text-[#630ed4]">
      {/* CrowdCanvas Background Animation Layer */}
      <CrowdCanvas className="fixed bottom-0 left-0 right-0 h-[85vh] w-full pointer-events-none z-0 opacity-70" />

      {/* Ambient Light Gradients */}
      <div className="fixed top-[-10vw] left-1/2 -translate-x-1/2 w-[70vw] h-[35vw] bg-gradient-to-b from-[#630ed4]/10 via-[#4b41e1]/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/90 via-white/40 to-transparent pointer-events-none z-0" />

      {/* Top Navigation Header */}
      <header className="relative z-20 w-full py-4 px-6 lg:px-12 backdrop-blur-sm bg-white/40 border-b border-slate-100/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group py-1">
            <span className="font-heading text-2xl sm:text-[26px] font-black tracking-tight text-[#131b2e] transition-transform group-hover:scale-[1.02]">
              Hire<span className="bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] bg-clip-text text-transparent">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/70 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                SSL • SOC2 Type II
              </span>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-slate-200/80 text-[#131b2e] hover:border-[#630ed4]/40 hover:text-[#630ed4] transition-all shadow-xs text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Central Floating Card Section — Matched 1:1 with Login Layout & Scale */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-6">
        <div className="w-full max-w-[500px] mx-auto">
          {/* Elevated Frosted Card */}
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(99,14,212,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-white/90 ring-1 ring-slate-100">
            {/* Header Text */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#630ed4] font-semibold text-xs tracking-wide uppercase mb-2 border border-purple-100">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Get started free</span>
              </div>
              <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#131b2e] leading-tight">
                Create Your Account
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                Join <span className="font-semibold text-[#131b2e]">45,000+ ambitious</span> engineers &amp; tech leaders.
              </p>
            </div>

            {/* Role Selector Pill */}
            <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center mb-5 shadow-inner ring-1 ring-slate-200/60">
              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  input.role === "student"
                    ? "bg-white text-[#131b2e] font-semibold shadow-sm"
                    : "text-slate-500 font-medium hover:text-[#131b2e] hover:bg-white/50"
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#630ed4]" />
                <span>Job Seeker</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-[#630ed4] font-bold">
                  Candidate
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("recruiter")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  input.role === "recruiter"
                    ? "bg-white text-[#131b2e] font-semibold shadow-sm"
                    : "text-slate-500 font-medium hover:text-[#131b2e] hover:bg-white/50"
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#4b41e1]" />
                <span>Recruiter</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                  Hiring
                </span>
              </button>
            </div>

            {/* Credentials Form */}
            <form onSubmit={submitHandler} className="space-y-3.5">
              {/* Row 1: Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Full Name
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs transition-all focus-within:border-[#630ed4] focus-within:ring-4 focus-within:ring-purple-500/10">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="fullname"
                      value={input.fullname}
                      onChange={changeEventHandler}
                      placeholder="Ada Lovelace"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-transparent rounded-xl text-[#131b2e] text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs transition-all focus-within:border-[#630ed4] focus-within:ring-4 focus-within:ring-purple-500/10">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={input.phoneNumber}
                      onChange={changeEventHandler}
                      placeholder="98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-transparent rounded-xl text-[#131b2e] text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Email
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs transition-all focus-within:border-[#630ed4] focus-within:ring-4 focus-within:ring-purple-500/10">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="you@domain.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-transparent rounded-xl text-[#131b2e] text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs transition-all focus-within:border-[#630ed4] focus-within:ring-4 focus-within:ring-purple-500/10">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={input.password}
                      onChange={changeEventHandler}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-9 pr-9 py-2.5 bg-transparent rounded-xl text-[#131b2e] text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Profile Picture Upload */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Profile Picture <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div
                  onClick={() => document.getElementById("profilePictureInput")?.click()}
                  className="py-2.5 px-3 rounded-xl border border-dashed border-slate-200 hover:border-[#630ed4] hover:bg-purple-50/40 bg-white/70 shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                >
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={fileHandler}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2.5 min-w-0">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-7 h-7 rounded-full object-cover border border-purple-200 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#630ed4] flex items-center justify-center shrink-0">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="text-xs text-slate-600 truncate">
                      {input.file ? (
                        <strong className="text-emerald-700">{input.file.name}</strong>
                      ) : (
                        "Upload profile photo (PNG, JPG, WEBP)"
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#630ed4] hover:underline shrink-0 ml-2">
                    {input.file ? "Change" : "Browse"}
                  </span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  id="signupTermsCheck"
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#630ed4] border-slate-300 accent-[#630ed4] cursor-pointer"
                />
                <label
                  htmlFor="signupTermsCheck"
                  className="text-xs text-slate-500 leading-snug cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link to="/" className="text-[#630ed4] font-semibold hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/" className="text-[#630ed4] font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#630ed4] via-purple-700 to-[#4b41e1] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Role Context Notice */}
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-[#630ed4] shrink-0" />
              <span>
                {input.role === "student" ? (
                  <>
                    Registering as <strong className="text-[#131b2e]">Job Seeker</strong>. Instant access to matches.
                  </>
                ) : (
                  <>
                    Registering as <strong className="text-[#131b2e]">Recruiter</strong>. Instant candidate pipeline.
                  </>
                )}
              </span>
            </div>

            {/* Sign In Link */}
            <div className="mt-5 text-center text-xs sm:text-sm text-slate-500">
              Already have an account?
              <Link to="/login" className="text-[#630ed4] font-bold hover:underline ml-1">
                Sign in
              </Link>
            </div>
          </div>

          {/* Trust Badges Under Central Card */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit TLS</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#630ed4]" />
              <span>SOC2 Type II</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>99.99% Uptime</span>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Floating Minimal Footer */}
      <footer className="relative z-10 w-full py-4 px-6 backdrop-blur-xs text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>© 2025 HireHub Inc. High-Signal Tech Career Infrastructure.</div>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
