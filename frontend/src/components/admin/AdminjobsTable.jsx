"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setallAdminjobs } from "@/redux/jobslice";
import { JOB_API_END_POINT, formatSalary } from "@/util/const";

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
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Search,
  Plus,
  Users,
  Eye,
  Edit2,
  Edit3,
  Trash2,
  Bell,
  BellOff,
  MoreHorizontal,
  LayoutGrid,
  List,
  MapPin,
  Briefcase,
  ArrowRight,
  ArrowUpDown,
  Filter,
  X,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Sparkles,
} from "lucide-react";

export default function AdminjobsTable() {
  const { alladminjob = [] } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search, filter, sorting, and view mode states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "with_applicants", "alerts_on", "alerts_off"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "most_applicants", "highest_salary", "title"
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Delete job state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit job state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    requirement: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experiance: "1-3",
    position: 1,
  });

  // Toggle email alerts
  const toggleAlerts = async (jobId) => {
    try {
      const res = await axios.put(
        `${JOB_API_END_POINT}/toggle-alerts/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedList = alladminjob.map((j) =>
          j._id === jobId ? { ...j, emailAlerts: res.data.emailAlerts } : j
        );
        dispatch(setallAdminjobs(updatedList));
      }
    } catch (error) {
      console.error("Failed to toggle email alerts:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update email alert setting"
      );
    }
  };

  // Open Delete confirmation dialog
  const openDeleteDialog = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      setDeleting(true);
      const res = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobToDelete._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job deleted successfully");
        const updatedList = alladminjob.filter((j) => j._id !== jobToDelete._id);
        dispatch(setallAdminjobs(updatedList));
        setDeleteModalOpen(false);
        setJobToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error(error?.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  // Open Edit modal with pre-filled values
  const openEditDialog = (job) => {
    setJobToEdit(job);
    setEditForm({
      title: job.title || "",
      description: job.description || "",
      requirement: Array.isArray(job.requirement)
        ? job.requirement.join(", ")
        : job.requirement || "",
      salary: job.salary
        ? Number(job.salary) >= 100000
          ? Number(job.salary) / 100000
          : job.salary
        : "",
      location: job.location || "",
      jobType: job.jobType || "Full-time",
      experiance: job.experiance || "1-3",
      position: job.position || 1,
    });
    setEditModalOpen(true);
  };

  // Submit edit form
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!jobToEdit) return;

    try {
      setUpdating(true);
      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${jobToEdit._id}`,
        editForm,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job updated successfully");
        const updatedJob = res.data.job;
        const updatedList = alladminjob.map((j) =>
          j._id === jobToEdit._id ? updatedJob : j
        );
        dispatch(setallAdminjobs(updatedList));
        setEditModalOpen(false);
        setJobToEdit(null);
      }
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error(error?.response?.data?.message || "Failed to update job");
    } finally {
      setUpdating(false);
    }
  };

  // Filter & Sort jobs
  const filteredJobs = useMemo(() => {
    let list = [...alladminjob];

    // Search query filter (title, company, location, requirements)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((job) => {
        const title = job?.title?.toLowerCase() || "";
        const company = job?.company?.name?.toLowerCase() || "";
        const loc = job?.location?.toLowerCase() || "";
        const req = Array.isArray(job?.requirement)
          ? job.requirement.join(" ").toLowerCase()
          : (job?.requirement || "").toLowerCase();
        return (
          title.includes(q) ||
          company.includes(q) ||
          loc.includes(q) ||
          req.includes(q)
        );
      });
    }

    // Tab filter
    if (activeTab === "with_applicants") {
      list = list.filter(
        (job) => Array.isArray(job?.application) && job.application.length > 0
      );
    } else if (activeTab === "alerts_on") {
      list = list.filter((job) => job?.emailAlerts !== false);
    } else if (activeTab === "alerts_off") {
      list = list.filter((job) => job?.emailAlerts === false);
    }

    // Sorting
    list.sort((a, b) => {
      const appCountA = Array.isArray(a?.application) ? a.application.length : 0;
      const appCountB = Array.isArray(b?.application) ? b.application.length : 0;
      const salaryA = Number(a?.salary) || 0;
      const salaryB = Number(b?.salary) || 0;

      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "most_applicants") {
        return appCountB - appCountA;
      }
      if (sortBy === "highest_salary") {
        return salaryB - salaryA;
      }
      if (sortBy === "title") {
        return (a?.title || "").localeCompare(b?.title || "");
      }
      return 0;
    });

    return list;
  }, [alladminjob, searchQuery, activeTab, sortBy]);

  // Tab counts
  const totalCount = alladminjob.length;
  const withApplicantsCount = alladminjob.filter(
    (j) => Array.isArray(j?.application) && j.application.length > 0
  ).length;
  const alertsOnCount = alladminjob.filter(
    (j) => j?.emailAlerts !== false
  ).length;
  const alertsOffCount = totalCount - alertsOnCount;

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
              placeholder="Search by role, company, location, skills..."
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
                <option value="most_applicants">Most Applicants</option>
                <option value="highest_salary">Highest Salary</option>
                <option value="title">Role Title (A-Z)</option>
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
            All Jobs ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("with_applicants")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "with_applicants"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>With Applicants ({withApplicantsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("alerts_on")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "alerts_on"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts Active ({alertsOnCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("alerts_off")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === "alerts_off"
                ? "bg-gray-700 text-white shadow-2xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            <BellOff className="w-3.5 h-3.5" />
            <span>Muted ({alertsOffCount})</span>
          </button>

          {/* Current count counter */}
          <span className="ml-auto text-xs text-gray-400 hidden sm:inline">
            Showing {filteredJobs.length} of {totalCount} listings
          </span>
        </div>
      </div>

      {/* ── VIEW 1: MODERN ENHANCED DATA TABLE ── */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50/80 border-b border-gray-200/70">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">Company</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">Role & Details</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">Applicants</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">Email Alerts</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs py-3.5 px-4">Date Posted</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs py-3.5 px-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Briefcase className="w-8 h-8 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-700">No job postings found</p>
                        <p className="text-xs text-gray-400">
                          {searchQuery
                            ? `No jobs matched "${searchQuery}". Try a different keyword.`
                            : "You haven't posted any jobs under this filter."}
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
                  filteredJobs.map((job) => {
                    const isAlertsOn = job?.emailAlerts !== false;
                    const applicantCount = Array.isArray(job?.application)
                      ? job.application.length
                      : 0;
                    const companyName = job?.company?.name || "Unknown Company";
                    const initialLetter = companyName.charAt(0).toUpperCase();

                    return (
                      <TableRow
                        key={job._id}
                        className="hover:bg-slate-50/70 transition-colors border-b border-gray-100"
                      >
                        {/* Company Logo & Name */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-3">
                            {job?.company?.logo ? (
                              <img
                                src={job.company.logo}
                                alt={companyName}
                                className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                                {initialLetter}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-gray-900 text-sm block truncate max-w-[140px]">
                                {companyName}
                              </span>
                              <span className="text-[11px] text-gray-400 block truncate">
                                {job?.company?.location || job?.location || "India"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role Title & Badges */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="space-y-1">
                            <span className="font-semibold text-gray-900 text-sm block hover:text-indigo-600 transition-colors">
                              {job?.title}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* Job Type Pill */}
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                {job?.jobType || "Full-time"}
                              </span>

                              {/* Salary Badge */}
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {formatSalary(job?.salary)}
                              </span>

                              {/* Location */}
                              {job?.location && (
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  {job.location}
                                </span>
                              )}

                              {/* Openings */}
                              {job?.position && (
                                <span className="text-[10px] text-gray-400">
                                  • {job.position} {job.position === 1 ? "opening" : "openings"}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Direct Applicants Review Pill Button */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                              applicantCount > 0
                                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-2xs group"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                            }`}
                            title="Click to view and review applicants with AI ATS score"
                          >
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              {applicantCount} {applicantCount === 1 ? "Applicant" : "Applicants"}
                            </span>
                            {applicantCount > 0 && (
                              <ArrowRight className="w-3 h-3 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </button>
                        </TableCell>

                        {/* Email Alerts Toggle */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <button
                            type="button"
                            onClick={() => toggleAlerts(job._id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                              isAlertsOn
                                ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/70"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                            }`}
                            title="Click to toggle applicant email notifications"
                          >
                            {isAlertsOn ? (
                              <>
                                <Bell className="w-3.5 h-3.5 text-purple-600" />
                                <span>Alerts Active</span>
                              </>
                            ) : (
                              <>
                                <BellOff className="w-3.5 h-3.5 text-gray-400" />
                                <span>Muted</span>
                              </>
                            )}
                          </button>
                        </TableCell>

                        {/* Date Posted */}
                        <TableCell className="px-4 py-3.5 align-middle text-xs text-gray-500">
                          {job?.createdAt ? job.createdAt.split("T")[0] : "Recent"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3.5 align-middle text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Quick View Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                              className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                              title="Review Applicants"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {/* Quick Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(job)}
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer"
                              title="Edit Job"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>

                            {/* More Options Popover */}
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
                              <PopoverContent className="w-48 p-1.5 rounded-xl shadow-lg border-gray-200" align="end">
                                <div
                                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Review Applicants</span>
                                </div>
                                <div
                                  onClick={() => openEditDialog(job)}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Edit Job Details</span>
                                </div>
                                {job?.company?._id && (
                                  <div
                                    onClick={() => navigate(`/admin/companies/${job.company._id}`)}
                                    className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                                    <span>Edit Company</span>
                                  </div>
                                )}
                                <div
                                  onClick={() => toggleAlerts(job._id)}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                >
                                  {isAlertsOn ? (
                                    <>
                                      <BellOff className="w-3.5 h-3.5 text-gray-500" />
                                      <span>Mute Email Alerts</span>
                                    </>
                                  ) : (
                                    <>
                                      <Bell className="w-3.5 h-3.5 text-purple-600" />
                                      <span>Enable Email Alerts</span>
                                    </>
                                  )}
                                </div>
                                <div className="my-1 border-t border-gray-100" />
                                <div
                                  onClick={() => openDeleteDialog(job)}
                                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Job</span>
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
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-xs">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No job postings found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery
                  ? `No jobs match "${searchQuery}".`
                  : "No postings under this filter."}
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
              {filteredJobs.map((job) => {
                const isAlertsOn = job?.emailAlerts !== false;
                const applicantCount = Array.isArray(job?.application)
                  ? job.application.length
                  : 0;
                const companyName = job?.company?.name || "Unknown Company";
                const initialLetter = companyName.charAt(0).toUpperCase();

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl border border-gray-200/80 hover:border-indigo-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header: Company & Alerts */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          {job?.company?.logo ? (
                            <img
                              src={job.company.logo}
                              alt={companyName}
                              className="w-11 h-11 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                              {initialLetter}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm truncate">
                              {companyName}
                            </h3>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{job?.location || "India"}</span>
                            </p>
                          </div>
                        </div>

                        {/* Email Alert Toggle Pill */}
                        <button
                          type="button"
                          onClick={() => toggleAlerts(job._id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                            isAlertsOn
                              ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/70"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200 border border-gray-200"
                          }`}
                          title={isAlertsOn ? "Email alerts enabled" : "Email alerts muted"}
                        >
                          {isAlertsOn ? (
                            <Bell className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <BellOff className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Job Title */}
                      <h4
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="font-extrabold text-gray-900 text-base group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 mb-2.5"
                      >
                        {job?.title}
                      </h4>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {job?.jobType || "Full-time"}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {formatSalary(job?.salary)}
                        </span>
                        {job?.position && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            {job.position} {job.position === 1 ? "Opening" : "Openings"}
                          </span>
                        )}
                      </div>

                      {/* Applicant Insight Bar */}
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors cursor-pointer flex items-center justify-between mb-4"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`p-1.5 rounded-lg ${applicantCount > 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-500"}`}>
                            <Users className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-tight">
                              {applicantCount} {applicantCount === 1 ? "Candidate" : "Candidates"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {applicantCount > 0 ? "Ready for ATS screening" : "Awaiting applications"}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Review Applicants
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(job)}
                        className="h-9 w-9 p-0 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 cursor-pointer"
                        title="Edit Job"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(job)}
                        className="h-9 w-9 p-0 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete Job"
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
              Delete Job Posting?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 pt-1 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                &quot;{jobToDelete?.title}&quot;
              </span>
              ? This will permanently remove the job posting and all associated
              candidate applications. This action cannot be undone.
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
              onClick={confirmDeleteJob}
              disabled={deleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Job Modal ── */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              Edit Job Posting
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-500">
              Update details, compensation, and requirements for this role.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateJob} className="space-y-4 pt-2">
            <div className="grid gap-1.5">
              <Label
                htmlFor="edit-title"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="grid gap-1.5">
              <Label
                htmlFor="edit-desc"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="edit-desc"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
                rows={4}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="grid gap-1.5">
              <Label
                htmlFor="edit-req"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Requirements / Skills (comma separated){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-req"
                value={editForm.requirement}
                onChange={(e) =>
                  setEditForm({ ...editForm, requirement: e.target.value })
                }
                placeholder="e.g. React, Node.js, Python, AWS"
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label
                  htmlFor="edit-salary"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Annual Salary (in LPA) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-salary"
                  type="number"
                  placeholder="e.g. 45"
                  value={editForm.salary}
                  onChange={(e) =>
                    setEditForm({ ...editForm, salary: e.target.value })
                  }
                  required
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label
                  htmlFor="edit-location"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  required
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs sm:text-sm font-medium text-gray-700">
                  Job Type
                </Label>
                <Select
                  value={editForm.jobType}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, jobType: val })
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs sm:text-sm font-medium text-gray-700">
                  Experience Level
                </Label>
                <Select
                  value={editForm.experiance}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, experiance: val })
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fresher">Fresher (0 yrs)</SelectItem>
                    <SelectItem value="1-3">1-3 Years</SelectItem>
                    <SelectItem value="3-5">3-5 Years</SelectItem>
                    <SelectItem value="5+">5+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label
                  htmlFor="edit-position"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Open Positions
                </Label>
                <Input
                  id="edit-position"
                  type="number"
                  min="1"
                  value={editForm.position}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      position: Number(e.target.value) || 1,
                    })
                  }
                  required
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                disabled={updating}
                className="w-full sm:w-auto rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}