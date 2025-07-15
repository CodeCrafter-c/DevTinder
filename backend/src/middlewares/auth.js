const jwt=require("jsonwebtoken")
const {User} =require("../models/user");

const userAuth=async function(req,res,next){
    0
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(401).send("You are not authorized")
        }

        // verfiy token
        const decoded=await jwt.verify(token,"devTinder_87jwt$#")
        
        // finding user with uid
        const user=await User.findOne({_id:decoded.uid});
        if(!user){
            throw new Error("no such user found");
        }
        req.user=user;
        next()
    }catch(err){
        res.status(400).json({
            "authorization":"falied",
            "error":`${err.message}`
        })
    }
}

module.exports={
    userAuth
}

