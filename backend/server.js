import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import rateLimit from "express-rate-limit";
// express-mongo-sanitize removed - incompatible with Express 5
// xss-clean also incompatible with Express 5 (same issue)
// See: https://github.com/expressjs/express/issues/5590
import helmet from "helmet";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { initSocket } from "./config/socket.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoute from "./routes/adminRoute.js";
import addressRouter from "./routes/addressRoute.js";
import webhookRouter from "./routes/webhookRoute.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const port = process.env.PORT || 4000;

/* ================= MIDDLEWARE ================= */

// 🔒 CORS - Must be FIRST (before any routes)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// 🔒 SECURITY HEADERS (before routes)
app.use(helmet());

// 💳 WEBHOOK ROUTE (needs raw body for signature verification)
// Apply raw body parser ONLY to webhook route
app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRouter);

// JSON parser for ALL other routes
app.use(express.json());

// 🔒 Additional Security Middleware
// NOTE: express-mongo-sanitize and xss-clean are incompatible with Express 5
// They try to modify read-only req.query and req.body properties
// Alternative: helmet provides good security headers, use validator for input validation

// 🔒 RATE LIMITING - Prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/address", addressRouter);

app.get("/", (req, res) => {
    res.send("API working");
});

/* ================= SERVER START ================= */

const startServer = async() => {
    try {
        await connectDB();

        connectCloudinary();

        // Initialize Socket.IO
        initSocket(server);
        console.log("✅ Socket.IO initialized");

        server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
        process.exit(1);
    }
};

startServer();