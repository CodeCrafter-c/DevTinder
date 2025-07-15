import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";


export default function Login() {
  const [emailId, setEmailId] = useState("kanav2005@gmail.com");
  const [password, setPassword] = useState("kanav@123");
  const dispatch=useDispatch();
  const navigate=useNavigate()

  const handleLogin = async function () {
    try {
      const res = await axios.post(
        BASE_URL+"auth/login",
        {
          email: emailId,
          password,
        },
        { withCredentials: true }
      );
      
      dispatch(addUser(res.data));
      return navigate("/")
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="flex justify-center my-20">
      <div className="card bg-base-200 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div>
            <div className="form-control w-full max-w-xs my-2">
              <label className="label" htmlFor="email">
                <span className="label-text mb-1.5">Email ID</span>
              </label>
              <input
                id="email"
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
              />
            </div>

            <div className="form-control w-full max-w-xs my-2">
              <label className="label" htmlFor="password">
                <span className="label-text mb-1.5">Password</span>
              </label>
              <input
                id="password"
                type="password"
                className="input input-bordered w-full max-w-xs"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="card-actions justify-center mt-3">
            <button className="btn btn-primary" onClick={handleLogin}>
              login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
