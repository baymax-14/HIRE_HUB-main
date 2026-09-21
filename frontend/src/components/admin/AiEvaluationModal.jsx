import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCw,
  Award,
  Briefcase,
  AlertTriangle,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/util/const";
import { toast } from "sonner";

export default function AiEvaluationModal({
  isOpen,
  onClose,
  applicantData,
  onStatusChange,
  onEvaluationUpdated,
}) {
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  if (!applicantData) return null;

  const { applicant, aiEvaluation, _id: applicationId, status } = applicantData;
  const evaluation = aiEvaluation || {};
  const score = evaluation.score ?? 0;
  const verdict = evaluation.verdict || "Pending";

  // Score color helper
  const getScoreColor = (sc) => {
    if (sc >= 80) return { bg: "bg-emerald-50 text-emerald-700 border-emerald-300", ring: "text-emerald-600", fill: "#10b981" };
    if (sc >= 60) return { bg: "bg-blue-50 text-blue-700 border-blue-300", ring: "text-blue-600", fill: "#3b82f6" };
    if (sc >= 40) return { bg: "bg-amber-50 text-amber-700 border-amber-300", ring: "text-amber-600", fill: "#f59e0b" };
    return { bg: "bg-rose-50 text-rose-700 border-rose-300", ring: "text-rose-600", fill: "#ef4444" };
  };

  const scoreTheme = getScoreColor(score);

  // Helper to split any concatenated or comma-separated skill strings into clean chips
  const sanitizeSkillList = (skills) => {
    if (!Array.isArray(skills)) return [];
    const cleaned = [];
    skills.forEach((s) => {
      if (!s) return;
      if (typeof s !== "string") return;
      // Split on common delimiters if present
      if (/[,;|/\n]/.test(s)) {
        s.split(/[,;|/\n]+/).forEach((sub) => {
          const trimmed = sub.trim();
          if (trimmed) cleaned.push(trimmed);
        });
      } else if (s.length > 30) {
        // If an unbroken long string, chunk or show neatly
        s.split(/\s+/).forEach((w) => {
          const trimmed = w.trim();
          if (trimmed) cleaned.push(trimmed);
        });
      } else {
        cleaned.push(s.trim());
      }
    });
    return Array.from(new Set(cleaned));
  };

  const matchingSkills = sanitizeSkillList(evaluation.matchingSkills);
  const missingSkills = sanitizeSkillList(evaluation.missingSkills);

  const handleReanalyze = async () => {
    try {
      setIsReanalyzing(true);
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/${applicationId}/reanalyze`);
      if (res.data.success) {
        toast.success("Resume re-analyzed successfully!");
        if (onEvaluationUpdated) {
          onEvaluationUpdated(applicationId, res.data.aiEvaluation);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to re-analyze resume");
    } finally {
      setIsReanalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  {applicant?.fullname}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className={`text-xs sm:text-sm px-3 py-0.5 font-semibold rounded-full border ${scoreTheme.bg}`}
                >
                  {verdict}
                </Badge>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-gray-500 mt-1">
                {applicant?.email} • {applicant?.phoneNumber}
              </DialogDescription>
            </div>

            {applicant?.profile?.resume && (
              <a
                href={applicant?.profile?.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-medium transition-colors self-start sm:self-auto"
              >
                <FileText className="w-4 h-4" />
                View Uploaded Resume
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-3">
          {/* Top Score Banner - Spacious & Premium */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Circular Score display */}
                <div className="relative w-24 h-24 flex items-center justify-center bg-white/10 backdrop-blur rounded-full border border-white/20 shrink-0">
                  <div className="text-center">
                    <span className="text-3xl font-black tracking-tight">{score}%</span>
                    <div className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Match Score</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    ATS Qualification Verdict
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{verdict}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    {evaluation.experienceFit || "Automated candidate qualification analysis evaluated against posted job description."}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReanalyze}
                disabled={isReanalyzing}
                className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 cursor-pointer shrink-0 px-4 py-2 rounded-xl"
              >
                <RotateCw className={`w-4 h-4 ${isReanalyzing ? "animate-spin" : ""}`} />
                {isReanalyzing ? "Re-analyzing..." : "Re-Analyze Resume"}
              </Button>
            </div>
          </div>

          {/* AI Executive Summary */}
          {evaluation.summary && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide mb-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                AI Recruiter Executive Summary
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-words">
                {evaluation.summary}
              </p>
            </div>
          )}

          {/* Skills Breakdown Grid - 2 Columns with Generous Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Matching Skills */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wide mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Matching Skills ({matchingSkills.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchingSkills.length > 0 ? (
                    matchingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 break-words"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-400 italic">No direct required skills matched in resume</span>
                  )}
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wide mb-3">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Missing Required Skills ({missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-rose-100 text-rose-800 border border-rose-200 break-words"
                      >
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-emerald-700 font-medium">
                      All listed job requirements are matched! 🎉
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 mb-3">
                  <Award className="w-4 h-4 text-amber-500" />
                  Candidate Strengths
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc pl-5">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="break-words">{str}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.concerns && evaluation.concerns.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Areas to Verify in Interview
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc pl-5">
                  {evaluation.concerns.map((con, idx) => (
                    <li key={idx} className="break-words">{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Status indicator and Accept/Reject buttons */}
        <div className="border-t pt-5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-600">
            Application Status:{" "}
            <span className="font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
              {status}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="default"
              onClick={() => onStatusChange("Rejected", applicationId)}
              className="flex-1 sm:flex-none border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer px-4"
            >
              <X className="w-4 h-4 mr-1.5" />
              Reject Candidate
            </Button>
            <Button
              size="default"
              onClick={() => onStatusChange("Accepted", applicationId)}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-5"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Shortlist & Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
