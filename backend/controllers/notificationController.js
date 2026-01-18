import notificationModel from "../models/notificationModel.js";

/* ================= GET ADMIN NOTIFICATIONS ================= */

export const getAdminNotifications = async(req, res) => {
    try {
        const notifications = await notificationModel
            .find({})
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await notificationModel.countDocuments({
            isRead: false,
        });

        res.json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ================= MARK ALL AS READ ================= */

export const markAllRead = async(req, res) => {
    try {
        await notificationModel.updateMany({ isRead: false }, { $set: { isRead: true } });

        res.json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ================= MARK SINGLE AS READ ================= */

export const markSingleRead = async(req, res) => {
    try {
        const { notificationId } = req.body;

        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message: "notificationId is required",
            });
        }

        await notificationModel.findByIdAndUpdate(notificationId, {
            $set: { isRead: true },
        });

        res.json({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};