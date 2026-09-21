import { setSinglecompany } from "@/redux/companyslice";
import { COMPANY_API_END_POINT} from "@/util/const";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function Usecompanybyid(companyid)
{
  const dispatch = useDispatch();
    useEffect(() =>{
        const fetchacompanybyid= async() =>{
               try {
                 const res =  await axios.get(`${COMPANY_API_END_POINT}/get/${companyid}`,{withCredentials:true})
                 if(res.data.success)
                 {
                  dispatch(setSinglecompany(res.data.company))
                 }
               } catch (error) {
                console.log(error);
               }
        }
      fetchacompanybyid();
    },[companyid,dispatch])
}