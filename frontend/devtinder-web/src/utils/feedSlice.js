import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed:(state,action)=>{
      const newFeed= state.filter((user)=>{
        if(user._id===action.payload){
          return;
        }
        return user
      });
      return newFeed
    },
    clearFeed:()=>{
    return null;
  }
  }, 
});

export const {addFeed,removeUserFromFeed,clearFeed}=feedSlice.actions;
export default feedSlice.reducer;