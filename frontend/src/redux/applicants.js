import {createSlice} from '@reduxjs/toolkit';

const applicationslice = createSlice({
    name:"application",
    initialState:{
        applicants:[]
    },
    reducers:{
        setAllapplicants:(state,action) =>{
            state.applicants = action.payload;
        }
    }
});

export const {setAllapplicants} = applicationslice.actions;

export default applicationslice.reducer;