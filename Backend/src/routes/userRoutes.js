// src/routes/userRoutes.js
import express from "express"; // ✅ import express
import { registerUser, loginUser, allUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user
router.post("/", registerUser);

// Login user
router.post("/login", loginUser);

// Search users (protected route)
router.get("/", protect, allUsers);

export default router;
