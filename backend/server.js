import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoute from "./routes/adminRoute.js";

const app = express();
const __dirname = path.resolve();
const port = process.env.PORT || 4000;

/* ================= MIDDLEWARE ================= */

app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
    res.send("API working");
});

/* ================= SERVER START ================= */

const startServer = async() => {
    try {
        await connectDB();
        console.log("DB Connected");

        connectCloudinary();

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
        process.exit(1);
    }
};

startServer();