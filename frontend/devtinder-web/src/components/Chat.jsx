 import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export default function ChatBox() {

  const messagesEndRef = useRef(null);

  const { targetUserId } = useParams();
  const cleanedTargetUserId = targetUserId.replace(/^:/, "");
  const loggedInUser = useSelector((store) => store.user);
  const userId = loggedInUser?._id;
  const [otherUserDetails, setOtherUserDetails] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);
  const MAX_MESSAGE_LENGTH = 300;

const fetchChatMessages = async () => {
  try {
    const chat = await axios.get(BASE_URL + "chat/" + cleanedTargetUserId, {
      withCredentials: true,
    });

    if (!chat?.data?.messages) {
      return showToast("Unable to load chat");
    }

    const chatData = chat.data.messages;
    const participants = chatData.participants;

    // Get the other user's details (not the logged-in user)
    const otherUser = participants.find((user) => user._id !== userId);
    if (otherUser) {
      const firstname = otherUser.firstname || "";
      const lastname = otherUser.lastname || "";
      setOtherUserDetails({name:firstname+' '+lastname , photoUrl:otherUser.photoUrl});
    }

    const messages = chatData.messages;
    if (!messages.length) return;

    const chatMessages = messages.map((msg) => ({
      firstname: msg?.senderId?.firstname,
      lastname: msg?.senderId?.lastname || "",
      text: msg.text,
      timeStamp: msg.createdAt,
      _id: msg._id,
      senderId: msg.senderId._id,
    }));

    setMessages(chatMessages);
  } catch (err) {
    console.error(err);
    showToast("Something went wrong while loading chat");
  }
};

  // Default messages when userId becomes available
  useEffect(() => {
    if (!userId) return;
    fetchChatMessages();
    // setMessages([
    //   { _id: 1, senderId: userId, text: "Hey 👋" },
    //   { _id: 2, senderId: cleanedTargetUserId, text: "Hi! What's up?" },
    //   { _id: 3, senderId: userId, text: "Want to collab on something cool?" },
    //   {
    //     _id: 4,
    //     senderId: cleanedTargetUserId,
    //     text: "Sounds good! Share the idea. Also thiswordisreallyreallyreallylongandshouldnotoverflow",
    //   },
    // ]);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { cleanedTargetUserId, userId });

    socket.on("newMessageReceived", ({ firstname, text, userId: senderId }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: prev.length + 1,
          senderId,
          text,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [cleanedTargetUserId, userId]);

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      text: message,
      cleanedTargetUserId,
      userId,
      firstname: loggedInUser.firstname,
    });
  };


  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-center z-50";
    toast.innerHTML = `
      <div class="alert alert-warning">
        <span>${msg}</span>
      </div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.length > MAX_MESSAGE_LENGTH) {
      showToast("Message too long. Maximum 300 characters allowed.");
      return;
    }

    sendMessage();
    setMessage("");

    // Reset height of textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "2.75rem"; // default input height
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
      textareaRef.current.style.height = "2.75rem"; // reset first
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  };



  
return (
    <div className="w-full min-h-screen flex justify-center items-center bg-base-100 px-2">
      <div className="w-full max-w-md h-[90vh] flex flex-col border rounded-xl shadow bg-base-200">
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b bg-base-300 rounded-t-2xl">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={otherUserDetails.photoUrl}
                alt="Avatar"
              />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{otherUserDetails.name}</h2>
            <p className="text-sm text-success">Online</p>
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
                      src={otherUserDetails.photoUrl}
                      alt="User Avatar"
                    />
                  </div>
                </div>
              )}
              <div className="chat-bubble bg-white max-w-[80%] break-words">
                {msg.text}
              </div>
            </div>
          ))}

          {/* 👇 This div scrolls into view on new messages */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          className="p-3 flex gap-2 border-t bg-base-300 rounded-b-2xl"
          onSubmit={handleSubmit}
        >
          <textarea
            ref={textareaRef}
            placeholder="Type a message…"
            className="input input-bordered w-full resize-none min-h-[2.75rem] text-sm py-2 px-3"
            value={message}
            rows={1}
            onChange={handleInput}
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
