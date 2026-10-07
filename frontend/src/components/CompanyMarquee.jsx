export default function CompanyMarquee() {
  const companies = [
    { name: "Google", dot: "bg-blue-500" },
    { name: "Microsoft", dot: "bg-blue-600" },
    { name: "Amazon", dot: "bg-amber-500" },
    { name: "Meta", dot: "bg-blue-400" },
    { name: "Netflix", dot: "bg-red-600" },
    { name: "Spotify", dot: "bg-emerald-500" },
    { name: "Uber", dot: "bg-slate-800" },
    { name: "Stripe", dot: "bg-indigo-600" },
    { name: "Adobe", dot: "bg-red-500" },
    { name: "OpenAI", dot: "bg-emerald-600" },
    { name: "Apple", dot: "bg-slate-900" },
  ]

  return (
    <section className="w-full py-6 bg-[#f2f3ff]/40 border-y border-[#dae2fd]/60 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-3">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#64748b] font-semibold">
            Engineering teams actively hiring on HireHub
          </span>
        </div>
      </div>

      {/* Infinite Scroll Track with fade masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16">
          {/* Group 1 */}
          <div className="flex items-center gap-12 sm:gap-16 shrink-0 opacity-75">
            {companies.map((c, i) => (
              <span
                key={i}
                className="font-heading text-lg sm:text-xl font-extrabold tracking-tighter text-[#131b2e] hover:text-[#7c3aed] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {c.name}
              </span>
            ))}
          </div>

          {/* Group 2 (Duplicate for Seamless Loop) */}
          <div className="flex items-center gap-12 sm:gap-16 shrink-0 opacity-75">
            {companies.map((c, i) => (
              <span
                key={`dup-${i}`}
                className="font-heading text-lg sm:text-xl font-extrabold tracking-tighter text-[#131b2e] hover:text-[#7c3aed] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
