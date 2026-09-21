import { FileText, Cpu, CheckCircle2, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function HowItWorks() {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.auth)

  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Upload & Parse Resume",
      description: "Upload your resume in PDF format. Our AI automatically extracts key skills, work experience, and domain knowledge.",
      color: "from-blue-500 to-indigo-500",
      badgeBg: "bg-blue-50 text-blue-700",
    },
    {
      number: "02",
      icon: Cpu,
      title: "Smart ATS Matching",
      description: "Our machine learning engine matches your background directly with employer requirements, giving you high-affinity scores.",
      color: "from-purple-500 to-pink-500",
      badgeBg: "bg-purple-50 text-purple-700",
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: "One-Click Apply & Track",
      description: "Apply to positions instantly. Monitor your application status in real-time as recruiters review and schedule interviews.",
      color: "from-emerald-500 to-teal-500",
      badgeBg: "bg-emerald-50 text-emerald-700",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50/70 to-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-purple-600 uppercase">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 mt-1">
            How HireHub Accelerates Your Career
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3">
            Say goodbye to endless unanswered applications. HireHub connects your true skills directly with matching hiring teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="relative bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${step.badgeBg}`}>
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2.5 group-hover:text-purple-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal flex-1">
                  {step.description}
                </p>

                {/* Subtle highlight bar */}
                <div className="h-1 w-12 rounded-full bg-gray-100 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300 mt-6" />
              </div>
            )
          })}
        </div>

        {/* Action CTA below steps */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate(user ? "/jobs" : "/signup")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-purple-600 font-semibold text-sm transition-all duration-200 shadow-md cursor-pointer hover:shadow-purple-500/20"
          >
            <span>{user ? "Explore Open Roles" : "Get Started For Free"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
