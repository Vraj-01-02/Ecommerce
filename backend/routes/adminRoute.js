import express from "express";
import {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    adminLogin,
    getDashboardStats
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/* ========== PUBLIC ========== */
router.post("/login", adminLogin);

/* ========== PROFILE ========== */
router.get("/profile", adminAuth, getAdminProfile);
router.put("/profile", adminAuth, updateAdminProfile);

/* ========== AVATAR UPLOAD ========== */
router.put(
    "/upload-avatar",
    adminAuth,
    upload.single("avatar"),
    updateAdminProfile
);

/* ========== PASSWORD ========== */
router.put("/change-password", adminAuth, changeAdminPassword);

/* ========== DASHBOARD STATS ========== */
router.get("/dashboard-stats", adminAuth, getDashboardStats);

export default router;