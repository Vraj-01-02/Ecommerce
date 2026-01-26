import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

const adminAuth = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await adminModel.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin not found",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log("AdminAuth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not Authorized, token failed",
        });
    }
};

export default adminAuth;