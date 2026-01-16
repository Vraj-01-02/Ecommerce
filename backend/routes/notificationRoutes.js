import express from "express";
import {
    getAdminNotifications,
    markAllRead,
} from "../controllers/notificationController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// 🔔 Get all notifications (Admin)
router.get("/admin", adminAuth, getAdminNotifications);

// 🔔 Mark all notifications as read
router.put("/read", adminAuth, markAllRead);

export default router;