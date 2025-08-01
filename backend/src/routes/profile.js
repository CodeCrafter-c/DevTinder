const express=require("express");


const { userAuth } = require("../middlewares/auth");
const {validateUserEditDetails}=require("../utils/validation")
const upload=require("../../config/multer")
const { User } = require("../models/user"); // importing User model


const profileRouter=express.Router();

profileRouter.get("/view", userAuth,async (req, res) => {
  res.json(req.user);
});



profileRouter.patch("/edit",userAuth,upload.single("photo"),async(req,res)=>{
  try{
    validateUserEditDetails(req);
    const user= await req.user.save()

    res.json({
      "message":"Profile updated successfully",
      "data":user
    });
  }
  catch(err){{
    res.json({
      "error":`${err.message}`
    })
  }}
})


// profileRouter.patch("/password",(req,res)=>{
//   const {email}=req.body; 
// })
module.exports={
    profileRouter
}