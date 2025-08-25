import asyncHandler from "express-async-handler";
import { Chat } from "../models/Chat.js";
import User from "../models/Users.js";  // ✅ default import
import { Message } from "../models/Message.js"; // assuming you have a Message model

// @desc Access or initiate a chat between two persons
// @route POST /api/chats
// @access Private
export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId not provided" });

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).json(fullChat);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

// @desc Get all chats for one user
// @route GET /api/chats
// @access Private
export const fetchChats = asyncHandler(async (req, res) => {
  try {
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    allChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    res.json(allChats);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Create a new group chat
// @route POST /api/chats/group
// @access Private
export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({ message: "A group must have at least 3 users" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Rename a group chat
// @route PUT /api/chats/groupRename
// @access Private
export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatName) return res.status(400).json({ message: "Invalid group name" });

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Add a user to group
// @route PUT /api/chats/groupAdd
// @access Private
export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) return res.status(400).json({ message: "Invalid chat" });

    res.json(updatedChat);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Remove a user from group
// @route PUT /api/chats/groupRemove
// @access Private
export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) return res.status(400).json({ message: "Invalid chat" });

    res.json(updatedChat);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Your custom endpoints -----------------

// @desc Send a single chat message (standalone)
// @route POST /api/chats/send
// @access Private
export const sendChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  const chat = await Chat.create({ user: req.user._id, message });
  res.status(201).json(chat);
});

// @desc Get total user count
// @route GET /api/users/count
// @access Private/Admin
export const getTotalUser = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.json({ totalUsers: count });
});

// @desc Get total messages count
// @route GET /api/messages/count
// @access Private/Admin
export const getTotalChat = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments();
  res.json({ totalChats: count });
});

// @desc Get chat history
// @route GET /api/chats/history
// @access Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const chats = await Chat.find()
    .sort({ createdAt: 1 })
    .populate("user", "name email");

  res.json(chats);
});
