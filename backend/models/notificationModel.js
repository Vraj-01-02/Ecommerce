import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ["order", "payment", "user", "system"],
        default: "system",
    },

    link: {
        type: String,
        required: true,
        // e.g. "/order", "/users"
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },

    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const notificationModel =
    mongoose.models.notification ||
    mongoose.model("notification", notificationSchema);

export default notificationModel;