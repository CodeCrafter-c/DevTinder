import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import ImageCropper from "./ImageCropper";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

export default function EditProfile({ user }) {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [About, setAbout] = useState(user.About);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);

  const [photo, setPhoto] = useState(null); // final cropped file
  const [preview, setPreview] = useState(null); // preview of cropped image
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl); // saved image URL

  const [cropImage, setCropImage] = useState(null); // raw file for cropper
  const [showCropper, setShowCropper] = useState(false);

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const saveMyProfile = async function () {
    setError("");
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("age", age);
      formData.append("About", About);
      formData.append("gender", gender);
      if (photo) formData.append("photo", photo);

      const res = await axios.patch(BASE_URL + "profile/edit", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addUser(res?.data?.data));
      setPhotoUrl(res?.data?.data?.photoUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCropImage(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row gap-8 justify-center items-start px-4 sm:px-6 md:px-10">
        <div className="w-full md:max-w-sm">
          <UserCard
            user={{
              firstname,
              lastname,
              age,
              gender,
              About,
              photoUrl: preview || photoUrl,
            }}
          />
        </div>

        <div className="w-full max-w-md">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>

              <div className="form-control w-full my-2">
                <label className="label">
                  <span className="label-text mb-1.5">Profile Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full bg-base-100"
                  onChange={handleFileChange}
                />
              </div>

              <div className="form-control w-full mt-2">
                <label className="label" htmlFor="firstname">
                  <span className="label-text mb-1.5">Firstname</span>
                </label>
                <input
                  id="firstname"
                  type="text"
                  className="input input-bordered w-full bg-base-100"
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
                  className="input input-bordered w-full bg-base-100"
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
                  className="input input-bordered w-full bg-base-100"
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
                  className="textarea textarea-bordered w-full bg-base-100"
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="card-actions justify-center mt-4">
                <button
                  className="btn btn-primary w-full sm:w-auto"
                  onClick={saveMyProfile}
                >
                  Save
                </button>
              </div>

              {showToast && (
                <div className="toast toast-top toast-center">
                  <div className="alert alert-success">
                    <span>Profile saved successfully.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🪄 Image Cropper Modal */}
      <ImageCropper
        imageSrc={cropImage}
        visible={showCropper}
        onClose={() => setShowCropper(false)}
        onCropComplete={(file) => {
          setPhoto(file);
          setPreview(URL.createObjectURL(file));
        }}
      />
    </>
  );
}
