import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";

export default function UserCard({ user, onAction }) {
  const { firstname, lastname, About, age, gender, photoUrl, _id } = user;

  const handleSendRequest = async (status, id) => {
    try {
      await axios.post(BASE_URL + "request/send/" + status + "/" + id, {}, { withCredentials: true });
      onAction(status, id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm bg-base-300 mx-auto shadow-md rounded-xl overflow-hidden transition-transform duration-300 ease-in-out">
      <figure className="w-full p-4">
        <img
          src={photoUrl}
          alt="User"
          className="w-full h-auto max-h-72 object-contain rounded-lg"
        />
      </figure>
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold">{firstname + " " + lastname}</h2>
        {age && gender && (
          <p className="text-sm text-gray-600">{age + " • " + gender}</p>
        )}
        {About && <p className="text-sm mt-2">{About}</p>}
        <div className="flex justify-center gap-3 mt-4">
          <button
            className="btn btn-accent btn-sm sm:btn-md"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-primary btn-sm sm:btn-md"
            onClick={() => handleSendRequest("intersted", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}

