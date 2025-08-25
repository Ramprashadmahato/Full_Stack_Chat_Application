// ES module syntax
import User from "../models/Users.js"; // default import
import {Message}  from "../models/Message.js"; // default import
import {Chat} from "../models/Chat.js"; // default import
import asyncHandler from "express-async-handler";

// @desc    Send message
// @route   POST /api/message
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({
      error: "Bad request",
      message: "Content and ChatId are required",
    });
  }

  const newMessage = {
    sender: req.user._id, // make sure auth middleware sets req.user._id
    content,
    chat: chatId, // should match schema field 'chat'
  };

  try {
    let message = await Message.create(newMessage);

    // Populate sender and chat users
    message = await message.populate("sender", "name image email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not process request" });
  }
});

// @desc    Fetch all the messages for a chat
// @route   GET /api/message/:chatId
// @access  Private
export const fetchMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const allMessages = await Message.find({ chat: chatId }) // 'chat' field in schema
      .populate("sender", "name image email")
      .populate("chat");

    res.status(200).json(allMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not process request" });
  }
});
