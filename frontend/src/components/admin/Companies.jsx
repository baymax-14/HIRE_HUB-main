// import { useNavigate } from "react-router-dom";
// import Navbar from "../shared/Navbar";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import CompanisTable from "./Companiestable";
// import UsegetAllcompanies from "@/hooks/usegetAllcompanies";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { setsearchcomanybytext } from "@/redux/companyslice";

// export default function Companies(){
//     UsegetAllcompanies(); // useeffect
//     //filter
//     const [input,setInput] = useState("");
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     // i have to track each and every changes so i will pass all the changes in the redux and in the companiestable i will fetch it
//     useEffect(() =>{
//       dispatch(setsearchcomanybytext(input))
//     },[input])
//     return(
//         <div>
//            <Navbar />
//            <div className="max-w-6xl mx-auto my-10">
//             <div className="flex items-center justify-between my-5">
//               <Input 
//               className='w-fit'
//               placeholder="filter by name"
//               onChange={(e) => setInput(e.target.value)}
//               />
//               {/* after click new page will open for register the company */}
//               <Button  onClick={() => navigate("/admin/companies/create")} className="cursor-pointer" >New Companies</Button>
//             </div>
//                <CompanisTable />
//            </div>
//         </div>
//     );
// }

import { useNavigate } from "react-router-dom"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import CompanisTable from "./Companiestable"
import UsegetAllcompanies from "@/hooks/usegetAllcompanies"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setsearchcomanybytext } from "@/redux/companyslice"

export default function Companies() {
  UsegetAllcompanies() // useeffect
  //filter
  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // i have to track each and every changes so i will pass all the changes in the redux and in the companiestable i will fetch it
  useEffect(() => {
    dispatch(setsearchcomanybytext(input))
  }, [input])
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 my-4 sm:my-5">
          <Input
            className="w-full sm:w-fit sm:max-w-xs"
            placeholder="filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          {/* after click new page will open for register the company */}
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="cursor-pointer w-full sm:w-auto whitespace-nowrap"
          >
            New Companies
          </Button>
        </div>
        <CompanisTable />
      </div>
    </div>
  )
}
