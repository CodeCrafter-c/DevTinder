const express = require("express");
const bcrypt = require("bcrypt");

// self created modules
const { validateSignUpData, validateEmail } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

// data mdoels for databses
const { User } = require("../models/user"); // importing User model
const { generateOTP } = require("../utils/generateOTP");
const sendOtp = require("../utils/sendOtp");
const { Otp } = require("../models/otp");

const authRouter = express.Router();

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
    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    // retruning token inside a cookie
    (res.cookie("token", token), { httpOnly: true });
    res.json({ message: "new user formed Successfully", data: savedUser });
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
    (res.cookie("token", token), { httpOnly: true });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).send("Failed to login : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({
      logout: "true",
    });
  } catch (err) {}
});

authRouter.post("/OTP", async (req, res) => {
  try {
    const email = req.body?.email?.toLowerCase().trim();
    if (!email) throw new Error("Please enter Email");

    validateEmail(email);

    const otp = generateOTP();
    const isSent = await sendOtp(email, otp);

    if (isSent) {
      await Otp.findOneAndUpdate(
        { email },
        {
          $set: {
            otp,
            createdAt: new Date(), // restart TTL countdown
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      return res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to send OTP, please try again",
        });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

authRouter.post("/verifyOTP", async (req, res) => {
  try {
    const email = req?.body?.email?.toLowerCase().trim();
    const userInputOtp = req?.body?.otp?.trim();

    if (!email) throw new Error("Please enter email.");
    if (!userInputOtp) throw new Error("Please enter the OTP.");

    validateEmail(email); // You forgot to pass the email here

    const otpDoc = await Otp.findOne({ email }); // You forgot to await

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "No OTP found or it may have expired.",
      });
    }

    if (otpDoc.otp === userInputOtp) {
      res.status(200).json({
        success: true,
        message: "OTP is correct",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = {
  authRouter,
};
