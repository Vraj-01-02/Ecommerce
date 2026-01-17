import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

/* ================= GET ADMIN PROFILE ================= */

export const getAdminProfile = async(req, res) => {
    try {
        const admin = await adminModel
            .findById(req.admin._id)
            .select("-password");

        res.json({
            success: true,
            admin,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= UPDATE ADMIN PROFILE ================= */

export const updateAdminProfile = async(req, res) => {
    try {
        const { name, email } = req.body;

        const admin = await adminModel.findById(req.admin._id);

        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin not found" });
        }

        admin.name = name || admin.name;
        admin.email = email || admin.email;

        if (req.file) {
            admin.avatar = `/uploads/${req.file.filename}`;
        }

        await admin.save();

        const safeAdmin = await adminModel
            .findById(admin._id)
            .select("-password");

        res.json({
            success: true,
            admin: safeAdmin,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= CHANGE PASSWORD ================= */

export const changeAdminPassword = async(req, res) => {
    try {
        const { current, new: newPassword } = req.body;

        const admin = await adminModel.findById(req.admin._id);

        const isMatch = await bcrypt.compare(current, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= DASHBOARD STATS ================= */

export const getDashboardStats = async(req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find();

        // FIXED: correct field = amount
        const totalRevenue = orders.reduce(
            (sum, order) => sum + order.amount,
            0
        );

        res.json({
            success: true,
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= ADMIN LOGIN ================= */

export const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id },
            process.env.JWT_SECRET, { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};