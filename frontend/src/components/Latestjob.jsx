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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-xs sm:text-sm font-bold tracking-wider text-purple-600 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Handpicked Roles
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 mt-1">
            Latest Job Openings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Freshly posted opportunities ready for immediate review
          </p>
        </div>

        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 group cursor-pointer"
        >
          <span>View all openings</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
