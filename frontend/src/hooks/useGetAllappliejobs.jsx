import { setallappliedjobs } from "@/redux/jobslice";
import { APPLICATION_API_END_POINT } from "@/util/const";
import axios from "axios";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";

export default function useGetAllAppliedJobs()
{
    const dispatch = useDispatch();
    useEffect(() =>{
        const fetchAllappliedjobs = async() =>{
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`,{withCredentials:true})
                if(res.data.success){
                    dispatch(setallappliedjobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllappliedjobs();
    },[])
}