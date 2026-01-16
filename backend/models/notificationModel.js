import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model("notification", notificationSchema);