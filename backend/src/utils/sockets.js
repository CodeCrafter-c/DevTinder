const socket = require("socket.io");
const { Chat } = require("../models/chat");

const intializeScoket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, cleanedTargetUserId }) => {
      // console.log("id ",cleanTargetUserId);
      const roomId = [userId, cleanedTargetUserId].sort().join("_");
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ text, firstname, cleanedTargetUserId, userId }) => {
        // console.log(text);
        const roomId = [userId, cleanedTargetUserId].sort().join("_");

        // save messages to the databases

          try {
            let chat = await Chat.findOne({
              participants: { $all: [userId, cleanedTargetUserId] },
            });

            if (!chat) {
              chat = new Chat({
                participants: [userId, cleanedTargetUserId],
                messages: [],
              });
            }

            chat.messages.push({
              senderId: userId,
              text,
            });

            await chat.save();
          } catch (err) {
            console.log(err);
          }


        io.to(roomId).emit("newMessageReceived", {
          firstname,
          text,
          userId,
          cleanedTargetUserId,
          timeStamps:Date.now()
        });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = {
  intializeScoket,
};
