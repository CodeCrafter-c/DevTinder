  const socket = require("socket.io");
  const { Chat } = require("../models/chat");

  const onlineUsers = new Map(); // userId -> socket.id

  const intializeScoket = (server) => {
    const io = socket(server, {
      cors: {
        origin: "http://localhost:5173", // frontend origin
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
//      console.log("A user connected:", socket.id);

      socket.on("onlineUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("userOnlineStatus", { userId, isOnline: true });
      });

      socket.on("joinChat", ({ userId, cleanedTargetUserId }) => {
        const roomId = [userId, cleanedTargetUserId].sort().join("_");
        socket.join(roomId);
      });

      socket.on(
        "sendMessage",
        async ({ text, firstname, cleanedTargetUserId, userId }) => {
          const roomId = [userId, cleanedTargetUserId].sort().join("_");

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
            console.error("Message save error:", err);
          }

          io.to(roomId).emit("newMessageReceived", {
            firstname,
            text,
            userId,
            cleanedTargetUserId,
            timeStamps: Date.now(),
          });
        }
      );

      socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            io.emit("userOnlineStatus", { userId, isOnline: false });
            break;
          }
        }

  //      console.log("User disconnected:", socket.id);
      });
    });
  };

  module.exports = {
    intializeScoket,
  };
