import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

/* ================= CLOUDINARY CONFIG ================= */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/* ================= ADD PRODUCT ================= */
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

/* ================= EXPORTS ================= */
export {
    addProduct,
    listProducts,
    listActiveProducts,
    toggleProductStatus,
    singleProduct,
    updateProduct,
    deleteProduct, // hidden hard delete
};