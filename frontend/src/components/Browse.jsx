import Navbar from "./shared/Navbar"
import Rightjob from "./jobscard/Rightjob"
import { useDispatch, useSelector } from "react-redux"
import Usegetalljobs from "@/hooks/usegetAlljobs"
import { useEffect } from "react"
import { setsearchedQuery } from "@/redux/jobslice"
import SkeletonCard from "./ui/SkeletonCard"

export default function Browse() {
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(setsearchedQuery(""))
    }
  }, [dispatch])
  Usegetalljobs()

  const { alljobs, loading } = useSelector((store) => store.job)
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-lg sm:text-xl lg:text-2xl my-4 sm:my-6 lg:my-10 text-center sm:text-left">
          Search result ({alljobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : alljobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm sm:text-base text-gray-500">No results found</span>
                <span className="text-xs text-gray-400">Try adjusting your search terms</span>
              </div>
            </div>
          ) : (
            alljobs.map((job) => {
              return <Rightjob key={job._id} job={job} />
            })
          )}
        </div>
      </div>
    </div>
  )
}
