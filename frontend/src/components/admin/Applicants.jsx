// import { useEffect } from "react";
// import Navbar from "../shared/Navbar";
// import ApplicantsTable from "./ApplicantsTable";
// import axios from "axios";
// import { APPLICATION_API_END_POINT } from "@/util/const";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setAllapplicants } from "@/redux/applicants";
// import store from "@/redux/store";

// export default function Applicants(){
//     const param = useParams();
//     const dispatch = useDispatch();
//     const {applicants} = useSelector(store => store.application)
// useEffect(() =>{
//     const fetchalljobs = async() =>{
//          try {
//             const res = await axios.get(`${APPLICATION_API_END_POINT}/${param.id}/applicants`,{withCredentials:true})
//             dispatch(setAllapplicants(res.data.job));
//          } catch (error) {
//             console.log(error);
//          }
//     }
//     fetchalljobs();
// },[])
//     return(
//         <div>
//             <Navbar />
//             <div className="max-w-5xl mx-auto">
//                 <h1 className="font-bold text-xl my-5"> Applicants({applicants?.application?.length})</h1>
//                 <ApplicantsTable />
//             </div>
//         </div>
//     );
// }

import { useEffect } from "react"
import Navbar from "../shared/Navbar"
import ApplicantsTable from "./ApplicantsTable"
import axios from "axios"
import { APPLICATION_API_END_POINT } from "@/util/const"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setAllapplicants } from "@/redux/applicants"

export default function Applicants() {
  const param = useParams()
  const dispatch = useDispatch()
  const { applicants } = useSelector((store) => store.application)
  useEffect(() => {
    const fetchalljobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${param.id}/applicants`, { withCredentials: true })
        dispatch(setAllapplicants(res.data.job))
      } catch (error) {
        console.log(error)
      }
    }
    fetchalljobs()
  }, [])
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6 lg:my-8">
        <h1 className="font-bold text-lg sm:text-xl lg:text-2xl my-3 sm:my-4 lg:my-5">
          Applicants ({applicants?.application?.length || 0})
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  )
}
