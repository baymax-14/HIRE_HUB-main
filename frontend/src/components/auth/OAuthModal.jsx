import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setuser } from "@/redux/authSlice"
import { toast } from "sonner"
import {
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Loader2,
  User,
} from "lucide-react"

export default function OAuthModal({ isOpen, onClose, provider = "google", role = "student" }) {
  const [activeTab, setActiveTab] = useState("keys") // 'keys' or 'test'
  const [loading, setLoading] = useState(false)
  const [testUser, setTestUser] = useState({
    name: provider === "github" ? "GitHub Developer" : "Alex Turner",
    email: provider === "github" ? "developer@github-hirehub.dev" : "alex.turner@gmail.com",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!isOpen) return null

  const isGoogle = provider.toLowerCase() === "google"
  const providerTitle = isGoogle ? "Google" : "GitHub"

  const handleProceedRealOAuth = () => {
    window.location.href = `${USER_API_END_POINT}/auth/${provider.toLowerCase()}?role=${role}`
  }

  const handleTestLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${USER_API_END_POINT}/auth/demo-login`, {
        provider: provider.toLowerCase(),
        role,
        email: testUser.email,
        name: testUser.name,
        avatar: isGoogle
          ? "https://lh3.googleusercontent.com/a/default-user"
          : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      }, {
        withCredentials: true,
      })

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        }
        dispatch(setuser(res.data.user))
        toast.success(res.data.message || `Signed in with ${providerTitle}!`)
        onClose()

        if (res.data.user?.role === "recruiter" || role === "recruiter") {
          navigate("/admin/dashboard")
        } else {
          navigate("/")
        }
      }
    } catch (err) {
      console.error("Test OAuth error:", err)
      toast.error(err.response?.data?.message || "Failed to complete test sign-in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative overflow-hidden text-[#131b2e]">
        {/* Top Accent Gradient Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${isGoogle ? "bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500" : "bg-gradient-to-r from-slate-800 via-purple-700 to-slate-900"}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
            {isGoogle ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA3545" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current text-slate-800" viewBox="0 0 24 24">
                <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {providerTitle} Authentication
            </h3>
            <p className="text-xs text-slate-500">
              Signing in as <strong className="text-[#630ed4] capitalize">{role === "recruiter" ? "Recruiter" : "Job Seeker"}</strong>
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === "keys"
                ? "bg-white text-[#131b2e] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Real OAuth Setup
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("test")}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === "test"
                ? "bg-white text-[#630ed4] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Instant Test Sign-In
          </button>
        </div>

        {activeTab === "keys" ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#630ed4]">
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Ready for Real {providerTitle} OAuth 2.0</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Add your client keys into <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 text-[#630ed4] font-semibold">backhand/.env</code>:
              </p>
              <div className="bg-slate-900 text-purple-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
                {isGoogle ? (
                  <>
                    <div>GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com</div>
                    <div>GOOGLE_CLIENT_SECRET=GOCSPX-your_secret</div>
                  </>
                ) : (
                  <>
                    <div>GITHUB_CLIENT_ID=your_github_client_id</div>
                    <div>GITHUB_CLIENT_SECRET=your_github_client_secret</div>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Authorized Redirect URI: <code className="text-slate-700 bg-white px-1 rounded">http://localhost:8000/api/v1/user/auth/{provider.toLowerCase()}/callback</code>
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceedRealOAuth}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#630ed4] to-[#4b41e1] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Continue to {providerTitle} Login</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleTestLogin} className="space-y-3.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
              Test sign-in immediately simulates a verified {providerTitle} session with real JWT authentication &amp; Redux state.
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">
                Full Name
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-white">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={testUser.name}
                  onChange={(e) => setTestUser({ ...testUser, name: e.target.value })}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#131b2e] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">
                {providerTitle} Email
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-white">
                <input
                  type="email"
                  value={testUser.email}
                  onChange={(e) => setTestUser({ ...testUser, email: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#131b2e] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#630ed4] via-purple-700 to-[#4b41e1] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in as {providerTitle} User</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit TLS OAuth 2.0</span>
          </div>
          <span>HireHub Security Protocol</span>
        </div>
      </div>
    </div>
  )
}
