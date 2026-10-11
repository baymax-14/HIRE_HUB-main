import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setuser } from "@/redux/authSlice"
import { toast } from "sonner"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [statusText, setStatusText] = useState("Securing session...")

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token")
      const role = searchParams.get("role")
      const provider = searchParams.get("provider") || "OAuth"

      if (!token) {
        toast.error("OAuth token missing. Please try signing in again.")
        navigate("/login")
        return
      }

      try {
        localStorage.setItem("token", token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        axios.defaults.withCredentials = true

        setStatusText("Fetching user profile...")

        const res = await axios.get(`${USER_API_END_POINT}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.data.success && res.data.user) {
          dispatch(setuser(res.data.user))
          toast.success(
            `Successfully signed in with ${
              provider === "github" ? "GitHub" : "Google"
            }!`
          )

          if (res.data.user.role === "recruiter" || role === "recruiter") {
            navigate("/admin/dashboard")
          } else {
            navigate("/")
          }
        } else {
          toast.error("Failed to load user profile. Please login again.")
          navigate("/login")
        }
      } catch (err) {
        console.error("OAuth success handler error:", err)
        toast.error("Failed to finalize authentication session.")
        navigate("/login")
      }
    }

    handleAuth()
  }, [searchParams, navigate, dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf9fe] to-[#f4f1fa] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/80 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#630ed4] to-[#4b41e1] flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
          <Sparkles className="w-8 h-8 animate-pulse text-white" />
        </div>

        <h2 className="text-2xl font-black text-[#131b2e] mb-2 tracking-tight">
          Welcome to Hire<span className="bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] bg-clip-text text-transparent">Hub</span>
        </h2>

        <p className="text-slate-500 text-sm mb-6">
          {statusText}
        </p>

        <div className="flex items-center justify-center gap-3 text-[#630ed4] font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Synchronizing your credentials...</span>
        </div>
      </div>
    </div>
  )
}
