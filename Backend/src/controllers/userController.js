// src/controllers/userController.js
import asyncHandler from "express-async-handler";
import { generateToken } from "../middleware/authMiddleware.js"; // ✅ use token generator from middleware
import User from "../models/Users.js"; // Make sure Users.js uses 'export default User'
import bcrypt from "bcrypt";

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("Email is already registered");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    image: pic,
  });

  if (newUser) {
    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
      },
      message: "User registered successfully",
      token: generateToken(newUser._id), // ✅ generate token directly
    });
  } else {
    res.status(500);
    throw new Error("Server could not process the request");
  }
});

// @desc    Login existing user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist && (await userExist.matchPassword(password))) {
    res.status(200).json({
      user: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        image: userExist.image,
      },
      message: "User successfully logged in",
      token: generateToken(userExist._id), // ✅ generate token directly
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Search all users
// @route   GET /api/users?search=
// @access  Private
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  if (users.length === 0) {
    return res.status(200).json({ message: "No user exists" });
  }

  res.status(200).json({ users });
});
