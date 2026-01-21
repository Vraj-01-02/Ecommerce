import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import AdminActivity from "../models/adminActivityModel.js";
import logAdminActivity from "../utils/logAdminActivity.js";

/* ================= ADMIN LOGIN ================= */

export const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 🔐 JWT NOW CONTAINS ROLE + PERMISSIONS
        const token = jwt.sign({
                id: admin._id,
                role: admin.role,
                permissions: admin.permissions,
            },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        // 🔥 ACTIVITY LOG
        await logAdminActivity({
            admin,
            action: "ADMIN_LOGIN",
            description: "Admin logged in",
        });

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ================= GET ADMIN PROFILE ================= */

export const getAdminProfile = async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

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

        const admin = await Admin.findById(req.admin._id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        admin.name = name || admin.name;
        admin.email = email || admin.email;

        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            admin.avatar = `${baseUrl}/uploads/${req.file.filename}`;
        }

        await admin.save();

        const safeAdmin = await Admin.findById(admin._id).select("-password");

        res.json({
            success: true,
            admin: safeAdmin,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= CHANGE ADMIN PASSWORD ================= */

export const changeAdminPassword = async(req, res) => {
    try {
        const { current, new: newPassword } = req.body;

        const admin = await Admin.findById(req.admin._id);

        const isMatch = await bcrypt.compare(current, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        admin.password = newPassword;
        await admin.save();

        await logAdminActivity({
            admin,
            action: "CHANGE_PASSWORD",
            description: "Changed own password",
        });

        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= CREATE ADMIN (SUPER ADMIN ONLY) ================= */

export const createAdmin = async(req, res) => {
    try {
        if (req.admin.role !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only Super Admin can create admins",
            });
        }

        const { name, email, password, permissions } = req.body;

        // permissions example:
        // ["products"]
        // ["orders"]
        // ["products","orders"]

        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists",
            });
        }

        await Admin.create({
            name,
            email,
            password,
            role: "Admin",
            permissions: permissions || [],
        });

        await logAdminActivity({
            admin: req.admin,
            action: "CREATE_ADMIN",
            description: `Created admin ${email} with permissions: ${permissions?.join(
        ", "
      )}`,
        });

        res.json({
            success: true,
            message: "Admin created successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= LIST ADMINS (SUPER ADMIN ONLY) ================= */

export const listAdmins = async(req, res) => {
    try {
        if (req.admin.role !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only Super Admin can view admins",
            });
        }

        const admins = await Admin.find().select("-password");

        res.json({
            success: true,
            admins,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= DELETE ADMIN (SUPER ADMIN ONLY) ================= */

export const deleteAdmin = async(req, res) => {
    try {
        if (req.admin.role !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only Super Admin can delete admins",
            });
        }

        const { id } = req.params;

        if (req.admin._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account",
            });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        await admin.deleteOne();

        await logAdminActivity({
            admin: req.admin,
            action: "DELETE_ADMIN",
            description: `Deleted admin ${admin.email}`,
        });

        res.json({
            success: true,
            message: "Admin deleted successfully",
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

        if (req.admin.role === "SuperAdmin") {
            const orders = await Order.find();
            const totalRevenue = orders.reduce(
                (sum, order) => sum + (order.amount || 0),
                0
            );

            return res.json({
                success: true,
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue,
            });
        }

        return res.json({
            success: true,
            totalProducts,
            totalOrders,
            totalUsers,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= GET ADMIN ACTIVITY (SUPER ADMIN ONLY) ================= */

export const getAdminActivity = async(req, res) => {
    try {
        if (req.admin.role !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const activities = await AdminActivity.find()
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({
            success: true,
            activities,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};