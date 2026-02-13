import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { emitToAdmins, emitToUser } from "../utils/socketEvents.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= STRIPE WEBHOOK HANDLER ================= */
/**
 * Handles incoming webhooks from Stripe
 * CRITICAL: Route must use express.raw() NOT express.json()
 * Signature verification requires raw body
 */
export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // 🔐 VERIFY WEBHOOK SIGNATURE (Critical Security!)
        // This proves the request actually came from Stripe
        event = stripe.webhooks.constructEvent(
            req.body,           // Raw body (NOT parsed JSON)
            signature,          // Stripe's signature from header
            webhookSecret       // Secret from Stripe Dashboard
        );
    } catch (error) {
        console.error("⚠️ Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // 📝 Log received event
    console.log("✅ Webhook received:", event.type);

    try {
        // Handle different event types
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object);
                break;

            case "payment_intent.succeeded":
                await handlePaymentIntentSucceeded(event.data.object);
                break;

            case "payment_intent.payment_failed":
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // ALWAYS respond with 200 to acknowledge receipt
        res.json({ received: true });
    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        // Still return 200 to prevent Stripe from retrying
        // Log error for investigation
        res.status(500).json({ error: "Webhook processing failed" });
    }
};

/* ================= EVENT HANDLERS ================= */

/**
 * Handle successful checkout session completion
 * Triggered when user completes Stripe checkout
 */
async function handleCheckoutSessionCompleted(session) {
    console.log("💳 Processing checkout session:", session.id);

    try {
        // Find order by Stripe session ID
        const order = await orderModel.findOne({
            stripeSessionId: session.id,
        });

        if (!order) {
            console.error("⚠️ Order not found for session:", session.id);
            return;
        }

        // Check if already processed (idempotency)
        if (order.payment === true) {
            console.log("✅ Order already marked as paid:", order._id);
            return;
        }

        // Update order status
        order.payment = true;
        order.stripePaymentIntentId = session.payment_intent;
        order.status = "Order Confirmed";
        await order.save();

        console.log("✅ Order updated:", order._id);

        // Clear user cart
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
        console.log("🛒 Cart cleared for user:", order.userId);

        // Create notification for user
        await Notification.create({
            userId: order.userId,
            title: "Payment Successful! 🎉",
            message: `Your payment for order #${order._id.toString().slice(-6)} has been confirmed!`,
            type: "payment",
            link: `/orders/${order._id}`,
            referenceId: order._id,
        });

        // Create notification for admins
        await Notification.create({
            title: "Payment Received",
            message: `💰 Payment confirmed for order #${order._id.toString().slice(-6)} - ₹${order.amount}`,
            forRole: "admin",
            type: "payment",
            link: `/orders/${order._id}`,
            referenceId: order._id,
        });

        // 🔥 REAL-TIME NOTIFICATIONS via Socket.IO
        emitToUser(order.userId.toString(), "paymentSuccess", {
            orderId: order._id,
            orderNumber: order._id.toString().slice(-6),
            amount: order.amount,
            status: "Order Confirmed",
            timestamp: new Date(),
        });

        emitToAdmins("paymentReceived", {
            orderId: order._id,
            orderNumber: order._id.toString().slice(-6),
            amount: order.amount,
            customer: `${order.address.firstName} ${order.address.lastName}`,
            timestamp: new Date(),
        });

        console.log("🎉 Payment processing complete for order:", order._id);
    } catch (error) {
        console.error("❌ Error processing checkout session:", error);
        throw error;
    }
}

/**
 * Handle successful payment intent
 * Additional verification for payment success
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
    console.log("💰 Payment intent succeeded:", paymentIntent.id);

    try {
        // Find order by payment intent ID
        const order = await orderModel.findOne({
            stripePaymentIntentId: paymentIntent.id,
        });

        if (order && order.payment === false) {
            order.payment = true;
            order.status = "Order Confirmed";
            await order.save();
            console.log("✅ Order confirmed via payment intent:", order._id);
        }
    } catch (error) {
        console.error("❌ Error processing payment intent:", error);
        throw error;
    }
}

/**
 * Handle failed payment
 * Log for investigation and potentially notify user
 */
async function handlePaymentFailed(paymentIntent) {
    console.error("💔 Payment failed:", paymentIntent.id);
    console.error("Reason:", paymentIntent.last_payment_error?.message);

    // Optional: Find order and update status to "Payment Failed"
    const order = await orderModel.findOne({
        stripePaymentIntentId: paymentIntent.id,
    });

    if (order) {
        // You could mark order as failed or delete it
        console.log("⚠️ Payment failed for order:", order._id);
        
        // Optional: Notify user about failure
        emitToUser(order.userId.toString(), "paymentFailed", {
            orderId: order._id,
            reason: paymentIntent.last_payment_error?.message || "Payment declined",
        });
    }
}
