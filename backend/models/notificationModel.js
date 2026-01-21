import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },

    // 🔥 ROLE BASED TARGETING
    forRole: {
        type: String,
        enum: ["admin"],
        required: true,
        index: true,
    },

    type: {
        type: String,
        enum: ["order", "payment", "user", "system"],
        default: "system",
    },

    link: { type: String, required: true },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },

    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
}, { timestamps: true });

notificationSchema.index({ forRole: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);