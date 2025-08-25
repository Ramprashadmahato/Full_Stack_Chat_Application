import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

// Import DB connection and routes
import connectDb from "./src/Db/config.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

// Connect to MongoDB
connectDb();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files for uploads
app.use("/uploads", express.static("uploads"));

// Base route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 Chat Backend is running..." });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // You can replace "*" with your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected", socket.id);

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("send message", (newMessage) => {
    const chatId = newMessage.chat._id;
    socket.to(chatId).emit("message received", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
