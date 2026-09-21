// import { ArrowLeft, Loader2 } from "lucide-react";
// import Navbar from "../shared/Navbar";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import store from "@/redux/store";
// import axios from "axios";
// import { COMPANY_API_END_POINT } from "@/util/const";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { setLoading } from "@/redux/authSlice";
// import { setSinglecompany } from "@/redux/companyslice";
// import Usecompanybyid from "@/hooks/usecompanybyid";

// export default function Companysetup() {
//   const params = useParams();
//   const {singleComapny} = useSelector(store => store.company)
//   Usecompanybyid(params.id); //hooks
//   const [input, setInput] = useState({
//     name:"",
//     description:"",
//     website:"",
//     location:"",
//     file:null,
//   });
//   const{loading} = useSelector(store=> store.auth);
//   const dispatch = useDispatch();
//   const navigate=  useNavigate();
//   const changeEventhanfler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };
//    const filehandler = (e) =>{
//         setInput({...input,file:e.target.files?.[0]})
//     }

//     const submithandler = async(e) =>{
//       e.preventDefault();

//       const formdata = new FormData();
//       formdata.append("name",input.name);
//       formdata.append("description",input.description);
//       formdata.append("website",input.website);
//       formdata.append("location",input.location);
//        if(input.file)
//         {
//             formdata.append("file",input.file);
//        }
//        try {
//         dispatch(setLoading(true));
//         const res= await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`,formdata,{
//           headers:{
//              "Content-Type":"multipart/form-data"
//           },
//           withCredentials:true
//         })
//          if(res.data.success)
//         {
//             dispatch(setSinglecompany(res.data.company));
//             toast.success(res.data.message);
//             navigate("/admin/companies");     

//         }
//        }catch (error) {
//         console.log(error);
//         toast.error(error.response.data.message);
//        }finally{
//         dispatch(setLoading(false));
//        }
//     }
//     useEffect(() => {
//     if (singleComapny) {
//         setInput({
//             name: singleComapny.name || "",
//             description: singleComapny.description || "",
//             website: singleComapny.website || "",
//             location: singleComapny.location || "",
//             file: null // Never pre-fill file input for security reasons
//         });
//     }
// }, [singleComapny]);


//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-xl mx-auto my-10">
//         <form onSubmit={submithandler}>
//           <div className="flex items-center gap-5 p-8">
//             <Button
//             onClick={() => navigate("/admin/companies")}
//               variant="outline"

//               className="flex gap-2 items-center font-semibold cursor-pointer"
//             >
//               <ArrowLeft />
//               <span>Back</span>
//             </Button>
//             <h1 className="text-xl font-bold">Company Setup</h1>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//                <Label className="mb-3">Company Name</Label>
//                <Input
//                type="text"
//                name="name"
//                value={input.name}
//                onChange={changeEventhanfler}
//              />
//             </div>
//              <div>
//                <Label className="mb-3">Description</Label>
//                <Input
//                type="text"
//                name="description"
//                value={input.description}
//                onChange={changeEventhanfler}
//              />
//             </div>
//              <div>
//                <Label className="mb-3">website</Label>
//                <Input
//                type="text"
//                name="website"
//                value={input.website}
//                onChange={changeEventhanfler}
//              />
//             </div>
//              <div>
//                <Label className="mb-3">location</Label>
//                <Input
//                type="text"
//                name="location"
//                value={input.location}
//                onChange={changeEventhanfler}
//              />
//             </div>
//             <div>
//                <Label className="mb-3">Logo</Label>
//                <Input
//                type="file"
//                accpect="image/*"
//                onChange={filehandler}
//             className="cursor-pointer"
//              />
//             </div>
//           </div>
//           {
//             loading ?  <Button className="w-full my-3"> <Loader2 className="h-4 w-4 mr-2 animate-spin"/>Please wait</Button>:<Button type="submit" className="w-full my-3 cursor-pointer">
//             Update
//           </Button>
//           }
//         </form>
//       </div>
//     </div>
//   );
// }

"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { COMPANY_API_END_POINT } from "@/util/const"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { setLoading } from "@/redux/authSlice"
import { setSinglecompany } from "@/redux/companyslice"
import Usecompanybyid from "@/hooks/usecompanybyid"

export default function Companysetup() {
  const params = useParams()
  const { singleComapny } = useSelector((store) => store.company)
  Usecompanybyid(params.id) //hooks
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  })
  const { loading } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const changeEventhanfler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  const filehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] })
  }

  const submithandler = async (e) => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("name", input.name)
    formdata.append("description", input.description)
    formdata.append("website", input.website)
    formdata.append("location", input.location)
    if (input.file) {
      formdata.append("file", input.file)
    }
    try {
      dispatch(setLoading(true))
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      if (res.data.success) {
        dispatch(setSinglecompany(res.data.company))
        toast.success(res.data.message)
        navigate("/admin/companies")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
  useEffect(() => {
    if (singleComapny) {
      setInput({
        name: singleComapny.name || "",
        description: singleComapny.description || "",
        website: singleComapny.website || "",
        location: singleComapny.location || "",
        file: null, // Never pre-fill file input for security reasons
      })
    }
  }, [singleComapny])

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8">
        <form onSubmit={submithandler}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-4 sm:p-6 lg:p-8">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex gap-2 items-center font-semibold cursor-pointer text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Company Setup</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventhanfler}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventhanfler}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventhanfler}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventhanfler}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm sm:text-base">Logo</Label>
              <Input type="file" accpect="image/*" onChange={filehandler} className="cursor-pointer h-10 sm:h-11" />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4 sm:my-6 h-10 sm:h-11" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 sm:my-6 cursor-pointer h-10 sm:h-11">
              Update
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
