import { setallAdminjobs } from "@/redux/jobslice";
import { JOB_API_END_POINT } from "@/util/const";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Usegetalladminjobs()
{
  const dispatch = useDispatch();
  useEffect(() =>{
      const fetchcalladminjobs = async() =>{
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
          console.log(res.data);
          if(res.data.success)
          {
            dispatch(setallAdminjobs(res.data.jobs));
          }
        } catch (error) {
          console.log(error);
        }
  
      }
      fetchcalladminjobs();
  },[])
}
