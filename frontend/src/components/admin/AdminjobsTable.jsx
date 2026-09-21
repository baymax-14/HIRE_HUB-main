import { Edit2, Eye, MoreHorizontal, Bell, BellOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
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
                // Update local and redux state
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

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <Table>
                <TableCaption className="py-3 text-xs text-gray-500">
                    A list of your posted jobs. Click on the alert badge to mute or unmute email notifications.
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
                                            <PopoverContent className="w-44 p-2 rounded-xl" align="end">
                                                {job?.company?._id && (
                                                    <div
                                                        onClick={() => navigate(`/admin/companies/${job.company._id}`)}
                                                        className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span>Edit Company</span>
                                                    </div>
                                                )}
                                                <div
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                    className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>View Applicants</span>
                                                </div>
                                                <div
                                                    onClick={() => toggleAlerts(job._id)}
                                                    className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    {isAlertsOn ? (
                                                        <>
                                                            <BellOff className="w-4 h-4 text-gray-500" />
                                                            <span>Mute Email Alerts</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bell className="w-4 h-4 text-purple-600" />
                                                            <span>Enable Email Alerts</span>
                                                        </>
                                                    )}
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
        </div>
    );
}