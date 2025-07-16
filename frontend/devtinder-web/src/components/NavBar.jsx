import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

export default function NavBar() {
  const user = useSelector((Store) => Store.user);
  const dispatch=useDispatch()
  const naviagte=useNavigate();

  const handleLogOut = async function () {
    // api call to log out the user
    try {
      const logout = await axios.post(
        BASE_URL + "auth/logout",
        {},
        { withCredentials: true }
      );
      
      // clear the redux store
      dispatch(removeUser());

      //redirect to the login page
      naviagte("/login")
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Dev Tinder
        </Link>
      </div>
      {user && (
        <div className="flex gap-2">
          <div className="dropdown dropdown-end mx-10">
            <span className="px-2 py-3 badge mx-3">
              Welcome {user.firstname}
            </span>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <Link onClick={handleLogOut}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
