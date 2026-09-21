import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setsearchedQuery } from "@/redux/jobslice"
import { ArrowRight, Mail, ShieldCheck } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    toast.success("Thank you for subscribing to job alerts!")
    setEmail("")
  }

  const handleCategoryClick = (category) => {
    dispatch(setsearchedQuery(category))
    navigate("/jobs")
  }

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Hire<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-5">
              HireHub is an intelligent recruitment platform connecting ambition with opportunity. 
              Accelerate your hiring with AI resume screening and direct applicant management.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="max-w-sm flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get weekly job alerts..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm cursor-pointer transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Candidate Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Roles
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span
                  onClick={() => handleCategoryClick("Frontend Developer")}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Frontend Developer
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleCategoryClick("Backend Developer")}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Backend Developer
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleCategoryClick("Data Science")}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Data Science & AI
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleCategoryClick("Full Stack Developer")}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Full Stack Developer
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleCategoryClick("UI/UX Designer")}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                >
                  UI/UX Designer
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} HireHub. Crafted for ambitious professionals.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
