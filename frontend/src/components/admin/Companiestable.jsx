"use client";

import { Edit2, MoreHorizontal, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/util/const";
import { setCompanies } from "@/redux/companyslice";
import { toast } from "sonner";

export default function CompanisTable() {
  const { companies = [], searchcomanybytext = "" } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filtercompany, setfiltercompany] = useState(companies);

  // Delete company state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const filteredcompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchcomanybytext) return true;
        return company?.name?.toLowerCase().includes(searchcomanybytext.toLowerCase());
      });

    setfiltercompany(filteredcompany || []);
  }, [companies, searchcomanybytext]);

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
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyToDelete._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Company and related data deleted successfully");
        const updatedList = companies.filter((c) => c._id !== companyToDelete._id);
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

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-xs">
      <Table className="min-w-full">
        <TableCaption className="text-xs sm:text-sm py-3 text-gray-500">List of registered companies</TableCaption>
        <TableHeader className="bg-gray-50/80">
          <TableRow>
            <TableHead className="text-xs sm:text-sm px-3 sm:px-4 font-semibold text-gray-700">Logo</TableHead>
            <TableHead className="text-xs sm:text-sm px-3 sm:px-4 font-semibold text-gray-700">Name</TableHead>
            <TableHead className="text-xs sm:text-sm px-3 sm:px-4 font-semibold text-gray-700">Date Registered</TableHead>
            <TableHead className="text-right text-xs sm:text-sm px-3 sm:px-4 font-semibold text-gray-700">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtercompany?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 text-sm sm:text-base py-8">
                No companies registered yet
              </TableCell>
            </TableRow>
          ) : (
            filtercompany?.map((company) => (
              <TableRow key={company._id} className="hover:bg-gray-50/60 transition-colors">
                <TableCell className="px-3 sm:px-4 py-3">
                  <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border shadow-2xs">
                    <AvatarImage src={company.logo || "/placeholder.svg"} className="object-contain p-1" />
                  </Avatar>
                </TableCell>
                <TableCell className="text-xs sm:text-sm font-semibold text-gray-900 px-3 sm:px-4 py-3">
                  <div className="truncate max-w-[150px] sm:max-w-none">{company.name}</div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-3">
                  {company.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right px-3 sm:px-4 py-3">
                  <Popover>
                    <PopoverTrigger className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-1.5 rounded-xl" align="end">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 w-full p-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Company</span>
                      </div>
                      <div className="my-1 border-t border-gray-100" />
                      <div
                        onClick={() => openDeleteDialog(company)}
                        className="flex items-center gap-2 w-full p-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* ── Delete Company Confirmation Dialog ── */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">Delete Company?</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 pt-1 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{companyToDelete?.name}"</span>? 
              This will permanently delete the company profile, all jobs posted under it, and all related applicant records.
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
              onClick={confirmDeleteCompany}
              disabled={deleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
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
