import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setsearchedQuery } from "@/redux/jobslice"

export default function Footer() {
  const [email, setEmail] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your work email")
      return
    }
    toast.success("Thank you for subscribing to weekly curated opportunities!")
    setEmail("")
  }

  const handleRoleClick = (role) => {
    dispatch(setsearchedQuery(role))
    navigate("/jobs")
  }

  return (
    <footer className="w-full bg-[#f2f3ff]/60 pt-16 pb-12 border-t border-[#dae2fd]/60 text-[#131b2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center group">
              <span className="font-heading text-2xl font-black tracking-tight text-[#131b2e]">
                Hire<span className="bg-gradient-to-r from-[#630ed4] to-[#4b41e1] bg-clip-text text-transparent">Hub</span>
              </span>
            </Link>
            <p className="text-[#4a4455] text-sm max-w-sm leading-relaxed font-normal">
              Next-generation autonomous talent discovery. Precision AI career matching, verified compensation intelligence, and friction-free engineer mobility.
            </p>

            {/* Newsletter */}
            <div className="w-full max-w-sm flex flex-col gap-1.5 pt-1">
              <span className="font-mono text-xs text-[#131b2e] font-semibold uppercase tracking-wider">
                Weekly Curated Opportunities
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#f1f5f9] shadow-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full bg-transparent px-3 py-1.5 text-sm text-[#131b2e] placeholder-[#7b7487] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#630ed4] text-white rounded-xl text-xs font-bold hover:bg-[#7c3aed] transition-all shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Live System Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#f1f5f9] text-xs font-mono shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
              </span>
              <span className="text-[#4a4455] uppercase tracking-wider font-semibold text-[10px]">
                All AI Match Engines Active
              </span>
            </div>
          </div>

          {/* Column 1: Popular Roles */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#131b2e] font-bold uppercase tracking-wider font-mono">
              Popular Roles
            </span>
            <nav className="flex flex-col gap-2">
              {[
                "Machine Learning Engineer",
                "Full-Stack Architect",
                "Product Design Lead",
                "Cloud Platform Engineer",
                "Engineering Manager",
              ].map((role) => (
                <span
                  key={role}
                  onClick={() => handleRoleClick(role)}
                  className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer"
                >
                  {role}
                </span>
              ))}
            </nav>
          </div>

          {/* Column 2: Explore Platform */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#131b2e] font-bold uppercase tracking-wider font-mono">
              Explore Platform
            </span>
            <nav className="flex flex-col gap-2">
              <Link to="/companies" className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors">
                Vetted Tech Unicorns
              </Link>
              <Link to="/jobs" className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors">
                Salary Benchmark Index
              </Link>
              <Link to="/jobs" className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors">
                Resume AI Optimizer
              </Link>
              <Link to="/jobs" className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors">
                Interview Preparation
              </Link>
              <span onClick={() => handleRoleClick("Remote")} className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer">
                Remote Only Hub
              </span>
            </nav>
          </div>

          {/* Column 3: Platform & Trust */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#131b2e] font-bold uppercase tracking-wider font-mono">
              Platform & Trust
            </span>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer">
                Candidate Privacy
              </span>
              <span className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer">
                Terms of Service
              </span>
              <span className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer">
                Security & SOC2 Type II
              </span>
              <span className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer">
                Cookie Preferences
              </span>
              <span className="text-sm text-[#4a4455] hover:text-[#630ed4] transition-colors cursor-pointer">
                Help & Candidate Support
              </span>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#dae2fd]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#4a4455] text-xs">
          <p>© 2025 HireHub Technologies Inc. Built for progressive engineering leaders and creators.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#630ed4] transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-[#630ed4] transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-[#630ed4] transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
