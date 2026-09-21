// import { Edit2, MoreHorizontal } from "lucide-react";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
// import { useSelector } from "react-redux";
// import store from "@/redux/store";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function CompanisTable(){
//     const {companies,searchcomanybytext} = useSelector(store => store.company);
//     //filter company
//     const [filtercompany,setfiltercompany] = useState(companies);

//     useEffect(() => {
//   const filteredcompany = companies.length >= 0 && companies.filter((company) => {
//     if (!searchcomanybytext) return true;

//     return company?.name?.toLowerCase().includes(searchcomanybytext.toLowerCase());
//   });

//   setfiltercompany(filteredcompany);
// }, [companies, searchcomanybytext]);

//     const navigate = useNavigate();
//     return(
//         <div>
//             <Table>
//                 <TableCaption>List of registered company</TableCaption>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Logo</TableHead>
//                         <TableHead>Home</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead className="text-right">Action</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                  <TableBody>
//                     {
//                         filtercompany?.map((company) => (
//                             <tr>
//                                 <TableCell>
//                                     <Avatar>
//                                         <AvatarImage src={company.logo}/>
//                                     </Avatar>
//                                 </TableCell>
//                                 <TableCell>{company.name}</TableCell>
//                                 <TableCell>{company.createdAt.split("T")[0]}</TableCell>
//                                 <TableCell className="text-right cursor-pointer">
//                                     <Popover>
//                                         <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
//                                         <PopoverContent className="w-32">
//                                             <div onClick={()=> navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
//                                                 <Edit2 className='w-4' />
//                                                 <span>Edit</span>
//                                             </div>
//                                         </PopoverContent>
//                                     </Popover>
//                                 </TableCell>
//                             </tr>

//                         ))
//                     }
//                 </TableBody>
//             </Table>
//         </div>
//     );
// }

"use client"

import { Edit2, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function CompanisTable() {
  const { companies, searchcomanybytext } = useSelector((store) => store.company)
  //filter company
  const [filtercompany, setfiltercompany] = useState(companies)

  useEffect(() => {
    const filteredcompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchcomanybytext) return true

        return company?.name?.toLowerCase().includes(searchcomanybytext.toLowerCase())
      })

    setfiltercompany(filteredcompany)
  }, [companies, searchcomanybytext])

  const navigate = useNavigate()
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableCaption className="text-sm sm:text-base">List of registered company</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Logo</TableHead>
            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Name</TableHead>
            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Date</TableHead>
            <TableHead className="text-right text-xs sm:text-sm px-2 sm:px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtercompany?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 text-sm sm:text-base py-6 sm:py-8">
                No companies registered yet
              </TableCell>
            </TableRow>
          ) : (
            filtercompany?.map((company) => (
              <TableRow key={company._id}>
                <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarImage src={company.logo || "/placeholder.svg"} />
                  </Avatar>
                </TableCell>
                <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
                  <div className="truncate max-w-[120px] sm:max-w-none">{company.name}</div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
                  {company.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="text-right cursor-pointer px-2 sm:px-4 py-2 sm:py-3">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                    </PopoverTrigger>
                    <PopoverContent className="w-28 sm:w-32">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer hover:bg-gray-50 p-1 rounded text-xs sm:text-sm"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Edit</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
