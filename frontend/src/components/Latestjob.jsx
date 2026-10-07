import { useSelector } from "react-redux"
import Latestjobcard from "./Latestjobcard"
import SkeletonCard from "./ui/SkeletonCard"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles, Inbox } from "lucide-react"

export default function Latestjob() {
  const { alljobs, loading } = useSelector((store) => store.job)
  const navigate = useNavigate()

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#630ed4]/10 text-[#630ed4] font-mono text-xs uppercase font-bold tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /> Handpicked & Verified
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#131b2e] tracking-tight font-extrabold">
            Featured Technical Openings
          </h2>
          <p className="text-sm sm:text-base text-[#4a4455] mt-1">
            Direct from leading technology companies offering competitive global compensation.
          </p>
        </div>

        <button
          onClick={() => navigate("/jobs")}
          className="inline-flex items-center gap-2 text-sm text-[#630ed4] hover:text-[#4b41e1] group transition-colors self-start md:self-end font-bold cursor-pointer"
        >
          <span>View all 14,200+ roles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : !alljobs || alljobs.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 bg-gray-50/70 rounded-3xl border border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">No jobs available right now</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Check back soon or explore our category filters to find upcoming roles!
              </p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-2 text-xs font-semibold text-purple-600 hover:underline cursor-pointer"
              >
                Browse All Openings →
              </button>
            </div>
          </div>
        ) : (
          alljobs?.slice(0, 6).map((job) => <Latestjobcard key={job._id} job={job} />)
        )}
      </div>
    </section>
  )
}
