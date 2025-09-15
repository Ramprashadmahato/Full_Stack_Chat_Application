import React, { useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../../Context/ChatProvider";
import { IoIosArrowForward } from "react-icons/io";
import UserListItem from "./UserListItem";
import Loader from "./Loader";
import UserBadgeItem from "./UserBadgeItem";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { user, chats, setChats, socket } = ChatState(); // include socket

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return setSearchResult([]);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users?search=${query}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      const users = (data.users || []).map((u) => ({ ...u, image: u.image || "/default-avatar.png" }));
      setSearchResult(users);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (u) => {
    if (selectedUser.find((sel) => sel._id === u._id)) {
      toast.info("User already added to the group");
      return;
    }
    setSelectedUser([...selectedUser, u]);
  };

  const handleRemoveUser = (u) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== u._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUser.length === 0) {
      toast.info("Please fill in all required fields");
      return;
    }
    if (selectedUser.length < 2) {
      toast.info("Group must have at least 3 members (including you)");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/chats/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        }),
      });
      const data = await res.json();
      setChats([data, ...chats]);
      toast.success(`Group "${groupChatName}" created successfully!`);

      // Emit socket event for real-time update
      if (socket) socket.emit("new group created", data);

      // Reset modal
      setIsOpen(false);
      setSelectedUser([]);
      setGroupChatName("");
      setSearch("");
      setSearchResult([]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create group");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold w-full text-center">Create Group Chat</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter Group Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Add members to group"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Selected users */}
              <div className="flex flex-wrap gap-2">
                {selectedUser.map((u) => (
                  <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemoveUser(u)} />
                ))}
              </div>

              {/* Search results */}
              <div className="mt-2 h-40 overflow-y-auto border rounded-lg p-2">
                {loading ? (
                  <Loader />
                ) : (
                  searchResult?.slice(0, 4).map((u) => (
                    <UserListItem
                      key={u._id}
                      user={{ ...u, image: u.image || "/default-avatar.png" }}
                      handleFunction={() => handleSelectUser(u)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center p-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
              >
                {submitLoading ? "Creating..." : "Create"} <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
