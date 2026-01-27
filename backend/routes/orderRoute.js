import express from "express";
import {
    placeOrder,
    placeOrderStripe,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
} from "../controllers/orderController.js";

import adminAuth from "../middleware/authAdmin.js";
import authUser from "../middleware/auth.js";
import permissionAdmin from "../middleware/permissionAdmin.js";

const orderRouter = express.Router();

/* ================= USER ROUTES ================= */

// Place COD order
orderRouter.post("/place", authUser, placeOrder);

// Place Stripe order
orderRouter.post("/stripe", authUser, placeOrderStripe);

orderRouter.get("/user", authUser, userOrders);


// User order list
orderRouter.post("/userorders", authUser, userOrders);

// Verify Stripe payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

/* ================= ADMIN ROUTES ================= */

// 👑 View all orders (Orders permission required)
orderRouter.post(
    "/list",
    adminAuth,
    permissionAdmin("orders"),
    allOrders
);

// 👑 Update order status (Orders permission required)
orderRouter.post(
    "/status",
    adminAuth,
    permissionAdmin("orders"),
    updateStatus
);

export default orderRouter;