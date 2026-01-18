import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean, default: false },
    images: { type: Array, required: true },
    date: { type: Number, required: true }
});

/* ✅ THIS PART WAS MISSING — THIS IS WHY SERVER CRASHED */

const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;