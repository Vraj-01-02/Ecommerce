import userModel from "../models/userModel.js";

// ================= ADD TO CART =================
const addToCart = async(req, res) => {
    try {
        const userId = req.user.id; // 🔥 FROM JWT
        const { itemId, size } = req.body;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again.",
            });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) cartData[itemId] = {};

        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        userData.cartData = cartData;
        await userData.save();

        res.json({ success: true, message: "Product added to cart successfully" });
    } catch (error) {
        console.log("Add to cart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE CART =================
const updateCart = async(req, res) => {
    try {
        const userId = req.user.id; // 🔥 FROM JWT
        const { itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again.",
            });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) cartData[itemId] = {};

        cartData[itemId][size] = quantity;

        userData.cartData = cartData;
        await userData.save();

        res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.log("Update cart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET USER CART =================
const getUserCart = async(req, res) => {
    try {
        const userId = req.user.id; // 🔥 FROM JWT

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again.",
            });
        }

        res.json({
            success: true,
            cartData: userData.cartData || {},
        });
    } catch (error) {
        console.log("Get cart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };