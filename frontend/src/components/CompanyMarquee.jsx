export default function CompanyMarquee() {
  const companies = [
    { name: "Google", domain: "Tech & Cloud" },
    { name: "Microsoft", domain: "Software & AI" },
    { name: "Amazon", domain: "E-commerce & AWS" },
    { name: "Meta", domain: "Social & VR" },
    { name: "Netflix", domain: "Streaming" },
    { name: "Spotify", domain: "Audio Tech" },
    { name: "Uber", domain: "Mobility" },
    { name: "Adobe", domain: "Creative Cloud" },
  ]

  return (
    <div className="py-10 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Trusted by hiring leaders at world-class companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-70 hover:opacity-95 transition-opacity">
          {companies.map((c, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-pointer">
              <span className="text-lg sm:text-xl font-black tracking-tight text-gray-700 group-hover:text-purple-600 transition-colors">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
