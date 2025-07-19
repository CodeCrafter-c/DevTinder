import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestStore";
import { SkeletonCard } from "./SkeletonCard"; // Adjust path if needed
import { Tuple } from "@reduxjs/toolkit";

export default function Request() {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // loading state

  const getRequests = async () => {
    if (requests) return setLoading(false); // already present
    try {
      const res = await axios.get(BASE_URL + "user/requests", {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching connections", err);
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, id) => {
    try {
      const res = await  axios.post(
        BASE_URL + "request/review/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(id))
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-4 bg-base-300 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-brown-400 underline underline-offset-4">
        Requests
      </h1>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          You have no requests.
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req.fromUserId._id}
              className="group bg-white p-5 rounded-xl shadow-md transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              {/* Profile Info */}
              <div className="flex gap-4 items-start sm:items-center w-full min-w-0">
                <img
                  src={req.fromUserId.photoUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border border-gray-300 flex-shrink-0"
                />

                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {req.fromUserId.firstname} {req.fromUserId.lastname || ""}
                  </h2>

                  <p className="text-[12px] sm:text-sm text-gray-600 mt-1 truncate">
                    {req.fromUserId.About || "No bio available"}
                  </p>
                </div>
              </div>

              {/* Hover Buttons */}
              <div className="hidden group-hover:flex gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                <button className="btn btn-xs btn-success" onClick={(e) => {reviewRequest("accepted",req.fromUserId._id)}}>
                  Accept
                </button>
                <button
                  className="btn btn-xs btn-outline btn-error"
                  onClick={(e) => {reviewRequest("rejected",req.fromUserId._id)}}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
