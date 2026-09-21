import { setAlljobs, setJobLoading, setPagination } from "@/redux/jobslice";
import { JOB_API_END_POINT } from "@/util/const";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const JOBS_PER_PAGE = 12;

export default function Usegetalljobs() {
  const jobState = useSelector((store) => store.job) || {};
  const searchedQuery = jobState.searchedQuery || "";
  const currentPage = jobState.currentPage || 1;
  const filters = jobState.filters || {};
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchalljobs = async () => {
      try {
        dispatch(setJobLoading(true));

        // Build query params from filters + searchedQuery
        const params = new URLSearchParams();

        // The keyword can come from either searchedQuery or filters.keyword
        const keyword = filters.keyword || searchedQuery;
        if (keyword) params.append("keyword", keyword);
        if (filters.location) params.append("location", filters.location);
        if (filters.jobType) params.append("jobType", filters.jobType);
        if (filters.salaryMin > 0)
          params.append("salaryMin", filters.salaryMin);
        if (filters.salaryMax > 0)
          params.append("salaryMax", filters.salaryMax);
        params.append("page", currentPage);
        params.append("limit", JOBS_PER_PAGE);

        const res = await axios.get(
          `${JOB_API_END_POINT}/get?${params.toString()}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAlljobs(res.data.job));
          dispatch(
            setPagination({
              totalJobs: res.data.totalJobs,
              totalPages: res.data.totalPages,
              currentPage: res.data.currentPage,
            })
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setJobLoading(false));
      }
    };
    fetchalljobs();
  }, [searchedQuery, filters, currentPage]);
}