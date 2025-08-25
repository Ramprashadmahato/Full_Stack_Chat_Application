import React from "react";
import { NavLink } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider"; // Make sure path is correct
import ChatImage from "../Image/ChatApp.png";
import FeaturesImage1 from "../Image/RealTime.png";
import FeaturesImage2 from "../Image/GroupChat.png";
import FeaturesImage3 from "../Image/Security.png";
import FeaturesImage4 from "../Image/Notifications.png";

const Home = () => {
  const { user } = ChatState(); // Get logged-in user from context

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Welcome Section */}
      <section className="container mx-auto flex flex-wrap justify-between items-center py-10 px-5 md:px-0">
        <div className="flex-1 min-w-[300px] mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-gray-900 pl-4 leading-snug">
            <span className="block text-yellow-400">Welcome</span>
            <span className="block text-blue-500">To Our</span>
            <span className="block text-green-500">Chat Application</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with friends and colleagues instantly. Send messages, share media, and stay
            connected with our real-time chat application.
          </p>

          {/* Buttons or User Name */}
          <div className="flex gap-4">
            {!user ? (
              <>
                <NavLink
                  to="/signup"
                  className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-700 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-transform transform hover:-translate-y-1 text-center"
                >
                  Sign Up
                </NavLink>
                <NavLink
                  to="/login"
                  className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-700 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-transform transform hover:-translate-y-1 text-center"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold">
                Welcome, {user.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[300px] flex justify-center">
          <img src={ChatImage} alt="Chat App" className="max-w-full rounded-lg" />
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center py-10 px-5 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Key Features</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          Our Chat Application is designed to provide seamless communication with real-time messaging, group chats, secure connections, and instant notifications to keep you updated.
        </p>
        {user && (
          <NavLink
            to="/chat"
            className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-700 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-transform transform hover:-translate-y-1 text-center"
          >
            Chat With Us
          </NavLink>
        )}

        {/* Feature Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {[FeaturesImage1, FeaturesImage2, FeaturesImage3, FeaturesImage4].map((img, idx) => {
            const titles = ["Real-time Messaging", "Group Chat", "Secure Chats", "Instant Notifications"];
            const descs = [
              "Send and receive messages instantly without delay.",
              "Create groups and chat with multiple friends or colleagues.",
              "End-to-end encryption to keep your conversations safe.",
              "Get real-time alerts for messages and updates.",
            ];
            return (
              <div key={idx} className="w-48 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-2 transition-transform">
                <img src={img} alt={titles[idx]} className="w-full h-36 object-cover rounded-t-lg" />
                <h3 className="text-lg font-semibold mt-3">{titles[idx]}</h3>
                <p className="text-gray-600 p-3 text-sm">{descs[idx]}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
