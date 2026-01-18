import express from "express";
import {
    getAdminNotifications,
    markAllRead,
    markSingleRead,
} from "../controllers/notificationController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ================= ADMIN NOTIFICATIONS ================= */

// Get all admin notifications
router.get("/admin", adminAuth, getAdminNotifications);

// Mark all as read
router.put("/read", adminAuth, markAllRead);

// Mark single as read (used when clicking notification)
router.put("/read-single", adminAuth, markSingleRead);

export default router;