import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { SkeletonCard } from "./SkeletonCard"; // 👈 Import skeleton
import { Link } from "react-router-dom";

export default function Connections() {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getConnections = async () => {
    if (connections) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-4 bg-base-300 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-brown-400 underline underline-offset-4">
        Your Connections
      </h1>

      {/* Skeleton loader */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !connections || connections.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          You have no connections yet.
        </div>
      ) : (
        <div className="space-y-6">
          {connections.map((conn) => (
            <div
              key={conn._id}
              className="group bg-white p-5 rounded-xl shadow-md transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              {/* Profile Info */}
              <div className="flex gap-4 items-start sm:items-center w-full min-w-0">
                <img
                  src={conn.photoUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border border-gray-300 flex-shrink-0"
                />

                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {conn.firstname} {conn.lastname || ""}
                  </h2>

                  <p className="text-[12px] sm:text-sm text-gray-600 mt-1 truncate">
                    {conn.About || "No bio available"}
                  </p>
                </div>
              </div>

              {/* Hover Buttons */}
              <div className="hidden group-hover:flex gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                <Link to={'/chat/'+conn._id}><button className="btn btn-xs btn-accent text-white">Message</button></Link>
                <button className="btn btn-xs btn-outline btn-error">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
