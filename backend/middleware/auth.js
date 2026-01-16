import jwt from "jsonwebtoken";

const authUser = async(req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, Login Again",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // ✅ ONLY SOURCE OF userId

        next();
    } catch (error) {
        console.log("AUTH ERROR:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authUser;