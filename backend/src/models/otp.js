const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 180 // TTL index to expire document after 3 mins
  }
});

const Otp = mongoose.model("Otp",otpSchema);

module.exports={
    Otp
}