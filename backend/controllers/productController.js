import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// function for add product
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

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(
            (item) => item !== undefined
        );

        let imagesUrl = await Promise.all(
            images.map(async(item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            images: imagesUrl,
            date: Date.now(),
        };

        console.log(productData);

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// function for list product

const listProducts = async(req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for remove product
const removeProduct = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
const singleProduct = async(req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateProduct = async(req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        let images = product.images; // 👈 DEFAULT: OLD IMAGES

        // 🔥 ONLY IF NEW IMAGES ARE UPLOADED
        if (req.files && req.files.length > 0) {

            // 1️⃣ delete old images from Cloudinary
            for (const img of product.images) {
                const publicId = img.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // 2️⃣ upload new images
            images = [];
            for (const file of req.files) {
                const upload = await cloudinary.uploader.upload(file.path, {
                    resource_type: "image",
                });
                images.push(upload.secure_url);
            }
        }

        // 3️⃣ update product
        await productModel.findByIdAndUpdate(id, {
            name: req.body.name,
            price: Number(req.body.price),
            category: req.body.category,
            images, // 👈 SAFE
        });

        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };