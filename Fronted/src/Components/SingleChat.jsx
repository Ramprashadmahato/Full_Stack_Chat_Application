import React, { useState, useEffect, useRef } from "react";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Loader from "./Loader";
import ScrollableChat from "./ScrollableChat";
import { IoIosArrowBack } from "react-icons/io";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://full-stack-chat-application-tbwc.onrender.com/";
const SOCKET_URL = BACKEND_URL; // Your Socket.IO server URL

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const socket = useRef();
  const [socketConnected, setSocketConnected] = useState(false);

  // Fetch all messages
  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error("Failed to load messages");
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      toast.error(err.message || "Failed to load messages");
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const messageContent = newMessage;
    setNewMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId: selectedChat._id, content: messageContent }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();

      setMessages([...messages, data]);
      socket.current.emit("new message", data); // Emit new message to socket
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    }
  };

  // Initialize Socket.IO
  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));

    // Listen for incoming messages
    socket.current.on("message received", (newMsg) => {
      if (!selectedChat || selectedChat._id !== newMsg.chat._id) return;
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, selectedChat]);

  // Fetch messages whenever chat changes
  useEffect(() => {
    fetchAllMessages();
    if (selectedChat) socket.current.emit("join chat", selectedChat._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">Chat with us</h1>
        <hr className="border-indigo-300 w-1/2 mb-4" />
        <p className="text-2xl md:text-3xl text-center text-gray-700 px-4">
          Select a user or group to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-t-lg shadow-md">
        <div className="flex items-center gap-3">
          <div
            className="md:hidden cursor-pointer hover:bg-indigo-500 p-2 rounded"
            onClick={() => setSelectedChat(null)}
          >
            <IoIosArrowBack className="text-2xl" />
          </div>

          {!selectedChat.isGroupChat ? (
            <>
              <span className="text-xl font-semibold">
                {getSender(user, selectedChat.users).name}
              </span>
              <ProfileModel user={getSender(user, selectedChat.users)} />
            </>
          ) : (
            <>
              <span className="uppercase font-semibold text-lg">{selectedChat.chatName}</span>
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchAllMessages={fetchAllMessages}
              />
            </>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? <Loader /> : <ScrollableChat messages={messages} />}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 bg-white rounded-b-lg shadow-inner gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
