import express from "express";
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
} from "../controllers/orderController.js";

import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

/* ================= ADMIN ROUTES ================= */
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

/* ================= USER ORDER ROUTES ================= */
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

/* 🔥 IMPORTANT: lowercase route */
orderRouter.post("/userorders", authUser, userOrders);

/* ================= PAYMENT VERIFY ================= */
orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;