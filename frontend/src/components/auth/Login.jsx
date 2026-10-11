"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setLoading, setuser } from "@/redux/authSlice"
import { toast } from "sonner"
import { CrowdCanvas } from "../ui/skiper39"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Info,
  Loader2,
  UserCheck,
  Briefcase,
  Sparkles,
} from "lucide-react"

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  const { loading, user } = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (selectedRole) => {
    setInput((prev) => ({ ...prev, role: selectedRole }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!input.email || !input.password) {
      toast.error("Please enter both email and password")
      return
    }

    try {
      dispatch(setLoading(true))
      axios.defaults.withCredentials = true

      const payload = {
        email: input.email.trim(),
        password: input.password,
        role: input.role || "student",
      }

      const res = await axios.post(`${USER_API_END_POINT}/login`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        }
        dispatch(setuser(res.data.user))
        toast.success(res.data.message || "Logged in successfully!")

        if (res.data.user?.role === "recruiter") {
          navigate("/admin/dashboard")
        } else {
          navigate("/")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error?.response?.data?.message || "Login failed. Please check your credentials.")
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
      <header className="relative z-20 w-full py-5 px-6 lg:px-12 backdrop-blur-sm bg-white/40 border-b border-slate-100/60">
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

      {/* Central Spacious Floating Card Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-[490px] mx-auto">
          {/* Elevated Frosted Card */}
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-7 sm:p-10 shadow-[0_20px_60px_-15px_rgba(99,14,212,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-white/90 ring-1 ring-slate-100">
            {/* Header Text */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#630ed4] font-semibold text-xs tracking-wide uppercase mb-3 border border-purple-100">
                <Lock className="w-3.5 h-3.5" />
                <span>Welcome back</span>
              </div>
              <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[#131b2e] leading-tight">
                Sign in to HireHub
              </h1>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Find your place among <span className="font-semibold text-[#131b2e]">45,000+ ambitious</span>{" "}
                engineers, designers &amp; tech leaders.
              </p>
            </div>

            {/* Role Selector Pill */}
            <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center mb-6 shadow-inner ring-1 ring-slate-200/60">
              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
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
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
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
            <form onSubmit={submitHandler} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Work or Personal Email
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs transition-all focus-within:border-[#630ed4] focus-within:ring-4 focus-within:ring-purple-500/10">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="you@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-transparent rounded-xl text-[#131b2e] text-sm placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault()
                      toast.info("Password reset link will be sent to your email.")
                    }}
                    className="text-xs text-[#630ed4] font-semibold hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs transition-all focus-within:border-[#630ed4] focus-within:ring-4 focus-within:ring-purple-500/10">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-transparent rounded-xl text-[#131b2e] text-sm placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded text-[#630ed4] border-slate-300 accent-[#630ed4] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">
                    Keep me signed in
                  </span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  30-day session
                </span>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#630ed4] via-purple-700 to-[#4b41e1] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to HireHub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Role Context Toast / Notice */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-xs flex items-center gap-2.5">
              <Info className="w-4 h-4 text-[#630ed4] shrink-0" />
              <span>
                {input.role === "student" ? (
                  <>
                    Signing in as <strong className="text-[#131b2e]">Job Seeker</strong>. You&apos;ll be redirected to calibrated job matches.
                  </>
                ) : (
                  <>
                    Signing in as <strong className="text-[#131b2e]">Recruiter</strong>. You&apos;ll be redirected to your talent pipeline.
                  </>
                )}
              </span>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account yet?
              <Link to="/signup" className="text-[#630ed4] font-bold hover:underline ml-1">
                Sign up free
              </Link>
            </div>
          </div>

          {/* Trust Badges Under Central Card */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400 font-medium">
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
      <footer className="relative z-10 w-full py-5 px-6 backdrop-blur-xs text-slate-400 text-xs">
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
