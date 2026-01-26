import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authUser = async(req, res, next) => {
    try {
        // Support both 'token' header and 'Authorization: Bearer token'
        const { token } = req.headers;
        const authHeader = req.headers.authorization;
        
        let tokenValue;
        
        if (token) {
            // Direct token header (used by frontend)
            tokenValue = token;
        } else if (authHeader && authHeader.startsWith("Bearer ")) {
            // Bearer token format
            tokenValue = authHeader.split(" ")[1];
        }
        
        if (!tokenValue) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing. Please login again.",
            });
        }

        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // 🔥 SINGLE SOURCE OF TRUTH
        req.user = user;
        
        // Try to set userId in body for legacy controllers, but don't crash if it fails
        try {
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = decoded.id;
        } catch (err) {
            console.log("Warning: Could not set req.body.userId:", err.message);
        }

        next();
    } catch (error) {
        console.error("AuthUser error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
};

export default authUser;