import React, { useState, useEffect, useRef } from "react";
import ProfileModel from "./ProfileModel";
import UserListItem from "./UserListItem";
import Loader from "./Loader";
import { IoSearch, IoNotificationsSharp, IoCaretDown } from "react-icons/io5";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import NotificationBadge, { Effect } from "react-notification-badge";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://full-stack-chat-application-tbwc.onrender.com/";

const SideDrawer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

  const dropdownRef = useRef();
  const notifRef = useRef();

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const logoutHandler = () => {
    localStorage.removeItem("deLinkUser");
    navigate("/");
  };

  // Search users
  const handleSearch = async () => {
    if (!search) return toast.info("Please enter a name or email");
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get(`${BACKEND_URL}/api/users?search=${search}`, config);

      // Add fallback for missing/broken images
      const users = (data.users || []).map((u) => ({
        ...u,
        image: u.image || "/default-avatar.png",
      }));

      setSearchResult(users);

      if (users.length === 0) toast.info("No users found");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Access or create chat
  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.post(`${BACKEND_URL}/api/chats`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setDrawerOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error accessing chat");
    } finally {
      setLoadingChat(false);
    }
  };

  // Notifications
  const removeNotification = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.delete(`${BACKEND_URL}/api/notification/${id}`, config);
      setNotification(notification.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error removing notification");
    }
  };

  const getPrevNotification = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get(`${BACKEND_URL}/api/notification`, config);
      setNotification(data ?? []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching notifications");
    }
  };

  useEffect(() => {
    if (user) getPrevNotification();
  }, [user]);

  if (!user) return null;

  return (
    <>
      {/* Navbar */}
      <div className="flex justify-between items-center w-full p-3 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 shadow-lg text-white">
        {/* Search */}
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition"
          onClick={() => setDrawerOpen(true)}
        >
          <IoSearch className="text-xl" />
          <span className="hidden md:inline px-2 font-medium">Search User</span>
        </button>

        <h1 className="text-3xl font-bold tracking-widest drop-shadow-md">Chat Application</h1>

        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <div className="cursor-pointer" onClick={() => setNotifOpen(!notifOpen)}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <IoNotificationsSharp className="text-2xl" />
            </div>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 max-h-60 overflow-y-auto bg-white shadow-lg rounded-lg z-50 animate-fadeIn">
                {notification.length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">No Notification</div>
                ) : (
                  notification.map((notify) => (
                    <div
                      key={notify._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex flex-col"
                      onClick={() => {
                        removeNotification(notify._id);
                        setSelectedChat(notify.chatId);
                        setNotifOpen(false);
                      }}
                    >
                      {notify.chatId?.isGroupChat
                        ? `New Message in ${notify.chatId.chatName}`
                        : `New Message from ${notify.sender?.name}`}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/20 transition"
            >
              <img
                src={user?.image || "/default-avatar.png"}
                alt={user?.name || "User"}
                onError={(e) => (e.target.src = "/default-avatar.png")}
                className="h-8 w-8 rounded-full object-cover border-2 border-white"
              />

              <IoCaretDown />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg overflow-hidden z-50 animate-fadeIn">
                <ProfileModel user={user}>
                  <div className="p-3 hover:bg-gray-500 cursor-pointer font-medium text-black">My Profile</div>
                </ProfileModel>
                <div className="border-t"></div>
                <div
                  className="p-3 hover:bg-gray-500 cursor-pointer font-medium text-black"
                  onClick={logoutHandler}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
          <div className="bg-white w-96 p-4 overflow-auto relative shadow-xl rounded-r-2xl animate-slideInRight">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Search Users</h2>
            <div className="flex mb-3">
              <input
                type="text"
                placeholder="Search by name or email"
                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
                onClick={handleSearch}
              >
                <IoSearch className="text-xl" />
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : (
              searchResult.map((u) => (
                <UserListItem
                  key={u._id}
                  user={{ ...u, image: u.image || "/default-avatar.png" }}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}
            {loadingChat && <Loader />}
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;
