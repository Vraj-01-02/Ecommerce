import AdminActivity from "../models/adminActivityModel.js";

const logAdminActivity = async({
    admin,
    action,
    description,
    entityType = null,
    entityId = null,
}) => {
    try {
        if (!admin || !admin._id) return;

        await AdminActivity.create({
            adminId: admin._id,
            adminName: admin.name,
            role: admin.role,
            action,
            description,

            // 🔥 NEW (navigation support)
            entityType,
            entityId,
        });
    } catch (error) {
        console.error("❌ Admin Activity Log Error:", error.message);
    }
};

export default logAdminActivity;