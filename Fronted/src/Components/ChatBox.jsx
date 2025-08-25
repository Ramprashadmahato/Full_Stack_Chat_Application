import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`
        ${selectedChat ? "flex" : "hidden"} 
        md:flex flex-col
        w-full md:w-[68%] max-h-screen md:max-h-[90vh]
        bg-gradient-to-b from-white/90 to-gray-100
        rounded-2xl border border-gray-300 shadow-lg
        p-3 transition-all duration-300
      `}
    >
      <div className="flex-1 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default ChatBox;
