import notificationModel from "../models/notificationModel.js";

// ================= GET ALL ADMIN NOTIFICATIONS =================
const getAdminNotifications = async(req, res) => {
    try {
        const notifications = await notificationModel
            .find({})
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            notifications,
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// ================= MARK ALL AS READ =================
const markAllRead = async(req, res) => {
    try {
        await notificationModel.updateMany({ isRead: false }, { isRead: true });

        res.json({ success: true });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export { getAdminNotifications, markAllRead };