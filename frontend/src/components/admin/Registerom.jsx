// import { useNavigate } from "react-router-dom";
// import Navbar from "../shared/Navbar";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import axios from "axios";
// import { COMPANY_API_END_POINT } from "@/util/const";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { setSinglecompany } from "@/redux/companyslice";

// export default function Registercom(){
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [companyname,setCompanyname] = useState();
    
//     const registercompany = async() =>{
//         try {
//             const res = await axios.post(`${COMPANY_API_END_POINT}/registerC`,{name:companyname},{
//                 headers:{
//                     'Content-Type':'application/json'
//                 },
//                 withCredentials:true
//             });

//             if(res?.data?.success)
//             {
//                 dispatch(setSinglecompany(res.data.company))
//                 toast.success(res.data.message); 
//                 const companyid = res?.data?.company?._id; //created by mongo companysetup
//                 navigate(`/admin/companies/${companyid}`)
//             }

            
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return(
//         <div>
//             <Navbar/>
//             <div className="max-w-4xl mx-auto">
//                 <div className="my-10">
//                     <h1 className="font-bold text-2xl">Your comany name</h1>
//                     <p className="text-gray-500">what would you like to give comapny name? you can changed it later on</p>
//                 </div>
//                 <Label>Company Name</Label>
//                 <Input
//                  type="text"
//                 className="my-2"
//                 placeholder="Enter Your Company Name" 
//                 onChange={(e) => setCompanyname(e.target.value)}
//                 />
//                 <div className="flex gap-2 my-8 items-center">
//                     <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancle</Button>
//                     <Button onClick={registercompany} className="cursor-pointer" >Continue</Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client"

import { useNavigate } from "react-router-dom"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { COMPANY_API_END_POINT } from "@/util/const"
import { useState } from "react"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setSinglecompany } from "@/redux/companyslice"

export default function Registercom() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [companyname, setCompanyname] = useState()

  const registercompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/registerC`,
        { name: companyname },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )

      if (res?.data?.success) {
        dispatch(setSinglecompany(res.data.company))
        toast.success(res.data.message)
        const companyid = res?.data?.company?._id //created by mongo companysetup
        navigate(`/admin/companies/${companyid}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="my-6 sm:my-8 lg:my-10">
          <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">Your comany name</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            what would you like to give comapny name? you can changed it later on
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-sm sm:text-base">Company Name</Label>
          <Input
            type="text"
            className="w-full h-10 sm:h-11"
            placeholder="Enter Your Company Name"
            onChange={(e) => setCompanyname(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 my-6 sm:my-8 items-stretch sm:items-center">
          <Button variant="outline" onClick={() => navigate("/admin/companies")} className="w-full sm:w-auto">
            Cancle
          </Button>
          <Button onClick={registercompany} className="cursor-pointer w-full sm:w-auto">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
