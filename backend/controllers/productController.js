import { v2 as cloudinary } from "cloudinary";
import AdminActivity from "../models/adminActivityModel.js";
import logAdminActivity from "../utils/logAdminActivity.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

// Cloudinary is already configured in config/cloudinary.js
// No need for duplicate configuration here
const addProduct = async(req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
        } = req.body;

        const image1 = req.files && req.files.image1 ? req.files.image1[0] : null;
        const image2 = req.files && req.files.image2 ? req.files.image2[0] : null;
        const image3 = req.files && req.files.image3 ? req.files.image3[0] : null;
        const image4 = req.files && req.files.image4 ? req.files.image4[0] : null;


        const images = [image1, image2, image3, image4].filter(Boolean);

        const imagesUrl = await Promise.all(
            images.map(async(item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        const product = await productModel.create({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true",
            images: imagesUrl,
            isActive: true, // default active (soft delete system)
            date: Date.now(),
        });

        res.json({ success: true, message: "Product added", product });
    } catch (error) {
        console.error("Add Product Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= LIST PRODUCTS (ADMIN) ================= */
const listProducts = async(req, res) => {
    try {
        const products = await productModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* ================= USER SIDE PRODUCTS ================= */
const listActiveProducts = async(req, res) => {
    try {
        const products = await productModel.find({ isActive: true });
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* ================= TOGGLE ACTIVE / INACTIVE ================= */
const toggleProductStatus = async(req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        product.isActive = !product.isActive;
        await product.save();

        res.json({
            success: true,
            message: product.isActive ? "Product Activated" : "Product Deactivated",
            isActive: product.isActive,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* ================= SINGLE PRODUCT ================= */
const singleProduct = async(req, res) => {
    try {
        const product = await productModel.findById(req.body.productId);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* ================= UPDATE PRODUCT ================= */
const updateProduct = async(req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        let images = product.images;

        if (req.files && req.files.length > 0) {
            images = [];
            for (const file of req.files) {
                const upload = await cloudinary.uploader.upload(file.path, {
                    resource_type: "image",
                });
                images.push(upload.secure_url);
            }
        }

        await productModel.findByIdAndUpdate(id, {
            name: req.body.name,
            price: Number(req.body.price),
            category: req.body.category,
            subCategory: req.body.subCategory,
            images,
        });

        res.json({ success: true, message: "Product updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* ================= HARD DELETE PRODUCT (HIDDEN / SUPER ADMIN) ================= */
const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        await productModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product permanently deleted",
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/* ================= ADD / UPDATE REVIEW ================= */
/**
 * 🔒 INDUSTRY-GRADE REVIEW SUBMISSION
 * 
 * SECURITY CHECKS (Amazon/Flipkart Level):
 * 1. JWT Authentication - Only logged-in users (authUser middleware)
 * 2. Purchase Verification - User must have purchased the product
 * 3. Delivery Status - Order must be "Delivered" (prevents pre-delivery reviews)
 * 4. Duplicate Prevention - One review per user per product
 * 
 * WHY THESE CHECKS?
 * - Prevents fake reviews from competitors/bots
 * - Ensures reviewer actually received and used the product
 * - Maintains review integrity and customer trust
 * - Industry standard practice for e-commerce platforms
 */
const addProductReview = async(req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        
        // 🔒 SECURITY: Use req.user.id from JWT middleware (NOT req.body.userId)
        // WHY? req.body can be forged by malicious users, req.user is verified by JWT
        const userId = req.user._id;

        // ✅ VALIDATION: Rating is required (1-5 stars)
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a rating between 1 and 5 stars" 
            });
        }

        // ✅ VALIDATION: Comment is OPTIONAL but if provided, max 500 chars
        if (comment && comment.length > 500) {
            return res.status(400).json({ 
                success: false, 
                message: "Review comment must be 500 characters or less" 
            });
        }

        // 🔍 CHECK 1: Product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // 🔍 CHECK 2: Prevent duplicate reviews (one review per user per product)
        // WHY? Prevents review spam and gaming the rating system
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ 
                success: false, 
                message: "You've already reviewed this product. You can edit your existing review." 
            });
        }

        // 🔍 CHECK 3: VERIFIED PURCHASE - User must have a DELIVERED order with this product
        // WHY? 
        // - Prevents random users from reviewing products they never bought
        // - Ensures reviewer actually received and used the product
        // - "Delivered" status confirms they got it (not just ordered)
        // - Industry standard: Amazon only allows reviews after delivery
        const orders = await orderModel.find({
            userId: userId,
            "items.productId": productId, // Check if this product is in any order
            status: "Delivered", // CRITICAL: Only delivered orders count
        });
        
        const isVerifiedPurchase = orders.length > 0;

        // 🚫 ENFORCEMENT: Block reviews from non-buyers (STRICT INDUSTRY STANDARD)
        // WHY? Without this, anyone could write fake reviews
        if (!isVerifiedPurchase) {
            return res.status(403).json({ 
                success: false, 
                message: "Only verified buyers can review this product. Your order must be delivered before you can write a review." 
            });
        }

        // ✅ CREATE REVIEW
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment: comment || "", // ⭐ OPTIONAL: Empty string if not provided
            user: userId,
            isVerifiedPurchase: true, // Always true at this point (we enforced it above)
        };

        product.reviews.push(review);

        // 📊 RECALCULATE RATINGS (critical for accurate product scoring)
        product.numReviews = product.reviews.length;
        product.averageRating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();

        res.status(201).json({ 
            success: true, 
            message: comment ? "Review added successfully!" : "Rating added successfully!" 
        });
    } catch (error) {
        console.error("❌ Review Submission Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to submit review. Please try again." 
        });
    }
};

/* ================= CHECK REVIEW ELIGIBILITY ================= */
/**
 * 🔍 CHECK IF USER CAN REVIEW THIS PRODUCT
 * 
 * Returns detailed eligibility information for frontend to use:
 * - canReview: boolean (can they submit a NEW review?)
 * - hasReviewed: boolean (have they already reviewed?)
 * - reason: string (why can't they review, if applicable)
 * 
 * Frontend uses this to:
 * - Hide/show "Write a Review" button
 * - Display helpful messages to guide users
 * - Show "Edit Your Review" if they already reviewed
 */
const checkReviewEligibility = async(req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Check if user already reviewed
        const existingReview = product.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );

        if (existingReview) {
            return res.json({
                success: true,
                canReview: false,
                hasReviewed: true,
                reason: "You've already reviewed this product",
                existingReview: {
                    id: existingReview._id,
                    rating: existingReview.rating,
                    comment: existingReview.comment,
                }
            });
        }

        // Check if user has delivered order with this product
        const orders = await orderModel.find({
            userId: userId,
            "items.productId": productId,
            status: "Delivered",
        });

        const hasDeliveredOrder = orders.length > 0;

        if (!hasDeliveredOrder) {
            return res.json({
                success: true,
                canReview: false,
                hasReviewed: false,
                reason: "You must purchase and receive this product before reviewing"
            });
        }

        // ✅ User can review!
        return res.json({
            success: true,
            canReview: true,
            hasReviewed: false,
            reason: ""
        });

    } catch (error) {
        console.error("❌ Check Eligibility Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to check eligibility" 
        });
    }
};

/* ================= UPDATE/EDIT REVIEW ================= */
/**
 * ✏️ EDIT EXISTING REVIEW
 * 
 * SECURITY:
 * - User can only edit their OWN reviews
 * - Must re-validate rating (1-5) and comment length (max 500)
 * - Recalculate product averageRating after edit
 */
const updateProductReview = async(req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment, productId } = req.body;
        const userId = req.user._id;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a rating between 1 and 5 stars" 
            });
        }

        if (comment && comment.length > 500) {
            return res.status(400).json({ 
                success: false, 
                message: "Review comment must be 500 characters or less" 
            });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Find the review
        const reviewIndex = product.reviews.findIndex(
            (r) => r._id.toString() === reviewId.toString()
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: "Review not found" 
            });
        }

        // 🔒 SECURITY: Ensure user owns this review
        if (product.reviews[reviewIndex].user.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only edit your own reviews" 
            });
        }

        // ✅ UPDATE REVIEW
        product.reviews[reviewIndex].rating = Number(rating);
        product.reviews[reviewIndex].comment = comment || "";
        product.reviews[reviewIndex].date = new Date(); // Update timestamp

        // 📊 RECALCULATE RATINGS
        product.averageRating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();

        res.json({ 
            success: true, 
            message: "Review updated successfully!" 
        });

    } catch (error) {
        console.error("❌ Update Review Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update review" 
        });
    }
};

/* ================= DELETE REVIEW (ADMIN ONLY) ================= */
const deleteProductReview = async(req, res) => {
    try {
        const { productId, reviewId } = req.body; // or params, depending on route

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const reviews = product.reviews.filter(
            (r) => r._id.toString() !== reviewId.toString()
        );

        product.reviews = reviews;
        product.numReviews = reviews.length;

        if (reviews.length === 0) {
            product.averageRating = 0;
        } else {
            product.averageRating =
                reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        }

        await product.save();

        res.json({ success: true, message: "Review deleted" });

    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= EXPORTS ================= */
export {
    addProduct,
    listProducts,
    listActiveProducts,
    toggleProductStatus,
    singleProduct,
    updateProduct,
    deleteProduct, // hidden hard delete
    addProductReview,
    checkReviewEligibility,
    updateProductReview,
    deleteProductReview,
};