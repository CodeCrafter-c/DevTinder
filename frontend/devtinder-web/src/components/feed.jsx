import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

export const Feed = function () {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if(feed){   
        console.log('feed ',feed)
        return;
    }
    try {
      const res = await axios.get(BASE_URL + "user/feed", {
        withCredentials: true,
      });
    //   console.log((res?.data?.userToShow));
      dispatch(addFeed(res?.data?.userToShow));
    } catch (err) {}
  };

  useEffect(() => {
    getFeed();
  },[]);

  return (feed && <div className="flex justify-center my-10">
    <UserCard user={feed[0]}/>    
  </div>)
};
