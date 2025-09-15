// /Context/ChatProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// Create context
const ChatContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://full-stack-chat-application-tbwc.onrender.com/";

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Load user info from localStorage & protect routes
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("deLinkUser"));
    setUser(userInfo);

    const publicPaths = ["/", "/login", "/signup"];
    if (!userInfo && !publicPaths.includes(location.pathname)) {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  // Initialize Socket.IO when user logs in
  useEffect(() => {
    if (user) {
      const newSocket = io(BACKEND_URL);
      setSocket(newSocket);

      newSocket.emit("setup", user); // send user info to backend

      // Listen for group updates
      newSocket.on("group updated", (updatedChat) => {
        setChats((prevChats) =>
          prevChats.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat))
        );

        if (selectedChat?._id === updatedChat._id) {
          setSelectedChat(updatedChat);
        }
      });

      // Cleanup socket on logout/unmount
      return () => newSocket.disconnect();
    }
  }, [user, selectedChat]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        socket,
      }}
    >
      <div className="min-h-screen bg-gray-100 text-gray-900">{children}</div>
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
