import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobslice";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";

const LOCATIONS = [
  "Delhi",
  "Mumbai",
  "Pune",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Remote",
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];

const SALARY_RANGES = [
  { label: "Any", min: 0, max: 0 },
  { label: "₹0 - 3 LPA", min: 0, max: 300000 },
  { label: "₹3 - 6 LPA", min: 300000, max: 600000 },
  { label: "₹6 - 10 LPA", min: 600000, max: 1000000 },
  { label: "₹10 - 20 LPA", min: 1000000, max: 2000000 },
  { label: "₹20 LPA+", min: 2000000, max: 0 },
];

export default function FilterCard() {
  const dispatch = useDispatch();
  const jobState = useSelector((store) => store.job) || {};
  const filters = jobState.filters || {
    keyword: "",
    location: "",
    jobType: "",
    salaryMin: 0,
    salaryMax: 0,
  };
  const [keyword, setKeyword] = useState(filters?.keyword || "");
  const [selectedLocation, setSelectedLocation] = useState(filters?.location || "");
  const [selectedJobType, setSelectedJobType] = useState(filters?.jobType || "");
  const [selectedSalary, setSelectedSalary] = useState(0); // index into SALARY_RANGES
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    jobType: true,
    salary: true,
  });

  const debounceRef = useRef(null);

  // Count active filters
  const activeFilterCount =
    (selectedLocation ? 1 : 0) +
    (selectedJobType ? 1 : 0) +
    (selectedSalary > 0 ? 1 : 0) +
    (keyword ? 1 : 0);

  // Debounced keyword search
  const debouncedSearch = useCallback(
    (value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        dispatch(setFilters({ keyword: value }));
      }, 400);
    },
    [dispatch]
  );

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleLocationChange = (loc) => {
    const newLoc = selectedLocation === loc ? "" : loc;
    setSelectedLocation(newLoc);
    dispatch(setFilters({ location: newLoc }));
  };

  const handleJobTypeChange = (type) => {
    const newType = selectedJobType === type ? "" : type;
    setSelectedJobType(newType);
    dispatch(setFilters({ jobType: newType }));
  };

  const handleSalaryChange = (index) => {
    setSelectedSalary(index);
    const range = SALARY_RANGES[index];
    dispatch(setFilters({ salaryMin: range.min, salaryMax: range.max }));
  };

  const handleClearAll = () => {
    setKeyword("");
    setSelectedLocation("");
    setSelectedJobType("");
    setSelectedSalary(0);
    dispatch(clearFilters());
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          <h2 className="font-semibold text-sm sm:text-base text-gray-800">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-100 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="px-4 sm:px-5 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={keyword}
            onChange={handleKeywordChange}
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
          />
          {keyword && (
            <button
              onClick={() => {
                setKeyword("");
                dispatch(setFilters({ keyword: "" }));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Location Section */}
      <div className="border-t border-gray-50">
        <button
          onClick={() => toggleSection("location")}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold text-gray-700">
            📍 Location
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              expandedSections.location ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.location && (
          <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocationChange(loc)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                  selectedLocation === loc
                    ? "bg-purple-100 border-purple-300 text-purple-700 font-medium"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Job Type Section */}
      <div className="border-t border-gray-50">
        <button
          onClick={() => toggleSection("jobType")}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold text-gray-700">
            💼 Job Type
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              expandedSections.jobType ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.jobType && (
          <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleJobTypeChange(type)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                  selectedJobType === type
                    ? "bg-blue-100 border-blue-300 text-blue-700 font-medium"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Salary Range Section */}
      <div className="border-t border-gray-50">
        <button
          onClick={() => toggleSection("salary")}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold text-gray-700">
            💰 Salary Range
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              expandedSections.salary ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.salary && (
          <div className="px-4 sm:px-5 pb-4 space-y-1.5">
            {SALARY_RANGES.map((range, idx) => (
              <button
                key={idx}
                onClick={() => handleSalaryChange(idx)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all cursor-pointer ${
                  selectedSalary === idx
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
