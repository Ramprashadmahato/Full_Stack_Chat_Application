import asyncHandler from "express-async-handler";
import { Notification } from "../models/Notification.js"; // import the model correctly

// Add a new notification
export const addNewNotification = asyncHandler(async (req, res) => {
  const { notification } = req.body;
  if (!notification) return res.status(400).json({ message: "Notification ID is required" });

  const alreadyExist = await Notification.findOne({ notificationId: notification });
  if (alreadyExist) return res.status(400).json({ message: "Duplicates not allowed" });

  let newNotification = await Notification.create({
    user: req.user.id,
    notificationId: notification,
  });

  newNotification = await newNotification.populate("user", "-password");
  newNotification = await newNotification.populate("notificationId");
  newNotification = await newNotification.populate({
    path: "notificationId.sender",
    select: "name image email",
  });
  newNotification = await newNotification.populate({
    path: "notificationId.chatId",
    select: "chatName isGroupChat latestMessage users",
  });
  newNotification = await newNotification.populate({
    path: "notificationId.chatId.users",
    select: "name image email",
  });

  res.status(201).json(newNotification);
});

// Delete a notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const deletedNotification = await Notification.findOneAndDelete({ _id: notificationId });
  if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });
  res.status(200).json(deletedNotification);
});

// Get notifications for logged-in user
export const getNotification = asyncHandler(async (req, res) => {
  let notifications = await Notification.find({ user: req.user.id })
    .populate("user", "-password")
    .populate("notificationId");

  notifications = await Notification.populate(notifications, {
    path: "notificationId.sender",
    select: "name image email",
  });
  notifications = await Notification.populate(notifications, {
    path: "notificationId.chatId",
    select: "chatName isGroupChat latestMessage users",
  });
  notifications = await Notification.populate(notifications, {
    path: "notificationId.chatId.users",
    select: "name image email",
  });

  res.status(200).json(notifications);
});
