import express from "express";
import {
    listProducts,
    listActiveProducts,
    addProduct,
    singleProduct,
    updateProduct,
    toggleProductStatus,
    deleteProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/authAdmin.js";

const productRouter = express.Router();

/* ================= ADD PRODUCT ================= */
productRouter.post(
    "/add",
    adminAuth,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    addProduct
);

/* ================= LIST PRODUCTS (ADMIN) ================= */
productRouter.get("/list", adminAuth, listProducts);

/* ================= LIST ACTIVE PRODUCTS (USER) ================= */
productRouter.get("/active", listActiveProducts);

/* ================= SINGLE PRODUCT ================= */
productRouter.post("/single", singleProduct);

/* ================= UPDATE PRODUCT ================= */
productRouter.put(
    "/update/:id",
    adminAuth,
    upload.array("images", 4),
    updateProduct
);

/* ================= TOGGLE ACTIVE / INACTIVE ================= */
productRouter.patch("/toggle/:id", adminAuth, toggleProductStatus);

/* ================= HARD DELETE PRODUCT (HIDDEN) ================= */
productRouter.delete("/:id", adminAuth, deleteProduct);

export default productRouter;