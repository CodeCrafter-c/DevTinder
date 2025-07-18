import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

export default function EditProfile({ user }) {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [About, setAbout] = useState(user.About);
  const [age, setAge] = useState(user.age);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [gender, setGender] = useState(user.gender);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  // if(age===undefined){
  //   setAge(null);
  // }

  const saveMyProfile = async function () {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "profile/edit",
        { firstname, lastname, age, About, gender },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      const i=setTimeout(()=>{
        setShowToast(false);
      },2000)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-8 justify-center items-start px-4 sm:px-6 md:px-10">
      <div className="w-full md:max-w-sm">
        <UserCard
          user={{ firstname, lastname, age, gender, About, photoUrl }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>

            <div className="form-control w-full mt-2">
              <label className="label" htmlFor="firstname">
                <span className="label-text mb-1.5">Firstname</span>
              </label>
              <input
                id="firstname"
                type="text"
                className="input input-bordered w-full"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            <div className="form-control w-full my-2">
              <label className="label" htmlFor="lastname">
                <span className="label-text mb-1.5">Lastname</span>
              </label>
              <input
                id="lastname"
                type="text"
                className="input input-bordered w-full"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            <div className="form-control w-full my-2">
              <label className="label" htmlFor="age">
                <span className="label-text mb-1.5">Age</span>
              </label>
              <input
                id="age"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input input-bordered w-full"
                value={age}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setAge(e.target.value);
                  }
                }}
              />
            </div>

            <div className="form-control w-full my-2">
              <label className="label" htmlFor="about">
                <span className="label-text mb-1.5">About</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                id="about"
                value={About}
                onChange={(e) => setAbout(e.target.value)}
              ></textarea>
            </div>

            <div className="form-control w-full my-2">
              <label className="label">
                <span className="label-text mb-1.5">Gender</span>
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["male", "female", "other"].map((option) => (
                  <label key={option} className="label cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      className="radio"
                      checked={gender === option}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="label-text ml-2 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p>{error}</p>}

            <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={saveMyProfile}
              >
                Save
              </button>
            </div>
            {showToast &&
            <div className="toast toast-top toast-center">
              <div className="alert alert-success">
                <span>Profile saved successfully.</span>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
