import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController.js";

const webhookRouter = express.Router();

/* ================= STRIPE WEBHOOK ================= */
/**
 * IMPORTANT: Raw body parsing is handled in server.js
 * This route receives the raw body from the server-level middleware
 */
webhookRouter.post("/stripe", handleStripeWebhook);

export default webhookRouter;
