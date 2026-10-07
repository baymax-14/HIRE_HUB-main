import { Gauge, ScanText, Network, Send, CheckCircle2, Zap, Clock } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01 / PARSE",
      icon: ScanText,
      title: "Upload & Neural Parse",
      description: "Natural language parsing digests commits, production tech stacks, and quantified impact metrics into a calibrated ATS matrix.",
      badgeClass: "bg-[#eaddff] text-[#25005a]",
      iconBg: "bg-[#630ed4]/10 text-[#630ed4]",
      statIcon: CheckCircle2,
      statIconColor: "text-[#10b981]",
      statLabel: "98.4% Parse Accuracy",
      statValue: "< 3.2s",
      statValColor: "text-[#630ed4]",
    },
    {
      number: "02 / MATCH",
      icon: Network,
      title: "Vector Fit & Benchmarking",
      description: "Deep embedding vectors evaluate candidate proficiencies against active engineering team architectures, compensation brackets, and tech stack fit.",
      badgeClass: "bg-[#e2dfff] text-[#0f0069]",
      iconBg: "bg-[#4b41e1]/10 text-[#4b41e1]",
      statIcon: Zap,
      statIconColor: "text-[#630ed4]",
      statLabel: "Live Calibration",
      statValue: "99.1% Confidence",
      statValColor: "text-emerald-600",
    },
    {
      number: "03 / DELIVER",
      icon: Send,
      title: "One-Click Direct Interview",
      description: "Skip recruiter spam filters. Fast-track pre-verified packages straight onto hiring manager dashboards with scheduled introductory chats.",
      badgeClass: "bg-[#eaedff] text-[#630ed4]",
      iconBg: "bg-[#630ed4]/10 text-[#630ed4]",
      statIcon: Clock,
      statIconColor: "text-[#10b981]",
      statLabel: "Under 48h Turnaround",
      statValue: "Fast-Track",
      statValColor: "text-[#630ed4]",
    },
  ]

  return (
    <section className="w-full py-16 sm:py-24 bg-[#f2f3ff]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#630ed4]/10 text-[#630ed4] font-mono text-xs uppercase font-bold tracking-wider mb-2">
            <Gauge className="w-3.5 h-3.5" /> Speed to Offer
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#131b2e] tracking-tight font-extrabold">
            Autonomous 3-Step Match Engine
          </h2>
          <p className="text-sm sm:text-base text-[#4a4455] mt-2 leading-relaxed font-normal">
            Engineered to eliminate ghost applications and calibrate matching precision between verified engineer profiles and engineering hiring rubrics.
          </p>
        </div>

        {/* Step Cards Grid with Dynamic Track Linkers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Decorative connector bar behind cards on desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 -translate-y-6 bg-gradient-to-r from-[#630ed4]/20 via-[#630ed4] to-[#4b41e1]/30 pointer-events-none z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon
            const StatIcon = step.statIcon
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#f1f5f9] shadow-xs card-glow-hover relative z-10 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold tracking-wider ${step.badgeClass}`}>
                      {step.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl text-[#131b2e] font-bold">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#4a4455] mt-2 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 p-3 rounded-2xl bg-[#f2f3ff]/70 border border-[#f1f5f9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatIcon className={`w-4 h-4 ${step.statIconColor}`} />
                    <span className="text-xs text-[#131b2e] font-semibold">{step.statLabel}</span>
                  </div>
                  <span className={`font-mono text-[11px] font-bold ${step.statValColor}`}>
                    {step.statValue}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
