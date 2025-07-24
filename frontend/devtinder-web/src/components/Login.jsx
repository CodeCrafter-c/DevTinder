import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login= () => {
  const [mode, setMode] = useState("signup");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Common states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Resend OTP timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!firstName || !email || !password) {
      toast.error("Except lastname all the fields are mandatory ");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}auth/OTP`, { email });
      toast.success("OTP sent to your email");
      setShowOtpInput(true);
      setResendTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP to verify");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}auth/verifyOTP`, { email, otp });
      toast.success("OTP Verified");
      setIsOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isOtpVerified) {
      toast.error("Please verify OTP first");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}auth/signup`, {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
      },{withCredentials:true});
      toast.success("Signup successful");
      setMode("login");
      setShowOtpInput(false);
      setIsOtpVerified(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setOtp("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}auth/login`, { email, password },{withCredentials:true});
      toast.success("Login successful");
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <Toaster position="top-center" />
      <div className="bg-base-100 shadow-xl p-6 w-full max-w-md rounded-xl">
        <div className="tabs tabs-boxed mb-4">
          <button
            className={`tab ${mode === "signup" ? "tab-active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
          <button
            className={`tab ${mode === "login" ? "tab-active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
        </div>

        {mode === "signup" ? (
          <>
            {!showOtpInput && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered w-full mb-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered w-full mb-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full mb-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-primary w-full"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            )}

            {showOtpInput && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="input input-bordered w-full mb-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className="btn btn-success w-full mb-2"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <button
                  className="btn btn-outline w-full mb-2"
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>

                <button
                  className="btn btn-primary w-full"
                  onClick={handleSignup}
                  disabled={!isOtpVerified || loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn-primary w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
