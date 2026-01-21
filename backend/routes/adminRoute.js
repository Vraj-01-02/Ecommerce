import express from "express";
import {
    adminLogin,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    getDashboardStats,
    createAdmin,
    listAdmins,
    deleteAdmin,
    getAdminActivity,
} from "../controllers/adminController.js";

import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/* ================= PUBLIC ROUTE ================= */

// Admin Login
router.post("/login", adminLogin);

/* ================= PROTECTED ROUTES ================= */

// Get admin profile
router.get("/profile", authAdmin, getAdminProfile);

// Update admin profile
router.put("/profile", authAdmin, updateAdminProfile);

// Upload admin avatar
router.put(
    "/upload-avatar",
    authAdmin,
    upload.single("avatar"),
    updateAdminProfile
);

// Change admin password
router.put("/change-password", authAdmin, changeAdminPassword);

// Dashboard stats
router.get("/dashboard-stats", authAdmin, getDashboardStats);

/* ================= SUPER ADMIN ONLY ================= */

// Create new admin
router.post("/create", authAdmin, createAdmin);

// List all admins
router.get("/list", authAdmin, listAdmins);

// Delete admin
router.delete("/:id", authAdmin, deleteAdmin);

// 🔥 Admin activity logs
router.get("/activity", authAdmin, getAdminActivity);

export default router;