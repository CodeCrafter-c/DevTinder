import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

export default function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [login, setLogin] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async function () {
    try {
      const res = await axios.post(
        BASE_URL + "auth/login",
        {
          email: emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
      console.error(err);
    }
  };

  const toggle = () => {
    setLogin(!login);
  };

  const handleSingUp = async function () {
    try {
      const res = await axios.post(
        BASE_URL + "auth/signup",
        { firstname, lastname, password, email: emailId },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {}
  };

  return (
    <div className="flex justify-center px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="card bg-base-200 w-full max-w-sm shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {login ? "Login" : "Sign up"}
          </h2>
          <div>
            {!login && (
              <div className="form-control w-full my-2">
                <label className="label" htmlFor="firstname">
                  <span className="label-text mb-1.5">Firstname</span>
                </label>
                <input
                  id="firstname"
                  type="text"
                  className="input input-bordered w-full"
                  value={firstname}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              </div>
            )}

            {!login && (
              <div className="form-control w-full my-2">
                <label className="label" htmlFor="lastname">
                  <span className="label-text mb-1.5">Lastname</span>
                </label>
                <input
                  id="lastname"
                  type="text"
                  className="input input-bordered w-full"
                  value={lastname}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </div>
            )}

            <div className="form-control w-full my-2">
              <label className="label" htmlFor="email">
                <span className="label-text mb-1.5">Email ID</span>
              </label>
              <input
                id="email"
                type="text"
                className="input input-bordered w-full"
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
              />
            </div>

            <div className="form-control w-full my-2">
              <label className="label" htmlFor="password">
                <span className="label-text mb-1.5">Password</span>
              </label>
              <input
                id="password"
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="card-actions justify-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                login ? handleLogin() : handleSingUp();
              }}
            >
              {login ? "Login" : "Sign up"}
            </button>
          </div>
          <p className="text-center mt-2 cursor-pointer" onClick={toggle}>
            {login
              ? "Don't have an account? Create one"
              : "Already have an account? Log in"}
          </p>
        </div>
      </div>
    </div>
  );
}
