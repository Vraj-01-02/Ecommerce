import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoute from "./routes/adminRoute.js";

import path from "path";

const app = express();
const __dirname = path.resolve();
const port = process.env.PORT || 4000;

/* ================= BODY PARSER ================= */

app.use(express.json());

/* ================= CORS (EXPRESS 5 SAFE) ================= */

const allowedOrigins = [
    "http://localhost:5173", // frontend
    "http://localhost:5174", // admin
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "token"],
    })
);

/* ⚠️ IMPORTANT FIX FOR PREFLIGHT (NO app.options BUG) */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, token"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
    res.send("API working");
});

/* ================= SERVER START ================= */

const startServer = async() => {
    try {
        await connectDB();
        console.log("✅ Database Connected");

        connectCloudinary();

        app.listen(port, () => {
            console.log(`✅ Server started on port: ${port}`);
        });
    } catch (error) {
        console.error("❌ Server startup error:", error.message);
        process.exit(1);
    }
};

startServer();