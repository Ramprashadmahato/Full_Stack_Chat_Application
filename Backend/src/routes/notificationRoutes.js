import express from "express";
import { addNewNotification, deleteNotification, getNotification } from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addNewNotification);
router.get("/", protect, getNotification);
router.delete("/:notificationId", protect, deleteNotification);

export default router;
