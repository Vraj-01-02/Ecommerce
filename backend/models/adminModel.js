import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: null,
    },

    role: {
        type: String,
        enum: ["SuperAdmin", "Admin"],
        default: "Admin",
    },

    // 🔥 NEW: PERMISSIONS SYSTEM
    // examples:
    // ["products"]
    // ["orders"]
    // ["products", "orders"]
    permissions: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

// 🔐 PASSWORD HASH
adminSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;