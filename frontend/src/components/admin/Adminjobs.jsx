//after click on the job
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminjobsTable from "./AdminjobsTable";
import { setsearchjobbytext } from "@/redux/jobslice";
import { Plus } from "lucide-react";
import Usegetalladminjobs from "@/hooks/usegetAlladminjobs";

export default function Jobsadmin(){
     Usegetalladminjobs();
    //filter
    const [input,setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // i have to track each and every changes so i will pass all the changes in the redux and in the companiestable i will fetch it
    useEffect(() =>{
      dispatch(setsearchjobbytext(input))
    },[input])
    return(
        <div>
           <Navbar />
           <div className="max-w-6xl mx-auto my-10 px-4">
            <div className="flex items-center justify-between my-5 gap-3">
              <Input 
              className='w-full sm:w-72 rounded-xl'
              placeholder="Filter by title or company..."
              onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={() => navigate("/admin/jobs/create")} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 shrink-0" >
                <Plus className="w-4 h-4" />
                <span>Post New Job</span>
              </Button>
            </div>
               <AdminjobsTable />
           </div>
        </div>
    );
}