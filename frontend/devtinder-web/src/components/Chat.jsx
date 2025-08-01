import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export default function ChatBox() {
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { targetUserId } = useParams();
  const cleanedTargetUserId = targetUserId.replace(/^:/, "");
  const loggedInUser = useSelector((store) => store.user);
  const userId = loggedInUser?._id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [otherUserDetails, setOtherUserDetails] = useState({});
  const textareaRef = useRef(null);

  const MAX_MESSAGE_LENGTH = 300;

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    socket.emit("joinChat", { cleanedTargetUserId, userId });
    socket.emit("onlineUser", userId); // Notify backend

    socket.on("newMessageReceived", ({ firstname, text, userId: senderId }) => {
      setMessages((prev) => [...prev, { _id: Date.now(), senderId, text }]);
    });

    socket.on("userOnlineStatus", ({ userId: onlineUserId, isOnline }) => {
      if (onlineUserId === cleanedTargetUserId) {
        setIsOnline(isOnline);
      }
    });

    return () => {
      socket.emit("userDisconnected", userId);
      socket.disconnect();
    };
  }, [cleanedTargetUserId, userId]);

  useEffect(() => {
    if (!userId) return; 
    fetchChatMessages();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatMessages = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}chat/${cleanedTargetUserId}`,
        {
          withCredentials: true,
        }
      );

      const otherUser = data.messages.participants.find(
        (u) => u._id !== userId
      );
      if (otherUser) {
        setOtherUserDetails({
          name: `${otherUser.firstname} ${otherUser.lastname}`,
          photoUrl: otherUser.photoUrl,
        });
      }

      const chatMessages = data.messages.messages.map((msg) => ({
        _id: msg._id,
        senderId: msg.senderId._id,
        text: msg.text,
        timeStamp: msg.createdAt,
      }));

      setMessages(chatMessages);
    } catch (err) {
      showToast("Failed to load chat");
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current.emit("sendMessage", {
      text: message,
      cleanedTargetUserId,
      userId,
      firstname: loggedInUser.firstname,
    });

    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "2.75rem";
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    if (value.length > 500) {
      showToast("You can send only up to 500 characters.");
      return;
    }

    setMessage(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "2.75rem";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.length > MAX_MESSAGE_LENGTH) {
      showToast("Message too long. Max 300 characters.");
      return;
    }
    sendMessage();
  };

  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-center z-50";
    toast.innerHTML = `<div class="alert alert-warning"><span>${msg}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-base-100 px-2">
      <div className="w-full max-w-md h-[90vh] flex flex-col border rounded-xl shadow bg-base-200">
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b bg-base-300 rounded-t-2xl">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={otherUserDetails.photoUrl || "/default-avatar.png"}
                alt="Avatar"
              />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{otherUserDetails.name}</h2>
            {isOnline && <p className="text-sm text-success">Online</p>}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${
                msg.senderId === userId ? "chat-end" : "chat-start"
              }`}
            >
              {msg.senderId !== userId && (
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={otherUserDetails.photoUrl || "/default-avatar.png"}
                    />
                  </div>
                </div>
              )}
              <div className="chat-bubble bg-white max-w-[80%] break-words">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-3 flex gap-2 border-t bg-base-300 rounded-b-2xl"
        >
          <textarea
            ref={textareaRef}
            placeholder="Type a message…"
            className="input input-bordered w-full resize-none min-h-[2.75rem] text-sm py-2 px-3"
            value={message}
            onChange={handleInput}
            rows={1}
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              overflowX: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              height: "2.75rem",
            }}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
