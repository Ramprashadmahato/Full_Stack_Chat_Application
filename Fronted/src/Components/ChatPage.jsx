import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../Components/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Side Drawer */}
      {user && <SideDrawer />}

      {/* Chat Area */}
      <div className="flex flex-1 justify-between w-full h-[91vh] p-3 gap-4">
        {/* My Chats Panel */}
        {user && (
          <div className="hidden md:flex md:w-[32%] flex-col bg-white rounded-2xl shadow-lg p-3 overflow-hidden">
            <MyChats fetchAgain={fetchAgain} />
          </div>
        )}

        {/* Chat Box Panel */}
        {user && (
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-3 flex flex-col overflow-hidden">
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ChatPage;
