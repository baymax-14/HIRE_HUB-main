import { ArrowRight, UploadCloud, Lock, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function CtaBanner() {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.auth)

  return (
    <section className="w-full py-16 sm:py-24 bg-[#f2f3ff]/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Candidate Card (Dark Iridescent Glass) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#283044] to-slate-950 p-8 sm:p-10 rounded-3xl text-[#eef0ff] shadow-2xl border border-white/10 flex flex-col justify-between group">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#630ed4]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#645efb]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d2bbff] border border-white/15 font-mono text-xs uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                For Engineering Candidates
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl text-white font-extrabold max-w-md tracking-tight">
                Accelerate your engineering journey today.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-sm leading-relaxed font-normal">
                Upload your resume for an autonomous evaluation and get matched with verified offers within 48 hours.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(user ? "/profile" : "/signup")}
                className="shimmer-fx px-7 py-3.5 bg-white text-slate-900 rounded-full text-sm font-bold shadow-lg hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-[#630ed4]" />
                <span>Upload Resume & Match</span>
              </button>
              <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#10b981]" /> 100% Confidential
              </span>
            </div>
          </div>

          {/* Recruiter Card (Rich Purple Vibrant Mesh) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#630ed4] via-[#7c3aed] to-[#4b41e1] p-8 sm:p-10 rounded-3xl text-white shadow-2xl shadow-purple-500/25 border border-white/20 flex flex-col justify-between group">
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#645efb]/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/25 font-mono text-xs uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                For Engineering Leaders
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl text-white font-extrabold max-w-md tracking-tight">
                Hire vetted engineers in the top 5% bracket.
              </h3>
              <p className="text-sm sm:text-base text-purple-100 mt-2 max-w-sm leading-relaxed font-normal">
                Zero noise. Target pre-screened technical talent ready to interview immediately with verified competencies.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(user?.role === "recruiter" ? "/admin/jobs" : "/signup")}
                className="shimmer-fx px-7 py-3.5 bg-slate-950 text-white rounded-full text-sm font-bold shadow-lg hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border border-white/10"
              >
                <span>Post a Job Opening</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-white/80">First role posted free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
