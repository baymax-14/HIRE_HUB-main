import { Edit2, Eye, MoreHorizontal, Bell, BellOff, Trash2, Loader2, AlertCircle, Edit3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/util/const";
import { toast } from "sonner";
import { setallAdminjobs } from "@/redux/jobslice";

export default function AdminjobsTable() {
    const { alladminjob = [], searchjobbytext = "" } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filterjobs, setfilterjobs] = useState(alladminjob);

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

    useEffect(() => {
        const filteredjobs = alladminjob?.length >= 0 && alladminjob.filter((job) => {
            if (!searchjobbytext) return true;
            const titleMatch = job?.title?.toLowerCase().includes(searchjobbytext.toLowerCase());
            const companyMatch = job?.company?.name?.toLowerCase().includes(searchjobbytext.toLowerCase());
            return titleMatch || companyMatch;
        });

        setfilterjobs(filteredjobs || []);
    }, [alladminjob, searchjobbytext]);

    const toggleAlerts = async (jobId) => {
        try {
            const res = await axios.put(`${JOB_API_END_POINT}/toggle-alerts/${jobId}`, {}, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                const updatedList = alladminjob.map((j) =>
                    j._id === jobId ? { ...j, emailAlerts: res.data.emailAlerts } : j
                );
                dispatch(setallAdminjobs(updatedList));
            }
        } catch (error) {
            console.error("Failed to toggle email alerts:", error);
            toast.error(error?.response?.data?.message || "Failed to update email alert setting");
        }
    };

    // Open Delete confirmation dialog
    const openDeleteDialog = (job) => {
        setJobToDelete(job);
        setDeleteModalOpen(true);
    };

    // Execute Delete Job
    const confirmDeleteJob = async () => {
        if (!jobToDelete) return;
        try {
            setDeleting(true);
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobToDelete._id}`, {
                withCredentials: true,
            });

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

    // Open Edit modal with pre-filled fields
    const openEditDialog = (job) => {
        setJobToEdit(job);
        setEditForm({
            title: job.title || "",
            description: job.description || "",
            requirement: Array.isArray(job.requirement) ? job.requirement.join(", ") : (job.requirement || ""),
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "Full-time",
            experiance: job.experiance || "1-3",
            position: job.position || 1,
        });
        setEditModalOpen(true);
    };

    // Execute Edit Job
    const handleUpdateJob = async (e) => {
        e.preventDefault();
        if (!jobToEdit) return;

        try {
            setUpdating(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobToEdit._id}`, editForm, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message || "Job updated successfully");
                const updatedJob = res.data.job;
                const updatedList = alladminjob.map((j) => (j._id === jobToEdit._id ? updatedJob : j));
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

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <Table>
                <TableCaption className="py-3 text-xs text-gray-500">
                    A list of your posted jobs. Click on the alert badge to toggle email notifications.
                </TableCaption>
                <TableHeader className="bg-gray-50/80">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Company</TableHead>
                        <TableHead className="font-semibold text-gray-700">Role</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email Alerts</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date Posted</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterjobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500 text-sm">
                                No jobs found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterjobs.map((job) => {
                            const isAlertsOn = job?.emailAlerts !== false;
                            return (
                                <TableRow key={job._id} className="hover:bg-gray-50/60 transition-colors">
                                    <TableCell className="font-semibold text-gray-900">
                                        {job?.company?.name || "N/A"}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-800">{job?.title}</TableCell>
                                    <TableCell>
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
                                    <TableCell className="text-gray-500 text-sm">
                                        {job?.createdAt?.split("T")[0]}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-48 p-2 rounded-xl" align="end">
                                                <div
                                                    onClick={() => openEditDialog(job)}
                                                    className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4 text-purple-600" />
                                                    <span>Edit Job Details</span>
                                                </div>
                                                <div
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                    className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-indigo-600" />
                                                    <span>View Applicants</span>
                                                </div>
                                                {job?.company?._id && (
                                                    <div
                                                        onClick={() => navigate(`/admin/companies/${job.company._id}`)}
                                                        className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-gray-500" />
                                                        <span>Edit Company</span>
                                                    </div>
                                                )}
                                                <div
                                                    onClick={() => toggleAlerts(job._id)}
                                                    className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    {isAlertsOn ? (
                                                        <>
                                                            <BellOff className="w-4 h-4 text-gray-500" />
                                                            <span>Mute Alerts</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bell className="w-4 h-4 text-purple-600" />
                                                            <span>Enable Alerts</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="my-1 border-t border-gray-100" />
                                                <div
                                                    onClick={() => openDeleteDialog(job)}
                                                    className="flex items-center gap-2 w-full p-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete Job</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="w-[95vw] max-w-md">
                    <DialogHeader>
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-gray-900">Delete Job Posting?</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 pt-1 leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-gray-800">"{jobToDelete?.title}"</span>? 
                            This will permanently remove the job posting and all associated candidate applications. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleting}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmDeleteJob}
                            disabled={deleting}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
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
                        <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">Edit Job Posting</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-gray-500">
                            Update details, compensation, and requirements for this role.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateJob} className="space-y-4 pt-2">
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-title" className="text-xs sm:text-sm font-medium text-gray-700">
                                Job Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                required
                                className="h-10"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-desc" className="text-xs sm:text-sm font-medium text-gray-700">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                id="edit-desc"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                required
                                rows={4}
                                className="w-full rounded-md border border-gray-300 p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-req" className="text-xs sm:text-sm font-medium text-gray-700">
                                Requirements / Skills (comma separated) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-req"
                                value={editForm.requirement}
                                onChange={(e) => setEditForm({ ...editForm, requirement: e.target.value })}
                                placeholder="e.g. React, Node.js, Python, AWS"
                                required
                                className="h-10"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-salary" className="text-xs sm:text-sm font-medium text-gray-700">
                                    Annual Salary (INR) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-salary"
                                    type="number"
                                    value={editForm.salary}
                                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                                    required
                                    className="h-10"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-location" className="text-xs sm:text-sm font-medium text-gray-700">
                                    Location <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-location"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    required
                                    className="h-10"
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
                                    onValueChange={(val) => setEditForm({ ...editForm, jobType: val })}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-exp" className="text-xs sm:text-sm font-medium text-gray-700">
                                    Experience (Yrs)
                                </Label>
                                <Input
                                    id="edit-exp"
                                    value={editForm.experiance}
                                    onChange={(e) => setEditForm({ ...editForm, experiance: e.target.value })}
                                    placeholder="e.g. 2-5"
                                    className="h-10"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-pos" className="text-xs sm:text-sm font-medium text-gray-700">
                                    Open Positions
                                </Label>
                                <Input
                                    id="edit-pos"
                                    type="number"
                                    min="1"
                                    value={editForm.position}
                                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                    className="h-10"
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditModalOpen(false)}
                                disabled={updating}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updating}
                                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
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