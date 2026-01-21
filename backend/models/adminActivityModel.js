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
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const AdminActivity = mongoose.model(
    "AdminActivity",
    adminActivitySchema
);

export default AdminActivity;