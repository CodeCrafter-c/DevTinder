import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

export default function Body() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const userData= useSelector((store)=>store.user)

  const fetchUser=async()=>{
    if(userData){
      return;
    }
    try{
        const user= await axios.get((BASE_URL+"profile/view"),{withCredentials:true})
        // console.log(user)
        dispatch(addUser(user.data));
    }
    catch(err){
      if(err.status==401){
        return navigate('/login')
      }
      console.error(err)
    }
    }
  useEffect(()=>{
    fetchUser()
  },[])
  
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}
