import mongoose from "mongoose";

/* ================= PRODUCT SCHEMA ================= */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    subCategory: {
        type: String,
        required: true,
        trim: true,
    },

    sizes: {
        type: [String], // cleaner than Array
        required: true,
    },

    bestseller: {
        type: Boolean,
        default: false,
    },

    images: {
        type: [String], // array of Cloudinary URLs
        required: true,
    },

    /* 🔥 ACTIVE / INACTIVE (SOFT DELETE SYSTEM) */
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // createdAt & updatedAt (industry standard)
});

/* ================= SAFE MODEL EXPORT ================= */
const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;