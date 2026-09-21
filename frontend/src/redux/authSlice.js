import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null
    },
    reducers:{
        //action //i have to dispatch it also
        setLoading:(state,action) =>{
        state.loading = action.payload;
      },
      //in backhand we are retuning succcess ,message,user, so now i want sore that data
      setuser:(state,action) =>{
        state.user = action.payload;
      },
      updateUserSavedJobs:(state, action) => {
        if (state.user) {
          state.user.savedJobs = action.payload;
        }
      }
    }
});

export const {setLoading, setuser, updateUserSavedJobs} = authSlice.actions;
export default authSlice.reducer;