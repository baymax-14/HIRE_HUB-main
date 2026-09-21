import {createSlice} from '@reduxjs/toolkit';
import { act } from 'react';
const companySlice  = createSlice({
    name:"company",
    initialState:{
        singleComapny :null,
        companies:[],
        searchcomanybytext:"",
    },
    reducers:{
        setSinglecompany:(state,action) =>{
            state.singleComapny = action.payload
        },
        setCompanies:(state,action) =>{
            state.companies = action.payload
        },
        setsearchcomanybytext:(state,action) =>{
            state.searchcomanybytext = action.payload
        }

    }
});
export const {setSinglecompany,setCompanies,setsearchcomanybytext} = companySlice.actions;
export default companySlice.reducer;