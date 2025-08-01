const express = require("express");

// auth middleqware
const { userAuth } = require("../middlewares/auth");

// models
const { User } = require("../models/user");
const { ConnectionRequest } = require("../models/connectionRequest");
const { requestRouter } = require("./request");

// Router
const userRouter = express.Router();

userRouter.get("/requests", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intersted",
    }).populate("fromUserId", ["firstname", "lastname", "About", "photoUrl"]);

    if (requests.length == 0) {
      return res.status(200).json({
        message: "You are all caught up.",
        data: [],
      });
    }

    res.json({
      data: requests,
    });
  } catch (err) {
    res.json({
      error: `${err.message}`,
    });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  // console.log(loggedInUser)
  try {
    const allConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstname lastname About photoUrl")
      .populate("toUserId", "firstname lastname About photoUrl");
    // console.log(allConnections);

    if (!allConnections.length) {
      return res.json({
        message: "no Connections Yet.",
        data: [],
      });
    }
    // console.log("all:- ", allConnections);
    const data = allConnections
      .filter((row) => row.fromUserId && row.toUserId) // filter out broken references
      .map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId;
      });

    // console.log(data);
    res.json({
      message: "Connections found",
      data: data,
    });
  } catch (err) {
    res.json({
      error: `${err.stack}`,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const MAX_LIMIT = 50;
  const DEFAULT_LIMIT = 10;
  const DEFAULT_PAGE = 1;

  const page = parseInt(req.query.page) || DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  if (page < 1) {
    page = DEFAULT_PAGE;
  }

  const skip = (page - 1) * limit;
  try {
    const loggedInUser = req.user;
    const otherUsers = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
          status: { $ne: "intersted" },
        },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    otherUsers.forEach((user) => {
      if (user.fromUserId.toString() === loggedInUser._id.toString()) {
        hideUserFromFeed.add(user.toUserId.toString());
      } else {
        hideUserFromFeed.add(user.fromUserId.toString());
      }
    });

    // console.log(hideUserFromFeed);

    // feed users
    const userToShow = await User.find({
      $and: [
        {
          _id: { $nin: [...hideUserFromFeed] },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select("firstname lastname photoUrl skills About age gender")
      .skip(skip)
      .limit(limit);

    // console.log(userToShow)

    res.json({
      userToShow,
    });
  } catch (err) {
    res.json({
      error: `${err.message}`,
    });
  }
});

module.exports = {
  userRouter,
};
