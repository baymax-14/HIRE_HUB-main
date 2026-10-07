import { setsearchedQuery } from "@/redux/jobslice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { 
  Code, 
  Terminal, 
  Layers, 
  BrainCircuit, 
  Palette, 
  Cloud, 
  Smartphone, 
  LayoutDashboard, 
  ArrowRight 
} from "lucide-react"

const disciplines = [
  {
    title: "Frontend Engineering",
    open: "420+ Open",
    description: "React 19, Next.js, Vue, WebGL & Design Systems",
    demandLabel: "96% Very High",
    demandPercent: "96%",
    icon: Code,
    gradient: "from-[#630ed4] to-[#4b41e1]",
    badgeClass: "bg-[#eaedff] text-[#630ed4]",
  },
  {
    title: "Backend Architecture",
    open: "480+ Open",
    description: "Node.js, Go, Rust, Java & Distributed Microservices",
    demandLabel: "98% Peak",
    demandPercent: "98%",
    icon: Terminal,
    gradient: "from-[#4b41e1] to-[#7c3aed]",
    badgeClass: "bg-[#eaedff] text-[#4b41e1]",
  },
  {
    title: "Full Stack Systems",
    open: "590+ Open",
    description: "End-to-End Scale, GraphQL, PostgreSQL & Redis",
    demandLabel: "94% High",
    demandPercent: "94%",
    icon: Layers,
    gradient: "from-[#630ed4] to-[#ec4899]",
    badgeClass: "bg-[#eaedff] text-[#ec4899]",
  },
  {
    title: "Data Science & AI/ML",
    open: "340+ Open",
    description: "LLMs, PyTorch, Vector Search & Production MLOps",
    demandLabel: "99% Surge",
    demandPercent: "99%",
    icon: BrainCircuit,
    gradient: "from-[#7c3aed] to-[#4b41e1]",
    badgeClass: "bg-[#eaedff] text-[#7c3aed] font-bold",
  },
  {
    title: "UI/UX & Product Design",
    open: "210+ Open",
    description: "Design Systems, Interaction Architecture & Figma",
    demandLabel: "88% Solid",
    demandPercent: "88%",
    icon: Palette,
    gradient: "from-[#4b41e1] to-[#630ed4]",
    badgeClass: "bg-[#eaedff] text-[#4b41e1]",
  },
  {
    title: "Cloud & DevOps SRE",
    open: "260+ Open",
    description: "Kubernetes, Terraform, AWS, CI/CD Security",
    demandLabel: "95% High",
    demandPercent: "95%",
    icon: Cloud,
    gradient: "from-[#630ed4] to-[#7c3aed]",
    badgeClass: "bg-[#eaedff] text-[#630ed4]",
  },
  {
    title: "Mobile Engineering",
    open: "190+ Open",
    description: "Swift, Kotlin Multiplatform, Flutter & React Native",
    demandLabel: "89% Steady",
    demandPercent: "89%",
    icon: Smartphone,
    gradient: "from-[#645efb] to-[#630ed4]",
    badgeClass: "bg-[#eaedff] text-[#4b41e1]",
  },
  {
    title: "Technical Product Lead",
    open: "170+ Open",
    description: "B2B SaaS, Platform APIs, Metrics & GTM Strategy",
    demandLabel: "91% High",
    demandPercent: "91%",
    icon: LayoutDashboard,
    gradient: "from-[#630ed4] via-[#ec4899] to-[#4b41e1]",
    badgeClass: "bg-[#eaedff] text-[#ec4899]",
  },
]

export default function Categoery() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchHandler = (categoryTitle) => {
    dispatch(setsearchedQuery(categoryTitle))
    navigate("/jobs")
  }

  return (
    <section className="w-full py-16 sm:py-24 bg-[#faf8ff] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#630ed4]/10 text-[#630ed4] font-mono text-xs uppercase font-bold tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#630ed4] animate-ping" /> Curated Sectors
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#131b2e] tracking-tight font-extrabold">
              Explore In-Demand Disciplines
            </h2>
            <p className="text-sm sm:text-base text-[#4a4455] mt-1">
              High-velocity engineering roles verified with transparent compensation benchmarks.
            </p>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 text-sm text-[#630ed4] hover:text-[#4b41e1] group transition-colors self-start md:self-end font-bold cursor-pointer"
          >
            <span>View all disciplines</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* 8 Categories Grid with Density Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {disciplines.map((cat, index) => {
            const Icon = cat.icon
            return (
              <div
                key={index}
                onClick={() => searchHandler(cat.title)}
                className="bg-white p-5 rounded-2xl border border-[#f1f5f9] shadow-xs card-glow-hover flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-full ${cat.badgeClass}`}>
                      {cat.open}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg text-[#131b2e] font-bold group-hover:text-[#630ed4] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#4a4455] mt-1.5 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f1f5f9]">
                  <div className="flex justify-between items-center text-xs font-mono text-[#4a4455] mb-1.5">
                    <span>Market Demand</span>
                    <span className="text-emerald-600 font-bold">{cat.demandLabel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${cat.gradient} rounded-full`}
                      style={{ width: cat.demandPercent }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
