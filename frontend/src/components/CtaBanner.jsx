import { ArrowRight, Briefcase, Sparkles, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function CtaBanner() {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.auth)

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 text-white shadow-xl flex flex-col justify-between group">
          {/* Ambient blur glow */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              For Job Seekers
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Ready to take the next step in your career?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md">
              Create your profile, upload your resume for free, and let our AI match you with roles that fit your exact expertise.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate(user ? "/jobs" : "/signup")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{user ? "Explore Jobs" : "Create Candidate Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recruiter Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col justify-between group">
          {/* Ambient blur glow */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-4">
              <Building2 className="w-3.5 h-3.5" />
              For Recruiters & Hiring Managers
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Hiring top-tier engineering & design talent?
            </h3>
            <p className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-md">
              Post your job openings, evaluate candidates with automated AI resume scoring, and streamline your recruitment pipeline.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate(user?.role === "recruiter" ? "/admin/jobs" : "/signup")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-950 text-white hover:bg-black font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{user?.role === "recruiter" ? "Post a New Job" : "Start Hiring Talent"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
