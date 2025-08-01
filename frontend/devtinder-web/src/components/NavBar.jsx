import axios from "axios";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearFeed } from "../utils/feedSlice";
import { clearRequest } from "../utils/requestStore";

export default function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatarRef = useRef(null);

  const handleLogOut = async () => {
    try {
      await axios.post(BASE_URL + "auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeConnections());
      dispatch(clearRequest());
      dispatch(clearFeed());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // 👇 Utility to close dropdown
  const closeDropdown = () => {
    if (avatarRef.current) avatarRef.current.blur();
  };

  return (
    <div className="navbar bg-base-300 shadow-sm px-4 sm:px-6">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Dev Tinder</Link>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="badge badge-outline px-2 truncate max-w-[100px] sm:max-w-none">
            Welcome {user.firstname}
          </span>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              ref={avatarRef}
              role="button"
              onClick={() => avatarRef.current?.focus()}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full overflow-hidden">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" onClick={closeDropdown}>Profile</Link>
              </li>
              <li>
                <Link to="/connections" onClick={closeDropdown}>Connections</Link>
              </li>
              <li>
                <Link to="/requests" onClick={closeDropdown}>Requests</Link>
              </li>
              <li>
                <button onClick={() => { closeDropdown(); handleLogOut(); }}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
