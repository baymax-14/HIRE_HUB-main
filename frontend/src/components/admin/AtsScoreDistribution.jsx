import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Sliders,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
  Loader2,
  ChevronDown,
  Info,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

export const RANGES = [
  {
    id: "1-20",
    label: "1 - 20%",
    subtitle: "Low Match",
    bg: "bg-rose-50/70",
    border: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    activeRing: "ring-2 ring-rose-500 bg-rose-50",
    text: "text-rose-700",
    badgeBg: "bg-rose-100 text-rose-800",
    barColor: "bg-rose-500",
  },
  {
    id: "20-40",
    label: "20 - 40%",
    subtitle: "Partially Qualified",
    bg: "bg-amber-50/70",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    activeRing: "ring-2 ring-amber-500 bg-amber-50",
    text: "text-amber-700",
    badgeBg: "bg-amber-100 text-amber-800",
    barColor: "bg-amber-500",
  },
  {
    id: "40-60",
    label: "40 - 60%",
    subtitle: "Moderate Fit",
    bg: "bg-sky-50/70",
    border: "border-sky-200",
    hoverBorder: "hover:border-sky-400",
    activeRing: "ring-2 ring-sky-500 bg-sky-50",
    text: "text-sky-700",
    badgeBg: "bg-sky-100 text-sky-800",
    barColor: "bg-sky-500",
  },
  {
    id: "60-80",
    label: "60 - 80%",
    subtitle: "Qualified",
    bg: "bg-indigo-50/70",
    border: "border-indigo-200",
    hoverBorder: "hover:border-indigo-400",
    activeRing: "ring-2 ring-indigo-500 bg-indigo-50",
    text: "text-indigo-700",
    badgeBg: "bg-indigo-100 text-indigo-800",
    barColor: "bg-indigo-500",
  },
  {
    id: "80-100",
    label: "80 - 100%",
    subtitle: "Top Match",
    bg: "bg-emerald-50/70",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    activeRing: "ring-2 ring-emerald-500 bg-emerald-50",
    text: "text-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-800",
    barColor: "bg-emerald-500",
  },
];

export const isScoreInRange = (score, rangeId) => {
  const sc = Number(score) || 0;
  if (rangeId === "1-20") return sc <= 20;
  if (rangeId === "20-40") return sc > 20 && sc <= 40;
  if (rangeId === "40-60") return sc > 40 && sc <= 60;
  if (rangeId === "60-80") return sc > 60 && sc <= 80;
  if (rangeId === "80-100") return sc > 80 && sc <= 100;
  return false;
};

