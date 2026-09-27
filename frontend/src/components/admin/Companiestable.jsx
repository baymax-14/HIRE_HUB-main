"use client";

import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setCompanies } from "@/redux/companyslice";
import { COMPANY_API_END_POINT } from "@/util/const";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

import {
  Search,
  Building2,
  Briefcase,
  MapPin,
  Globe,
  ExternalLink,
  Edit2,
  Trash2,
  MoreHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  ArrowRight,
  X,
  Loader2,
  AlertCircle,
  Plus,
  Sparkles,
} from "lucide-react";

export default function CompanisTable() {
  const { companies = [] } = useSelector((store) => store.company);
  const { alladminjob = [] } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search, filter, sorting, and view mode
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "hiring", "with_website"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "name", "most_jobs"
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Delete company state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Helper to count jobs for a company
  const getJobCount = (companyId) => {
    return alladminjob.filter(
      (job) => job?.company?._id === companyId || job?.company === companyId
    ).length;
  };

  // Open Delete confirmation dialog
  const openDeleteDialog = (company) => {
    setCompanyToDelete(company);
    setDeleteModalOpen(true);
  };

  // Execute Delete Company
  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    try {
      setDeleting(true);
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyToDelete._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "Company and related data deleted successfully"
        );
        const updatedList = companies.filter(
          (c) => c._id !== companyToDelete._id
        );
        dispatch(setCompanies(updatedList));
        setDeleteModalOpen(false);
        setCompanyToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
      toast.error(error?.response?.data?.message || "Failed to delete company");
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Sort companies
  const filteredCompanies = useMemo(() => {
    let list = [...companies];

    // Search query filter (name, location, description, website)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((company) => {
        const name = company?.name?.toLowerCase() || "";
        const loc = company?.location?.toLowerCase() || "";
        const desc = company?.description?.toLowerCase() || "";
        const web = company?.website?.toLowerCase() || "";
        return (
          name.includes(q) ||
          loc.includes(q) ||
          desc.includes(q) ||
          web.includes(q)
        );
      });
    }

    // Tab filter
    if (activeTab === "hiring") {
      list = list.filter((c) => getJobCount(c._id) > 0);
    } else if (activeTab === "with_website") {
      list = list.filter((c) => Boolean(c.website));
    }

    // Sorting
    list.sort((a, b) => {
      const jobCountA = getJobCount(a._id);
      const jobCountB = getJobCount(b._id);

      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name") {
        return (a?.name || "").localeCompare(b?.name || "");
      }
      if (sortBy === "most_jobs") {
        return jobCountB - jobCountA;
      }
      return 0;
    });

    return list;
  }, [companies, alladminjob, searchQuery, activeTab, sortBy]);

  // Tab counts
  const totalCount = companies.length;
  const hiringCount = companies.filter((c) => getJobCount(c._id) > 0).length;
  const withWebsiteCount = companies.filter((c) => Boolean(c.website)).length;

  return (
    <div className="space-y-4">
      {/* ── FILTER & TOOLBAR ── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-3.5 sm:p-4 space-y-3.5">
        {/* Row 1: Search & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, location, website..."
              className="pl-9 pr-8 h-10 text-xs sm:text-sm bg-gray-50/70 border-gray-200 rounded-xl focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & View Mode Switcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_jobs">Most Job Openings</option>
                <option value="name">Company Name (A-Z)</option>
              </select>
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/80">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Grid cards view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Status Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 border-t border-gray-100 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === "all"
                ? "bg-gray-900 text-white shadow-2xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            All Companies ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("hiring")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "hiring"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Actively Hiring ({hiringCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("with_website")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "with_website"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>With Website ({withWebsiteCount})</span>
          </button>

          {/* Counter info */}
          <span className="ml-auto text-xs text-gray-400 hidden sm:inline">
            Showing {filteredCompanies.length} of {totalCount} organizations
          </span>
        </div>
      </div>

      {/* ── VIEW 1: MODERN DATA TABLE ── */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50/80 border-b border-gray-200/70">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">
                    Company
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">
                    Headquarters
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">
                    Website
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">
                    Active Jobs
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">
                    Date Registered
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs py-3.5 px-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Building2 className="w-8 h-8 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-700">
                          No companies found
                        </p>
                        <p className="text-xs text-gray-400">
                          {searchQuery
                            ? `No company matches "${searchQuery}".`
                            : "You haven't registered any companies under this filter."}
                        </p>
                        {searchQuery && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="mt-2 text-xs rounded-xl cursor-pointer"
                          >
                            Clear Search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => {
                    const jobCount = getJobCount(company._id);
                    const initial = company.name ? company.name.charAt(0).toUpperCase() : "C";

                    return (
                      <TableRow
                        key={company._id}
                        className="hover:bg-slate-50/70 transition-colors border-b border-gray-100"
                      >
                        {/* Company Logo & Name */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-3">
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                                {initial}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span
                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                                className="font-bold text-gray-900 text-sm block truncate max-w-[200px] hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                {company.name}
                              </span>
                              {company.description ? (
                                <p className="text-[11px] text-gray-400 block truncate max-w-[240px]">
                                  {company.description}
                                </p>
                              ) : (
                                <span className="text-[11px] text-gray-300 italic">
                                  No description added
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="px-4 py-3.5 align-middle text-xs">
                          {company.location ? (
                            <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{company.location}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Not specified</span>
                          )}
                        </TableCell>

                        {/* Website */}
                        <TableCell className="px-4 py-3.5 align-middle text-xs">
                          {company.website ? (
                            <a
                              href={
                                company.website.startsWith("http")
                                  ? company.website
                                  : `https://${company.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[130px]">
                                {company.website.replace(/^https?:\/\//, "")}
                              </span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">No website</span>
                          )}
                        </TableCell>

                        {/* Active Jobs Pill */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <button
                            type="button"
                            onClick={() => navigate("/admin/jobs")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                              jobCount > 0
                                ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 shadow-2xs group"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                            }`}
                            title="Click to view jobs"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                            <span>
                              {jobCount} {jobCount === 1 ? "Job" : "Jobs"}
                            </span>
                            {jobCount > 0 && (
                              <ArrowRight className="w-3 h-3 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </button>
                        </TableCell>

                        {/* Date Registered */}
                        <TableCell className="px-4 py-3.5 align-middle text-xs text-gray-500">
                          {company.createdAt ? company.createdAt.split("T")[0] : "Recent"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3.5 align-middle text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Quick Edit */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/companies/${company._id}`)}
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer"
                              title="Edit Company"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>

                            {/* More Options */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-44 p-1.5 rounded-xl shadow-lg border-gray-200" align="end">
                                <div
                                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Edit Profile</span>
                                </div>
                                <div
                                  onClick={() => navigate("/admin/jobs")}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>View Job Postings</span>
                                </div>
                                {company.website && (
                                  <a
                                    href={
                                      company.website.startsWith("http")
                                        ? company.website
                                        : `https://${company.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <Globe className="w-3.5 h-3.5 text-gray-500" />
                                    <span>Visit Website</span>
                                  </a>
                                )}
                                <div className="my-1 border-t border-gray-100" />
                                <div
                                  onClick={() => openDeleteDialog(company)}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Company</span>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── VIEW 2: MODERN RESPONSIVE CARDS GRID ── */}
      {viewMode === "grid" && (
        <div>
          {filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-xs">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No companies found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery
                  ? `No company matches "${searchQuery}".`
                  : "No companies under this filter."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs rounded-xl cursor-pointer"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => {
                const jobCount = getJobCount(company._id);
                const initial = company.name ? company.name.charAt(0).toUpperCase() : "C";

                return (
                  <div
                    key={company._id}
                    className="bg-white rounded-2xl border border-gray-200/80 hover:border-purple-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Logo & Actions */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-200 p-1.5 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-base shadow-2xs shrink-0">
                              {initial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3
                              onClick={() => navigate(`/admin/companies/${company._id}`)}
                              className="font-extrabold text-gray-900 text-base truncate group-hover:text-purple-600 transition-colors cursor-pointer"
                            >
                              {company.name}
                            </h3>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">
                                {company.location || "Location not specified"}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Active Jobs Badge */}
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            jobCount > 0
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {jobCount} {jobCount === 1 ? "Job" : "Jobs"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3.5">
                        {company.description ||
                          "No company description provided yet. Click edit to add organization details."}
                      </p>

                      {/* Website link */}
                      {company.website && (
                        <div className="mb-4">
                          <a
                            href={
                              company.website.startsWith("http")
                                ? company.website
                                : `https://${company.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="truncate max-w-[200px]">
                              {company.website.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold h-9 cursor-pointer shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                        Edit Profile
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/admin/jobs")}
                        className="h-9 px-3 rounded-xl text-xs text-gray-700 hover:text-purple-600 hover:bg-purple-50 cursor-pointer"
                        title="View Jobs"
                      >
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        <span>Jobs</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(company)}
                        className="h-9 w-9 p-0 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Delete Company Profile?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 pt-1 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                &quot;{companyToDelete?.name}&quot;
              </span>
              ? This will permanently remove the company profile, all jobs posted
              under it, and all related candidate records. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="w-full sm:w-auto rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteCompany}
              disabled={deleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Company"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
