const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const {User}=require("./models/")

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(val) {},
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      // required:true,
    },
    gender: {
      type: String,
      // required:true,
      enum: ["male", "female", "other"],
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    },
    About: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ uid: user._id }, "devTinder_87jwt$#", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashedPasssword = user.password;

  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    hashedPasssword
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
