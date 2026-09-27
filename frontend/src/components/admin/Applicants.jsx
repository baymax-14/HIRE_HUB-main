import { useEffect } from "react"
import Navbar from "../shared/Navbar"
import ApplicantsTable from "./ApplicantsTable"
import axios from "axios"
import { APPLICATION_API_END_POINT } from "@/util/const"
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setAllapplicants } from "@/redux/applicants"
import { ArrowLeft, Users } from "lucide-react"

export default function Applicants() {
  const param = useParams()
  const dispatch = useDispatch()
  const { applicants } = useSelector((store) => store.application)

  useEffect(() => {
    const fetchalljobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${param.id}/applicants`, {
          withCredentials: true,
        })
        dispatch(setAllapplicants(res.data.job))
      } catch (error) {
        console.log(error)
      }
    }
    fetchalljobs()
  }, [param.id, dispatch])

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6 lg:my-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link
                to="/admin/jobs"
                className="hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Jobs
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate max-w-[200px]">
                {applicants?.title || "Job Applicants"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">
                Applicants ({applicants?.application?.length || 0})
              </h1>
              {applicants?.title && (
                <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {applicants.title}
                </span>
              )}
            </div>
          </div>
        </div>

        <ApplicantsTable />
      </div>
    </div>
  )
}

