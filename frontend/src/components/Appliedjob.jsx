import { useState } from "react"
import { useSelector } from "react-redux"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Appliedjob() {
  const { allappliedjobs } = useSelector((store) => store.job)
  const [expandedAppId, setExpandedAppId] = useState(null)
  const navigate = useNavigate()

  const toggleExpand = (id) => {
    setExpandedAppId((prev) => (prev === id ? null : id))
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs font-semibold px-2.5 py-0.5">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Accepted / Shortlisted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 text-xs font-semibold px-2.5 py-0.5">
            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
            Not Selected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs font-semibold px-2.5 py-0.5">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            Under Review
          </Badge>
        )
    }
  }

  return (
    <div className="w-full">
      {allappliedjobs.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-slate-50/50">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-semibold text-gray-800">No applications yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            You haven't applied to any roles yet. Explore open opportunities and submit your resume to start tracking here.
          </p>
          <Button
            onClick={() => navigate("/jobs")}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-xs cursor-pointer"
            size="sm"
          >
            Browse Open Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-gray-200/80">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-600 py-3 px-4">Date Applied</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 py-3 px-4">Job Role</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 py-3 px-4">Company</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 py-3 px-4">ATS Match</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 py-3 px-4">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-600 py-3 px-4">Pipeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 bg-white">
                {allappliedjobs.map((applied) => {
                  const isExpanded = expandedAppId === applied._id
                  const score = applied?.aiEvaluation?.score
                  const verdict = applied?.aiEvaluation?.verdict
                  const status = applied?.status?.toLowerCase() || "pending"

                  return (
                    <>
                      <TableRow
                        key={applied._id}
                        onClick={() => toggleExpand(applied._id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? "bg-purple-50/40" : "hover:bg-slate-50/70"
                        }`}
                      >
                        <TableCell className="text-xs text-gray-600 py-3.5 px-4 whitespace-nowrap">
                          {applied.createdAt?.split("T")[0]}
                        </TableCell>

                        <TableCell className="text-xs sm:text-sm font-semibold text-gray-900 py-3.5 px-4">
                          <div className="truncate max-w-[160px] sm:max-w-[220px]">
                            {applied.job?.title || "Role Unavailable"}
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-gray-700 py-3.5 px-4">
                          <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{applied.job?.company?.name || "Company"}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5 px-4 whitespace-nowrap">
                          {score !== undefined && score !== null ? (
                            <Badge
                              variant="outline"
                              className={`text-[11px] font-semibold ${
                                score >= 75
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : score >= 50
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              {score}% {verdict ? `• ${verdict}` : ""}
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-400">Screening...</span>
                          )}
                        </TableCell>

                        <TableCell className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(applied?.status)}
                        </TableCell>

                        <TableCell className="text-right py-3.5 px-4 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpand(applied._id)
                            }}
                            className="h-8 text-xs text-purple-700 hover:text-purple-900 hover:bg-purple-100/50 cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                Hide Tracker <ChevronUp className="w-3.5 h-3.5 ml-1" />
                              </>
                            ) : (
                              <>
                                Track Status <ChevronDown className="w-3.5 h-3.5 ml-1" />
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Visual Pipeline Drawer */}
                      {isExpanded && (
                        <TableRow className="bg-slate-50/70 border-b border-purple-100">
                          <TableCell colSpan={6} className="p-4 sm:p-6">
                            <div className="bg-white border border-purple-100/80 rounded-xl p-5 shadow-2xs">
                              {/* Header inside drawer */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                                <div>
                                  <h4 className="font-bold text-sm text-gray-900">
                                    Application Pipeline: {applied.job?.title}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Track each milestone from application intake to recruiter evaluation
                                  </p>
                                </div>
                                {applied.job?._id && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/description/${applied.job._id}`)}
                                    className="text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
                                  >
                                    View Job Details
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>

                              {/* 3-Stage Stepper */}
                              <div className="py-6 px-2 sm:px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                                  {/* Step 1: Applied */}
                                  <div className="flex flex-col items-center text-center relative">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-2 shadow-xs ring-4 ring-emerald-50">
                                      <Check className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-xs text-gray-900">
                                      1. Application Submitted
                                    </span>
                                    <span className="text-[11px] text-gray-500 mt-0.5">
                                      {applied.createdAt?.split("T")[0]}
                                    </span>
                                  </div>

                                  {/* Step 2: ATS Screening */}
                                  <div className="flex flex-col items-center text-center relative">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-xs ring-4 ${
                                        score !== undefined && score !== null
                                          ? "bg-purple-100 text-purple-700 ring-purple-50"
                                          : "bg-amber-100 text-amber-700 ring-amber-50"
                                      }`}
                                    >
                                      <Sparkles className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-xs text-gray-900">
                                      2. ATS Qualification Screening
                                    </span>
                                    <span className="text-[11px] text-gray-500 mt-0.5">
                                      {score !== undefined && score !== null
                                        ? `Scored: ${score}% (${verdict || "Evaluated"})`
                                        : "Processing Resume..."}
                                    </span>
                                  </div>

                                  {/* Step 3: Recruiter Decision */}
                                  <div className="flex flex-col items-center text-center relative">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-xs ring-4 ${
                                        status === "accepted"
                                          ? "bg-emerald-100 text-emerald-700 ring-emerald-50"
                                          : status === "rejected"
                                            ? "bg-rose-100 text-rose-700 ring-rose-50"
                                            : "bg-gray-100 text-gray-500 ring-gray-50"
                                      }`}
                                    >
                                      {status === "accepted" ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                      ) : status === "rejected" ? (
                                        <XCircle className="w-5 h-5" />
                                      ) : (
                                        <Clock className="w-5 h-5" />
                                      )}
                                    </div>
                                    <span className="font-semibold text-xs text-gray-900">
                                      3. Hiring Team Decision
                                    </span>
                                    <span className="text-[11px] text-gray-500 mt-0.5">
                                      {status === "accepted"
                                        ? "Candidate Shortlisted!"
                                        : status === "rejected"
                                          ? "Position Filled / Not Selected"
                                          : "Currently In Review"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* AI Evaluation Breakdown Snippet (if available) */}
                              {applied?.aiEvaluation && (
                                <div className="mt-2 pt-4 border-t border-gray-100 bg-slate-50/80 rounded-lg p-3 text-xs">
                                  {applied.aiEvaluation.summary && (
                                    <p className="text-gray-700 leading-relaxed mb-2 font-medium">
                                      <span className="font-bold text-purple-800">Recruiter Feedback Note: </span>
                                      {applied.aiEvaluation.summary}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {applied.aiEvaluation.matchingSkills?.length > 0 && (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-semibold text-gray-600">Matched Skills:</span>
                                        {applied.aiEvaluation.matchingSkills.slice(0, 4).map((s, idx) => (
                                          <Badge key={idx} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {s}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
