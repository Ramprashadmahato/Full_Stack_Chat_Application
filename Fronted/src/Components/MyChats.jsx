import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { IoMdAdd, IoMdPeople } from "react-icons/io";
import Loader from "./Loader";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    if (!user) return; // safety check
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/chats`, config);
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("deLinkUser"));
    setLoggedUser(storedUser);
    fetchChats();
  }, [fetchAgain, user]);

  if (!loggedUser) return <Loader />;

  return (
  <div
    className={`${
      selectedChat ? "hidden" : "flex"
    } md:flex flex-col items-center p-4 h-[90vh] w-full md:w-[36%] lg:w-[70%] rounded-2xl bg-gradient-to-b from-white/90 to-gray-100 shadow-xl transition-all duration-300`}
  >
    {/* Header */}
    <div className="flex w-full justify-between items-center pb-4 px-4 md:px-6 text-lg md:text-xl border-b border-gray-300">
      <span className="font-bold text-gray-800 text-lg md:text-xl">My Chats</span>
      <GroupChatModal>
        <button className="flex items-center text-white text-sm md:text-[0.95rem] lg:text-sm bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 px-4 py-2 rounded-lg hover:scale-105 transition transform shadow-lg">
          <IoMdAdd className="mr-2" />
          Create Group
        </button>
      </GroupChatModal>
    </div>

    {/* Chats List */}
    <div className="flex flex-col p-3 bg-gray-50 w-full h-full rounded-xl mt-3 overflow-hidden shadow-inner">
      {Array.isArray(chats) && chats.length > 0 ? (
        <div className="flex flex-col overflow-y-scroll space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {chats.map((chat) => (
            <div key={chat._id}>
              <div
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedChat === chat
                    ? "bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
              >
                {/* Avatar */}
                {chat.isGroupChat ? (
                  <div className="flex items-center justify-center bg-purple-600 text-white rounded-full h-10 w-10 mr-4 shadow-inner">
                    <IoMdPeople size={22} />
                  </div>
                ) : (
                  <img
                    src={getSender(loggedUser.user, chat.users)?.image}
                    alt={getSender(loggedUser.user, chat.users)?.name}
                    className="rounded-full h-10 w-10 mr-4 object-cover shadow-sm"
                  />
                )}
                <span className="text-base md:text-lg font-medium">
                  {!chat.isGroupChat
                    ? getSender(loggedUser.user, chat.users)?.name
                    : chat.chatName}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  </div>
);
}

export default MyChats;
