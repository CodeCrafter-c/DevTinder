import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import Skeleton from "./Skeleton"; // if loading skeleton needed

export const Feed = function () {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);

  const getFeed = async () => {
    if (feed) {
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.userToShow));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleNextUser = (actionType, userId) => {
    setAnimate(true);
    setTimeout(() => {
      dispatch(removeUserFromFeed(userId));
      setAnimate(false);
    }, 300); // transition duration
  };

  if (loading) return <Skeleton />;

  if (!feed || feed.length === 0) {
    return <p className="text-center my-10 text-gray-500">No users to show</p>;
  }

  return (
    <div className="flex justify-center my-10 transition-all duration-300">
      <div className={animate ? "opacity-0 scale-95 transition-all duration-300" : "opacity-100 scale-100 transition-all duration-300"}>
        <UserCard user={feed[0]} onAction={handleNextUser} />
      </div>
    </div>
  );
};