export default function AtsScoreDistribution({
  applications = [],
  selectedScoreRange = "all",
  onSelectScoreRange,
  thresholdScore = 40,
  onThresholdChange,
  onBulkReject,
  isBulkRejecting = false,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showCandidatePreview, setShowCandidatePreview] = useState(false);

  const totalApplicants = applications.length;

  // Calculate count & percentage for each of the 5 ranges
  const rangeStats = useMemo(() => {
    return RANGES.map((r) => {
      const matchingApps = applications.filter((app) =>
        isScoreInRange(app?.aiEvaluation?.score ?? 0, r.id)
      );
      const count = matchingApps.length;
      const percentage = totalApplicants > 0 ? Math.round((count / totalApplicants) * 100) : 0;
      return {
        ...r,
        count,
        percentage,
        apps: matchingApps,
      };
    });
  }, [applications, totalApplicants]);

  // Candidates eligible for threshold rejection (score < thresholdScore && status !== 'rejected')
  const eligibleCandidates = useMemo(() => {
    return applications.filter((app) => {
      const score = app?.aiEvaluation?.score ?? 0;
      const isNotRejected = app?.status !== "rejected";
      return isNotRejected && score < thresholdScore;
    });
  }, [applications, thresholdScore]);

  const handleConfirmReject = async () => {
    if (!onBulkReject || eligibleCandidates.length === 0) return;
    try {
      await onBulkReject(thresholdScore, eligibleCandidates);
      setIsConfirmOpen(false);
    } catch {
      // Error handled inside onBulkReject
    }
  };

  const presetThresholds = [30, 40, 50, 60, 70];

  return (
    <div className="w-full space-y-4 mb-6">
      {/* ── SECTION 1: ATS SCORE RANGE BREAKDOWN ── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                ATS Match Score Distribution
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Breakdown of applicants across 5 score tiers (1-20, 20-40, 40-60, 60-80, 80-100). Click any tier to filter table.
            </p>
          </div>

          {selectedScoreRange !== "all" && (
            <button
              onClick={() => onSelectScoreRange("all")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Filter className="w-3 h-3" />
              <span>Filtering: {RANGES.find((r) => r.id === selectedScoreRange)?.label}</span>
              <X className="w-3 h-3 ml-0.5" />
            </button>
          )}
        </div>

        {/* 5 Distribution Range Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {rangeStats.map((tier) => {
            const isSelected = selectedScoreRange === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => onSelectScoreRange(isSelected ? "all" : tier.id)}
                className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
                  tier.bg
                } ${tier.border} ${tier.hoverBorder} ${
                  isSelected ? tier.activeRing + " shadow-sm scale-[1.02]" : "hover:shadow-2xs"
                }`}
                title={`Click to ${isSelected ? "clear filter" : "filter by " + tier.label}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${tier.badgeBg}`}>
                    {tier.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-indigo-600 bg-white px-1.5 py-0.5 rounded-full shadow-2xs">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  {tier.count}
                  <span className="text-xs font-normal text-gray-500 ml-1.5">
                    ({tier.percentage}%)
                  </span>
                </div>

                <div className="text-[11px] font-medium text-gray-600 mt-1 flex items-center justify-between">
                  <span>{tier.subtitle}</span>
                  <span className="text-[10px] text-gray-400">
                    {tier.count} {tier.count === 1 ? "cand." : "cands."}
                  </span>
                </div>

                {/* Progress bar inside card */}
                <div className="w-full bg-black/5 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${tier.barColor}`}
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Segmented Distribution Bar */}
        {totalApplicants > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
              <span className="font-medium">Applicant Pool Spectrum</span>
              <span>Total Applicants: {totalApplicants}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden flex">
              {rangeStats.map((tier) =>
                tier.count > 0 ? (
                  <div
                    key={tier.id}
                    className={`${tier.barColor} h-full transition-all duration-500`}
                    style={{ width: `${(tier.count / totalApplicants) * 100}%` }}
                    title={`${tier.label} (${tier.subtitle}): ${tier.count} applicant(s) (${tier.percentage}%)`}
                  />
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: ADJUSTABLE BULK AUTO-REJECT TOOL ── */}
      <div className="bg-gradient-to-r from-rose-50/60 via-white to-amber-50/40 rounded-2xl border border-rose-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Header & Description */}
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <UserX className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Automated Screening & Bulk Rejection
              </h3>
              <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-300">
                Recruiter Tool
              </Badge>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Set an adjustable minimum ATS score threshold. Candidates scoring below this threshold can be screened out and rejected in one action.
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <Button
              onClick={() => setIsConfirmOpen(true)}
              disabled={eligibleCandidates.length === 0 || isBulkRejecting}
              className={`text-xs sm:text-sm font-semibold h-10 px-4 rounded-xl shadow-xs transition-all cursor-pointer ${
                eligibleCandidates.length > 0
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
            >
              {isBulkRejecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Reject Below {thresholdScore}%
                  {eligibleCandidates.length > 0 && (
                    <span className="ml-2 bg-white/20 text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold">
                      {eligibleCandidates.length}
                    </span>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Adjustable Slider & Presets Control Bar */}
        <div className="mt-4 pt-4 border-t border-rose-100/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Slider & Numerical Input */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              <label className="text-xs font-semibold text-gray-700">
                Minimum Score Threshold:
              </label>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-md">
              <input
                type="range"
                min="5"
                max="95"
                step="5"
                value={thresholdScore}
                onChange={(e) => onThresholdChange(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
              />

              <div className="flex items-center gap-1 shrink-0">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={thresholdScore}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                    onThresholdChange(val);
                  }}
                  className="w-16 h-8 text-xs font-bold text-center border-rose-300 focus:ring-rose-500 rounded-lg bg-white"
                />
                <span className="text-xs font-bold text-gray-700">%</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-gray-500 hidden xl:inline">Presets:</span>
              {presetThresholds.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onThresholdChange(preset)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    thresholdScore === preset
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  &lt;{preset}%
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Candidate Counter Status */}
          <div className="shrink-0 flex items-center gap-2">
            {eligibleCandidates.length > 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-100/90 border border-rose-200 px-3 py-1.5 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>
                  {eligibleCandidates.length} candidate(s) score below {thresholdScore}%
                </span>
                <button
                  type="button"
                  onClick={() => setShowCandidatePreview(!showCandidatePreview)}
                  className="text-[10px] underline ml-1 cursor-pointer font-bold text-rose-900 hover:text-black"
                >
                  {showCandidatePreview ? "Hide" : "Review"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No active candidates below {thresholdScore}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Candidate Preview Dropdown */}
        {showCandidatePreview && eligibleCandidates.length > 0 && (
          <div className="mt-3 p-3 bg-white/95 rounded-xl border border-rose-200 text-xs space-y-2">
            <div className="font-semibold text-gray-700 flex items-center justify-between">
              <span>Candidates to be rejected ({eligibleCandidates.length}):</span>
              <span className="text-[10px] text-gray-500 font-normal">
                Status will change to &quot;rejected&quot;
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {eligibleCandidates.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {c?.applicant?.fullname || "Unknown"}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {c?.applicant?.email || "No email"}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 text-[10px] shrink-0 font-bold">
                    {c?.aiEvaluation?.score ?? 0}% ATS
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CONFIRMATION MODAL FOR REJECTION ── */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-rose-600 mb-1">
              <div className="p-2 bg-rose-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-gray-900">
                Confirm Bulk Rejection
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
              You are about to reject{" "}
              <strong className="text-gray-900 font-bold">
                {eligibleCandidates.length} candidate(s)
              </strong>{" "}
              with an ATS match score below{" "}
              <strong className="text-rose-600 font-bold">{thresholdScore}%</strong>.
            </DialogDescription>
          </DialogHeader>

          {/* List of affected candidates */}
          <div className="my-2 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Affected Applicants:</p>
            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-gray-50 rounded-xl border border-gray-200/80">
              {eligibleCandidates.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white border border-gray-100"
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-gray-900 block truncate">
                      {c?.applicant?.fullname || "Unknown Candidate"}
                    </span>
                    <span className="text-[11px] text-gray-500 block truncate">
                      {c?.applicant?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-300 font-bold">
                      {c?.aiEvaluation?.score ?? 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Each rejected candidate will automatically receive an in-app status update and notification email.
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isBulkRejecting}
              className="rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              disabled={isBulkRejecting}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              {isBulkRejecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Rejecting...
                </>
              ) : (
                `Confirm & Reject (${eligibleCandidates.length})`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
