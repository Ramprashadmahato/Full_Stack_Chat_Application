import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatProvider from "../Context/ChatProvider";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Chat from "./Components/ChatPage";
import PageNotFound from "./Components/PageNotFound";

export default function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
             <Route path="/chat" element={<Chat />} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ChatProvider>
  );
}
