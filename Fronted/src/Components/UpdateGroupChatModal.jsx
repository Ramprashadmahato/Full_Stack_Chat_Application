import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import Loader from "./Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchAllMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { selectedChat, user, setSelectedChat, socket } = ChatState(); // include socket

  // Remove user
  const handleRemoveUser = async (userToBeRemoved) => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast.info("Only Admins can add/remove members");
      return;
    }
    try {
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/chats/groupremove`,
        { userId: userToBeRemoved._id, chatId: selectedChat._id },
        config
      );

      userToBeRemoved._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();

      // Emit socket event
      if (socket) socket.emit("group updated", data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Rename group
  const handleRename = async () => {
    if (!groupChatName) return;
    setRenameLoading(true);
    try {
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/chats/grouprename`,
        { chatName: groupChatName, chatId: selectedChat._id },
        config
      );
      toast.success(`Group renamed to "${data.chatName}"`);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);

      // Emit socket event
      if (socket) socket.emit("group renamed", data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  // Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${BACKEND_URL}/api/users?search=${query}`, config);
      setSearchResult(data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add member
  const handleAddMember = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.info("User already in the group");
      return;
    }
    if (user._id !== selectedChat.groupAdmin._id) {
      toast.info("Only Admins can add/remove members");
      return;
    }
    try {
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/chats/groupadd`,
        { userId: userToAdd._id, chatId: selectedChat._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);

      // Emit socket event
      if (socket) socket.emit("group updated", data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Leave group
  const handleLeaveGroup = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${BACKEND_URL}/api/chats/groupremove`, { userId: user._id, chatId: selectedChat._id }, config);
      setSelectedChat();
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setIsOpen(false);

      // Emit socket event
      if (socket) socket.emit("group updated", data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <button
        className="flex items-center justify-center p-2 rounded-full hover:bg-indigo-100 transition"
        onClick={() => setIsOpen(true)}
      >
        <IoSettingsOutline className="text-xl text-indigo-600" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-indigo-600">{selectedChat.chatName}</h2>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Group Members */}
              <div>
                <p className="font-semibold text-gray-700 mb-2">Group Members</p>
                <div className="flex flex-wrap gap-2">
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemoveUser(u)} />
                  ))}
                </div>
              </div>

              {/* Rename Group */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Group Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  className="flex-1 px-4 py-2 text-black rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleRename}
                  disabled={renameLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 transition"
                >
                  Update
                </button>
              </div>

              {/* Add Members */}
              <input
                type="text"
                placeholder="Search users to add"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {loading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader />
                </div>
              ) : (
                <div className="max-h-32 overflow-y-auto mt-2">
                  {searchResult.map((u) => (
                    <UserListItem key={u._id} user={u} handleFunction={() => handleAddMember(u)} />
                  ))}
                </div>
              )}

              {/* Danger Zone */}
              <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50">
                <p className="text-center text-red-700 font-semibold mb-2">Danger Zone</p>
                <p className="text-sm text-red-600 text-center mb-3">
                  Leaving the group will remove your access to old chats and media.
                </p>
                <button
                  onClick={handleLeaveGroup}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
