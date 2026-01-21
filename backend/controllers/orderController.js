import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import logAdminActivity from "../utils/logAdminActivity.js";

import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const currency = "inr";
const deliveryCharge = 40;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= COD ORDER =================
const placeOrder = async(req, res) => {
    try {
        const userId = req.user.id;
        const { items, amount, address } = req.body;

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        await Notification.create({
            title: "New Order Received",
            message: `🛒 New COD order placed (#${newOrder._id
        .toString()
        .slice(-6)})`,
            forRole: "admin",
            type: "order",
            link: `/orders/${newOrder._id}`,
            referenceId: newOrder._id,
        });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error("COD Order Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ================= STRIPE ORDER =================
const placeOrderStripe = async(req, res) => {
    try {
        const userId = req.user.id;
        const { items, amount, address } = req.body;
        const { origin } = req.headers;

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        });

        await newOrder.save();

        await Notification.create({
            title: "New Order Received",
            message: `💳 New Stripe order placed (#${newOrder._id
        .toString()
        .slice(-6)})`,
            forRole: "admin",
            type: "order",
            link: `/orders/${newOrder._id}`,
            referenceId: newOrder._id,
        });

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Stripe Order Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ================= VERIFY STRIPE =================
const verifyStripe = async(req, res) => {
    try {
        const { orderId, success } = req.body;
        const userId = req.user.id;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= USER ORDERS =================
const userOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user.id });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= ADMIN =================
const allOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= 🔥 ADMIN UPDATE ORDER STATUS =================
const updateStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const oldStatus = order.status;

        order.status = status;
        await order.save();

        // 🔥 ACTIVITY LOG (THIS WAS MISSING)
        await logAdminActivity({
            admin: req.admin,
            action: "UPDATE_ORDER_STATUS",
            description: `Updated order #${order._id
        .toString()
        .slice(-6)} from "${oldStatus}" to "${status}"`,
        });

        res.json({ success: true, message: "Order Status Updated" });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.json({ success: false, message: error.message });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    verifyStripe,
    userOrders,
    allOrders,
    updateStatus,
};