import Notification from "../models/notificationModel.js";

/* ================= GET ADMIN NOTIFICATIONS ================= */
// GET /api/notifications
export const getAdminNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find({ forRole: "admin" })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const unreadCount = await Notification.countDocuments({
            forRole: "admin",
            isRead: false,
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

/* ================= MARK ALL AS READ ================= */
// PUT /api/notifications/read-all
export const markAllRead = async(req, res) => {
    try {
        await Notification.updateMany({ forRole: "admin", isRead: false }, { $set: { isRead: true } });

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("Mark all read error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update notifications",
        });
    }
};

/* ================= MARK SINGLE AS READ ================= */
// PUT /api/notifications/:id/read
export const markSingleRead = async(req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate({ _id: id, forRole: "admin" }, { $set: { isRead: true } }, { new: true });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error("Mark single read error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};