const express = require("express");
const { userAuth } = require("../middlewares/auth");

const { Chat } = require("../models/chat");
const { ConnectionRequest } = require("../models/connectionRequest");

const chatRouter = express.Router();

chatRouter.get("/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req?.params;
  const user = req.user;

  try {
    const isFriend = await ConnectionRequest.findOne({
      $and: [
        { fromUserId: { $in: [targetUserId, user._id] } },
        { toUserId: { $in: [user, targetUserId] } },
        { status: "accepted" },
      ],
    });

    if (!isFriend) {
      throw new Error("You cannot chat until you both are friends");
    }

    let existingChat = await Chat.findOne({
      participants: { $all: [user._id, targetUserId] },
    }).populate("messages.senderId",'firstname lastname')
    .populate("participants",'firstname lastname photoUrl')

    if (!existingChat) {
      const chat = new Chat({
        participants: [user._id, targetUserId],
        messages: [],
      });
      existingChat = await chat.save();
    }

    res.json({
        messages:existingChat
    })

  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  chatRouter,
};
