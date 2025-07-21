import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:"requests",
    initialState:null,
    reducers:{
        addRequests:(state,action)=>{
            return action.payload;
        },
        removeRequest:(state,action)=>{
            state=state.filter((req)=>{
                if (req.fromUserId._id===action.payload){
                    return;
                }
                else{
                    return req;
                }
            })
            console.log(state);
            return state;
        },
        clearRequest:()=>{
            return null
        }
    }
})

export const {addRequests,removeRequest,clearRequest}=requestSlice.actions;
export default requestSlice.reducer;