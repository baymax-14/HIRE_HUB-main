import { setCompanies} from "@/redux/companyslice";
import { COMPANY_API_END_POINT } from "@/util/const";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
//get company
export default function UsegetAllcompanies ()
{
  const dispatch = useDispatch();
    useEffect(() =>{
        const fetchcompanies= async() =>{
               try {
                 const res =  await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true})
                 if(res.data.success)
                 {
                  dispatch(setCompanies(res.data.comapnies))
                 }
               } catch (error) {
                console.log(error);
               }
        }
      fetchcompanies();
    },[])
}