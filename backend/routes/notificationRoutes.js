import express from "express";
import {
    getAdminNotifications,
    markAllRead,
    markSingleRead,
} from "../controllers/notificationController.js";
import adminAuth from "../middleware/authAdmin.js";

const router = express.Router();

/* ================= ADMIN NOTIFICATIONS ================= */

// Get logged-in admin notifications
// GET /api/notifications
router.get("/", adminAuth, getAdminNotifications);

// Mark all notifications as read
// PUT /api/notifications/read-all
router.put("/read-all", adminAuth, markAllRead);

// Mark single notification as read (on click)
// PUT /api/notifications/:id/read
router.put("/:id/read", adminAuth, markSingleRead);

export default router;