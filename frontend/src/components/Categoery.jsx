import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { setsearchedQuery } from "@/redux/jobslice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { 
  Code2, 
  Server, 
  Database, 
  Palette, 
  Cpu, 
  Smartphone, 
  Cloud, 
  LineChart, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react"

const categories = [
  {
    title: "Frontend Developer",
    openings: "380+ Openings",
    icon: Code2,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Backend Developer",
    openings: "450+ Openings",
    icon: Server,
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600",
  },
  {
    title: "Full Stack Developer",
    openings: "520+ Openings",
    icon: Sparkles,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
  },
  {
    title: "Data Science & AI",
    openings: "290+ Openings",
    icon: Cpu,
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
  },
  {
    title: "UI/UX Designer",
    openings: "180+ Openings",
    icon: Palette,
    gradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-600",
  },
  {
    title: "DevOps & Cloud",
    openings: "210+ Openings",
    icon: Cloud,
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconColor: "text-cyan-600",
  },
  {
    title: "Mobile App Developer",
    openings: "160+ Openings",
    icon: Smartphone,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
  },
  {
    title: "Data Analyst",
    openings: "240+ Openings",
    icon: LineChart,
    gradient: "from-lime-500/10 to-emerald-500/10",
    iconColor: "text-lime-600",
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
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-xs sm:text-sm font-bold tracking-wider text-purple-600 uppercase">
            Curated Sectors
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 mt-1">
            Explore Popular Categories
          </h2>
        </div>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-3 sm:mt-0 text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 group cursor-pointer"
        >
          <span>View all roles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <Carousel className="w-full relative px-2">
        <CarouselContent className="-ml-3">
          {categories.map((cat, index) => {
            const Icon = cat.icon
            return (
              <CarouselItem
                key={index}
                className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div
                  onClick={() => searchHandler(cat.title)}
                  className="h-full p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.gradient} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-base leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {cat.openings}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold text-gray-500 group-hover:text-purple-600">
                    <span>Explore opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-4 bg-white shadow-md border-gray-200 hover:bg-purple-50" />
          <CarouselNext className="-right-4 bg-white shadow-md border-gray-200 hover:bg-purple-50" />
        </div>
      </Carousel>
    </section>
  )
}
