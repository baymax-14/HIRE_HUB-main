import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobslice";
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  TrendingUp,
  Banknote,
  Sparkles,
  Check,
} from "lucide-react";

const POPULAR_LOCATIONS = [
  "Remote",
  "Bengaluru",
  "Delhi / NCR",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "San Francisco",
  "London",
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];

const SENIORITY_LEVELS = [
  "Entry / Junior",
  "Mid-Level",
  "Senior (5+ yrs)",
  "Staff / Lead",
];

const COMPENSATION_TIERS = [
  { label: "Any Compensation", min: 0, max: 0 },
  { label: "₹0 – ₹6 LPA (Entry)", min: 0, max: 600000 },
  { label: "₹6L – ₹15 LPA (Mid)", min: 600000, max: 1500000 },
  { label: "₹15L – ₹30 LPA (Senior)", min: 1500000, max: 3000000 },
  { label: "₹30L+ LPA (Top Tier)", min: 3000000, max: 0 },
];

export default function FilterCard() {
  const dispatch = useDispatch();
  const jobState = useSelector((store) => store.job) || {};
  const { user } = useSelector((store) => store.auth) || {};

  const filters = useMemo(
    () =>
      jobState.filters || {
        keyword: "",
        location: "",
        jobType: "",
        salaryMin: 0,
        salaryMax: 0,
      },
    [jobState.filters]
  );

  const [keyword, setKeyword] = useState(filters?.keyword || "");
  const [selectedLocation, setSelectedLocation] = useState(filters?.location || "");
  const [selectedJobType, setSelectedJobType] = useState(filters?.jobType || "");
  const [selectedSeniority, setSelectedSeniority] = useState("");
  const [selectedCompTier, setSelectedCompTier] = useState(0);

  const debounceRef = useRef(null);

  // Sync internal state when Redux filters change (e.g. from Hero pills or Clear)
  useEffect(() => {
    setKeyword(filters?.keyword || "");
    setSelectedLocation(filters?.location || "");
    setSelectedJobType(filters?.jobType || "");

    const tierIndex = COMPENSATION_TIERS.findIndex(
      (tier) =>
        tier.min === (filters?.salaryMin || 0) &&
        tier.max === (filters?.salaryMax || 0)
    );
    setSelectedCompTier(tierIndex >= 0 ? tierIndex : 0);
  }, [filters]);

  // Active filter count
  const activeCount =
    (keyword ? 1 : 0) +
    (selectedLocation ? 1 : 0) +
    (selectedJobType ? 1 : 0) +
    (selectedSeniority ? 1 : 0) +
    (selectedCompTier > 0 ? 1 : 0);

  // Debounced keyword search
  const debouncedSearch = useCallback(
    (value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        dispatch(setFilters({ keyword: value }));
      }, 350);
    },
    [dispatch]
  );

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleClearKeyword = () => {
    setKeyword("");
    dispatch(setFilters({ keyword: "" }));
  };

  const handleLocationToggle = (loc) => {
    const next = selectedLocation.toLowerCase() === loc.toLowerCase() ? "" : loc;
    setSelectedLocation(next);
    dispatch(setFilters({ location: next }));
  };

  const handleJobTypeToggle = (type) => {
    const next = selectedJobType.toLowerCase() === type.toLowerCase() ? "" : type;
    setSelectedJobType(next);
    dispatch(setFilters({ jobType: next }));
  };

  const handleSeniorityToggle = (lvl) => {
    const next = selectedSeniority === lvl ? "" : lvl;
    setSelectedSeniority(next);
    // Dispatches keyword adjustment or general filter
    dispatch(setFilters({ keyword: next ? `${keyword} ${next}`.trim() : keyword }));
  };

  const handleCompChange = (idx) => {
    setSelectedCompTier(idx);
    const tier = COMPENSATION_TIERS[idx];
    dispatch(setFilters({ salaryMin: tier.min, salaryMax: tier.max }));
  };

  const handleClearAll = () => {
    setKeyword("");
    setSelectedLocation("");
    setSelectedJobType("");
    setSelectedSeniority("");
    setSelectedCompTier(0);
    dispatch(clearFilters());
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-7">
      {/* Filter Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100/70 flex items-center justify-center text-[#630ed4]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="text-base text-[#131b2e] font-extrabold tracking-tight">
            Refine Roles
          </h2>
          {activeCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#630ed4] text-xs font-bold">
              {activeCount} Active
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={handleClearAll}
            type="button"
            className="text-xs font-bold text-slate-400 hover:text-[#630ed4] transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Keywords & Stack Search */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
          Keywords &amp; Stack
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Search roles, tech stack..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#f2f3ff]/50 hover:bg-[#f2f3ff] focus:bg-white rounded-2xl text-sm text-[#131b2e] placeholder-slate-400 border border-transparent focus:border-[#630ed4]/40 focus:outline-none transition-all"
          />
          {keyword && (
            <button
              onClick={handleClearKeyword}
              type="button"
              className="absolute right-3 text-slate-400 hover:text-[#131b2e] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Location Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#131b2e]">
            <MapPin className="w-4 h-4 text-[#630ed4]" />
            <span>Location</span>
          </div>
          {selectedLocation && (
            <span className="text-xs text-[#630ed4] font-semibold">
              1 Selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleLocationToggle("")}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              !selectedLocation
                ? "bg-[#630ed4] text-white font-bold shadow-xs"
                : "bg-[#f2f3ff]/80 text-[#4a4455] hover:bg-[#eaedff]"
            }`}
          >
            All Locations
          </button>
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected =
              selectedLocation.toLowerCase() === loc.toLowerCase();
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocationToggle(loc)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#630ed4] text-white font-bold shadow-xs"
                    : "bg-[#f2f3ff]/80 text-[#4a4455] hover:bg-[#eaedff]"
                }`}
              >
                <span>{loc}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#131b2e]">
            <Briefcase className="w-4 h-4 text-[#630ed4]" />
            <span>Job Type</span>
          </div>
          {selectedJobType && (
            <span className="text-xs text-[#630ed4] font-semibold">
              1 Selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => {
            const isSelected =
              selectedJobType.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleJobTypeToggle(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#630ed4] text-white font-bold shadow-xs"
                    : "bg-[#f2f3ff]/80 text-[#4a4455] hover:bg-[#eaedff]"
                }`}
              >
                <span>{type}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seniority / Experience Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#131b2e]">
          <TrendingUp className="w-4 h-4 text-[#630ed4]" />
          <span>Seniority Level</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SENIORITY_LEVELS.map((lvl) => {
            const isSelected = selectedSeniority === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSeniorityToggle(lvl)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#630ed4]/10 border border-[#630ed4]/40 text-[#630ed4] font-bold"
                    : "bg-[#f2f3ff]/80 text-[#4a4455] hover:bg-[#eaedff]"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compensation Tiers */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-[#131b2e]">
          <Banknote className="w-4 h-4 text-[#630ed4]" />
          <span>Compensation Tiers</span>
        </div>
        <div className="space-y-2 pt-1">
          {COMPENSATION_TIERS.map((tier, idx) => {
            const isChecked = selectedCompTier === idx;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${
                  isChecked
                    ? "bg-[#630ed4]/5 border border-[#630ed4]/30 shadow-xs"
                    : "bg-[#f2f3ff]/40 hover:bg-[#f2f3ff] border border-transparent"
                }`}
              >
                <input
                  type="radio"
                  name="comp_tier"
                  checked={isChecked}
                  onChange={() => handleCompChange(idx)}
                  className="accent-[#630ed4] w-4 h-4"
                />
                <span
                  className={`text-xs sm:text-sm ${
                    isChecked
                      ? "font-bold text-[#630ed4]"
                      : "text-[#131b2e]"
                  }`}
                >
                  {tier.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* AI Calibration Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white border border-purple-100 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#630ed4]" />
          <span className="text-xs text-[#630ed4] font-bold tracking-wide uppercase">
            AI Calibration Active
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          Roles are ranked dynamically against your{" "}
          <strong className="text-[#131b2e]">
            {user?.fullname ? `${user.fullname} Profile` : "Live Candidate Profile"}
          </strong>{" "}
          with automated ATS scoring.
        </p>
      </div>
    </div>
  );
}
