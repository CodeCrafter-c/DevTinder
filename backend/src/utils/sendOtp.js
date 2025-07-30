
const nodemailer = require("nodemailer");

const sendOtp = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,       
        pass: process.env.GMAIL_APP_PASS,   
      },
    });

    const mailOptions = {
      from: `DevTinder <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your OTP for DevTinder",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

module.exports = sendOtp;
