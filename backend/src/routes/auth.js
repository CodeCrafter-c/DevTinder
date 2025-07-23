const express=require("express");
const bcrypt = require("bcrypt");


// self created modules
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");


// data mdoels for databses
const { User } = require("../models/user"); // importing User model


const authRouter=express.Router();


// creating user
authRouter.post("/signup", async (req, res) => {
  try {
    // validation of the data
    validateSignUpData(req);

    // encrypt the password
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user in database
    const { firstname, lastname, email } = req.body;
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const savedUser =await user.save();

        const token = await savedUser.getJWT();

    // retruning token inside a cookie
    res.cookie("token", token), { httpOnly: true };
    res.json({"message": "new user formed Successfully" , "data":savedUser});

  } catch (err) {
    res.status(400).send("error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {

  try {
    //  extracting email and password
    const { email, password } = req.body;

    // check user with email exist or not
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // comapring password with the hashed one
    const checkPassword = await user.validatePassword(password);
    if (!checkPassword) {
      throw new Error("Invalid credentialss");
    }

    // creating token
    const token = await user.getJWT();

    // retruning token inside a cookie
    res.cookie("token", token), { httpOnly: true };

    res.status(200).json(user)
  } catch (err) {
    res.status(401).send("Failed to login : " + err.message);
  }
});


authRouter.post("/logout",async(req,res)=>{
  
    try{
        res.clearCookie("token",{httpOnly:true});
        res.status(200).json({
            "logout":"true"
        });
    }catch(err){}    
})



module.exports={
    authRouter
}

