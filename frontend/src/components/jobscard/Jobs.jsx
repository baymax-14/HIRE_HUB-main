import { useSelector, useDispatch } from "react-redux";
import Navbar from "../shared/Navbar";
import FilterCard from "./FilterCard";
import Rightjob from "./Rightjob";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { setCurrentPage } from "@/redux/jobslice";
import Usegetalljobs from "@/hooks/usegetAlljobs";
import SkeletonCard from "../ui/SkeletonCard";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function Jobs() {
  const dispatch = useDispatch();
  const jobState = useSelector((store) => store.job) || {};
  const {
    alljobs = [],
    loading = false,
    totalJobs = 0,
    totalPages = 1,
    currentPage = 1,
    filters = { keyword: "", location: "", jobType: "", salaryMin: 0, salaryMax: 0 },
    searchedQuery = "",
  } = jobState;

  // Trigger the job fetching hook
  Usegetalljobs();

  // Client-side filter for searchedQuery (from HeroSection radio buttons)
  const [filterjobs, setFilterjobs] = useState(alljobs);

  useEffect(() => {
    // When the backend handles filtering via API params, we just display what we get
    setFilterjobs(alljobs);
  }, [alljobs]);

  // Pagination handler
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2);
      }

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // Count active filters
  const activeFilterCount =
    (filters?.keyword ? 1 : 0) +
    (filters?.location ? 1 : 0) +
    (filters?.jobType ? 1 : 0) +
    (((filters?.salaryMin || 0) > 0 || (filters?.salaryMax || 0) > 0) ? 1 : 0) +
    (searchedQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl mt-3 sm:mt-5 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-[280px] lg:min-w-[280px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <FilterCard />
            </div>
          </div>

          {/* Job Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    {totalJobs}
                  </span>{" "}
                  {totalJobs === 1 ? "job" : "jobs"} found
                  {activeFilterCount > 0 && (
                    <span className="text-gray-400">
                      {" "}
                      · {activeFilterCount} filter
                      {activeFilterCount > 1 ? "s" : ""} active
                    </span>
                  )}
                </p>
              </div>
              {totalPages > 1 && (
                <p className="text-xs text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Job Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filterjobs.length <= 0 ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-600">
                  No jobs found
                </p>
                <p className="text-sm text-gray-400 mt-1 text-center max-w-md">
                  Try adjusting your filters or search terms to find more
                  opportunities
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {filterjobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      key={job?._id}
                    >
                      <Rightjob job={job} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8">
                    {/* Previous */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className="px-2 py-2 text-sm text-gray-400"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            currentPage === page
                              ? "bg-purple-600 text-white shadow-sm"
                              : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
