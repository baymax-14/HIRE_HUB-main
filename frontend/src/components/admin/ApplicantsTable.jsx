"use client"

import React, { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  MoreHorizontal,
  Sparkles,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import { APPLICATION_API_END_POINT } from "@/util/const"
import axios from "axios"
import AiEvaluationModal from "./AiEvaluationModal"

const shortlisting = ["Accepted", "Rejected"]

export default function ApplicantsTable() {
  const { applicants } = useSelector((store) => store.application)
  
  // Local state for interactive filtering, sorting, and modal
  const [searchQuery, setSearchQuery] = useState("")
  const [filterVerdict, setFilterVerdict] = useState("all")
  const [sortBy, setSortBy] = useState("highest_score") // "highest_score", "lowest_score", "newest"
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localApplications, setLocalApplications] = useState([])

  // Keep local applications synced with redux store
  React.useEffect(() => {
    if (applicants?.application) {
      setLocalApplications(applicants.application)
    }
  }, [applicants])

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status })
      if (res.data.success) {
        toast.success(res.data.message)
        // Update locally
        setLocalApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: status.toLowerCase() } : app))
        )
        if (selectedApplicant && selectedApplicant._id === id) {
          setSelectedApplicant((prev) => ({ ...prev, status: status.toLowerCase() }))
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status")
    }
  }

  const handleEvaluationUpdated = (applicationId, newEvaluation) => {
    setLocalApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId ? { ...app, aiEvaluation: newEvaluation } : app
      )
    )
    if (selectedApplicant && selectedApplicant._id === applicationId) {
      setSelectedApplicant((prev) => ({ ...prev, aiEvaluation: newEvaluation }))
    }
  }

  const handleReanalyzeQuick = async (applicationId) => {
    try {
      toast.info("Re-evaluating resume...")
      axios.defaults.withCredentials = true
      const res = await axios.post(`${APPLICATION_API_END_POINT}/${applicationId}/reanalyze`)
      if (res.data.success) {
        toast.success("Resume re-evaluated!")
        handleEvaluationUpdated(applicationId, res.data.aiEvaluation)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to re-analyze resume")
    }
  }

  const openEvaluationModal = (item) => {
    setSelectedApplicant(item)
    setIsModalOpen(true)
  }

  // Helper for match score styling
  const getBadgeStyle = (score, verdict) => {
    if (!score && verdict === "Pending") {
      return "bg-slate-100 text-slate-700 border-slate-200"
    }
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
    if (score >= 60) return "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
    if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
    return "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
  }

  // Filter and sort applicants
  const filteredAndSortedApplicants = useMemo(() => {
    let list = [...(localApplications || [])]

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((item) => {
        const name = item?.applicant?.fullname?.toLowerCase() || ""
        const email = item?.applicant?.email?.toLowerCase() || ""
        const skills = (item?.applicant?.profile?.skills || []).join(" ").toLowerCase()
        return name.includes(q) || email.includes(q) || skills.includes(q)
      })
    }

    // Verdict qualification filter
    if (filterVerdict !== "all") {
      list = list.filter((item) => {
        const score = item?.aiEvaluation?.score ?? 0
        if (filterVerdict === "highly_qualified") return score >= 80
        if (filterVerdict === "qualified") return score >= 60 && score < 80
        if (filterVerdict === "under_qualified") return score < 60
        return true
      })
    }

    // Sorting
    list.sort((a, b) => {
      const scoreA = a?.aiEvaluation?.score ?? 0
      const scoreB = b?.aiEvaluation?.score ?? 0
      if (sortBy === "highest_score") return scoreB - scoreA
      if (sortBy === "lowest_score") return scoreA - scoreB
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

    return list
  }, [localApplications, searchQuery, filterVerdict, sortBy])

  return (
    <div className="w-full space-y-4">
      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search candidate by name, email, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs sm:text-sm bg-gray-50/60 border-gray-200 rounded-lg"
          />
        </div>

        {/* Filter and Sort options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Verdict Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="bg-transparent border-none text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Qualifications</option>
              <option value="highly_qualified">Top Matches (80%+)</option>
              <option value="qualified">Qualified (60% - 79%)</option>
              <option value="under_qualified">Under-Qualified (&lt;60%)</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="highest_score">Highest Match Score</option>
              <option value="lowest_score">Lowest Match Score</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200/80 shadow-xs">
        <Table className="min-w-full">
          <TableCaption className="text-xs sm:text-sm pb-3">
            Showing {filteredAndSortedApplicants.length} candidate(s)
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="text-xs font-bold text-gray-700 px-3 sm:px-4">Candidate</TableHead>
              <TableHead className="text-xs font-bold text-gray-700 px-3 sm:px-4">Contact</TableHead>
              <TableHead className="text-xs font-bold text-gray-700 px-3 sm:px-4">
                <div className="flex items-center gap-1 text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI ATS Score
                </div>
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-700 px-3 sm:px-4">Resume</TableHead>
              <TableHead className="text-xs font-bold text-gray-700 px-3 sm:px-4">Status</TableHead>
              <TableHead className="text-xs font-bold text-gray-700 px-3 sm:px-4">Applied Date</TableHead>
              <TableHead className="text-right text-xs font-bold text-gray-700 px-3 sm:px-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 text-sm py-10">
                  No applicants match the current criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedApplicants.map((item) => {
                const evalData = item?.aiEvaluation || {}
                const score = evalData.score ?? 0
                const verdict = evalData.verdict || "Pending"
                const badgeClass = getBadgeStyle(score, verdict)

                return (
                  <TableRow key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate Name & Skills */}
                    <TableCell className="text-xs sm:text-sm px-3 sm:px-4 py-3">
                      <div className="font-semibold text-gray-900">{item?.applicant?.fullname}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">
                        {item?.applicant?.email}
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="text-xs px-3 sm:px-4 py-3 text-gray-600">
                      {item?.applicant?.phoneNumber || "N/A"}
                    </TableCell>

                    {/* AI ATS Match Badge */}
                    <TableCell className="text-xs px-3 sm:px-4 py-3">
                      <button
                        onClick={() => openEvaluationModal(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold cursor-pointer transition-all shadow-2xs ${badgeClass}`}
                        title="Click to view full AI qualification analysis"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{score}%</span>
                        <span className="hidden sm:inline font-normal">({verdict})</span>
                      </button>
                    </TableCell>

                    {/* Resume link */}
                    <TableCell className="text-xs px-3 sm:px-4 py-3">
                      {item.applicant?.profile?.resume ? (
                        <a
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium truncate block max-w-[100px] sm:max-w-none"
                          href={item?.applicant?.profile?.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item?.applicant?.profile?.resumeOriginalName || "View Resume"}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No resume</span>
                      )}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-xs px-3 sm:px-4 py-3">
                      {item?.status === "accepted" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Accepted
                        </span>
                      ) : item?.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending
                        </span>
                      )}
                    </TableCell>

                    {/* Applied Date */}
                    <TableCell className="text-xs px-3 sm:px-4 py-3 text-gray-500">
                      {item?.createdAt ? item.createdAt.split("T")[0] : "Recent"}
                    </TableCell>

                    {/* Row Actions */}
                    <TableCell className="text-right px-3 sm:px-4 py-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-1 rounded-xl shadow-lg border-gray-200" align="end">
                          <div
                            onClick={() => openEvaluationModal(item)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50 rounded-lg cursor-pointer font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View AI Analysis
                          </div>
                          <div
                            onClick={() => handleReanalyzeQuick(item._id)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            Re-Analyze Resume
                          </div>
                          <div className="border-t border-gray-100 my-1" />
                          {shortlisting.map((st, index) => (
                            <div
                              key={index}
                              onClick={() => statusHandler(st, item?._id)}
                              className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg cursor-pointer font-medium ${
                                st === "Accepted"
                                  ? "text-emerald-700 hover:bg-emerald-50"
                                  : "text-rose-700 hover:bg-rose-50"
                              }`}
                            >
                              {st === "Accepted" ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              <span>Mark {st}</span>
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* AI Evaluation Detail Modal */}
      <AiEvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicantData={selectedApplicant}
        onStatusChange={statusHandler}
        onEvaluationUpdated={handleEvaluationUpdated}
      />
    </div>
  )
}
