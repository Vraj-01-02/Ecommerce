import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import AdminActivity from "../models/adminActivityModel.js";
import logAdminActivity from "../utils/logAdminActivity.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

/* ================= ADMIN LOGIN ================= */

export const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email }).select("+password");

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
            process.env.JWT_SECRET, { expiresIn: "30d" }
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

        const admin = await Admin.findById(req.admin._id).select('+password');

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
        console.error("❌ CREATE ADMIN ERROR:", error.message);
        console.error("Full error:", error);
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
        const { role, permissions } = req.admin;

        // 🔥 SUPER ADMIN – FULL ACCESS
        if (role === "SuperAdmin") {
            const totalProducts = await Product.countDocuments();
            const totalOrders = await Order.countDocuments();
            const totalUsers = await User.countDocuments();

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

        // 🔹 ORDER ADMIN – ONLY ORDERS
        if (permissions.includes("orders") && !permissions.includes("products")) {
            const totalOrders = await Order.countDocuments();

            return res.json({
                success: true,
                totalOrders,
            });
        }

        // 🔹 PRODUCT ADMIN – PRODUCTS + ORDERS
        if (permissions.includes("products")) {
            const totalProducts = await Product.countDocuments();
            const totalOrders = await Order.countDocuments();

            return res.json({
                success: true,
                totalProducts,
                totalOrders,
            });
        }

        // ❌ fallback (should not happen)
        return res.json({ success: true });
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

/* ================= FORGOT PASSWORD ================= */

export const adminForgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Get Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expire (e.g., 15 minutes)
        admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await admin.save();

        // Create Reset URL
        const resetUrl = `http://localhost:5174/admin/reset-password/${resetToken}`;

        const emailTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333; margin: 0;">Admin Password Reset</h2>
                </div>
                <div style="color: #555; font-size: 16px; line-height: 1.6;">
                    <p>Hello ${admin.name},</p>
                    <p>We received a request to reset your admin password. Please click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #4f46e5; background-color: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 14px;">${resetUrl}</p>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
                    <p>&copy; ${new Date().getFullYear()} Fabric Admin. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send Email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: admin.email,
            subject: "Admin Password Reset Request",
            html: emailTemplate,
        });

        res.json({
            success: true,
            message: `Email sent to ${admin.email}`,
        });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= RESET PASSWORD ================= */

export const adminResetPassword = async(req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        admin.password = password; // Will be hashed by pre-save hook
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;

        await admin.save();

        await logAdminActivity({
            admin,
            action: "RESET_PASSWORD",
            description: "Reset password via email link",
        });

        res.json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};