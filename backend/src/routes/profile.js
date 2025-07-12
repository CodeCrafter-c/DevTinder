const express=require("express");


const { userAuth } = require("../middlewares/auth");
const {validateUserEditDetails}=require("../utils/validation")


const { User } = require("../models/user"); // importing User model


const profileRouter=express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  res.json(req.user);
});



profileRouter.patch("/edit",userAuth,(req,res)=>{
  try{
    validateUserEditDetails(req);
    // console.log(req.user);
    res.json(req.user);
  }
  catch(err){{
    res.json({
      "error":`${err.message}`
    })
  }}
})


profileRouter.patch("/password",(req,res)=>{
  const {email}=req.body; 
})
module.exports={
    profileRouter
}