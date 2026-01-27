import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ================= ADMIN SCHEMA ================= */
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, // 🔥 password never returned by default
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

    /* ================= PERMISSIONS =================
       examples:
       ["products"]
       ["orders"]
       ["products", "orders"]
    */
    permissions: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

/* ================= PASSWORD HASH ================= */
adminSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/* ================= PASSWORD MATCH ================= */
adminSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

/* ================= SAFE MODEL EXPORT ================= */
const Admin =
    mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;