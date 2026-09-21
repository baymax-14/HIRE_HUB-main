import {createSlice} from "@reduxjs/toolkit";

const jobslice = createSlice({
    name:"job",
    initialState:{
        alljobs:[],
        alladminjob:[],
        singlejob:null,
        searchjobbytext:"",
        allappliedjobs:[],
        searchedQuery:"",
        loading:false,
        // Advanced filter state
        filters: {
            keyword: "",
            location: "",
            jobType: "",
            salaryMin: 0,
            salaryMax: 0,
        },
        // Pagination state
        totalJobs: 0,
        totalPages: 1,
        currentPage: 1,
    },
    reducers:{
        setAlljobs:(state,action) => {
            state.alljobs = action.payload;
        },
        setsinglejob:(state,action) =>{
            state.singlejob = action.payload;
        },
        setallAdminjobs:(state,action) =>{
            state.alladminjob = action.payload
        },
        setsearchjobbytext:(state,action) =>{
            state.searchjobbytext = action.payload
        },
        setallappliedjobs:(state,action) =>{
            state.allappliedjobs = action.payload
        },
        setsearchedQuery:(state,action) =>{
            state.searchedQuery = action.payload
        },
        setJobLoading:(state,action) =>{
            state.loading = action.payload
        },
        setFilters:(state, action) =>{
            state.filters = { ...(state.filters || {}), ...action.payload };
            state.currentPage = 1; // Reset to page 1 on filter change
        },
        clearFilters:(state) =>{
            state.filters = {
                keyword: "",
                location: "",
                jobType: "",
                salaryMin: 0,
                salaryMax: 0,
            };
            state.searchedQuery = "";
            state.currentPage = 1;
        },
        setPagination:(state, action) =>{
            state.totalJobs = action.payload.totalJobs ?? state.totalJobs;
            state.totalPages = action.payload.totalPages ?? state.totalPages;
            state.currentPage = action.payload.currentPage ?? state.currentPage;
        },
        setCurrentPage:(state, action) =>{
            state.currentPage = action.payload;
        },
    }
});
export const {
    setAlljobs,
    setsinglejob,
    setsearchjobbytext,
    setallAdminjobs,
    setallappliedjobs,
    setsearchedQuery,
    setJobLoading,
    setFilters,
    clearFilters,
    setPagination,
    setCurrentPage,
} = jobslice.actions;
export default jobslice.reducer;