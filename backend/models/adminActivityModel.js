import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    adminName: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
    },

    action: {
        type: String,
        required: true,
        // examples:
        // ORDER_STATUS_UPDATE
        // ADMIN_LOGIN
        // CREATE_ADMIN
    },

    description: {
        type: String,
        required: true,
    },

    // 🔥 NEW (important for navigation)
    entityType: {
        type: String,
        default: null,
        // "order", "product", "admin"
    },

    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        // orderId, productId, etc
    },
}, { timestamps: true });

const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);

export default AdminActivity;