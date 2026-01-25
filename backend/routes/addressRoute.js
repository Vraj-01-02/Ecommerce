import express from "express";
import { getUserAddresses, saveAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/addressController.js";
import authUser from "../middleware/auth.js";

const addressRouter = express.Router();

addressRouter.get("/", authUser, getUserAddresses);
addressRouter.post("/", authUser, saveAddress);
addressRouter.put("/:addressId", authUser, updateAddress);
addressRouter.delete("/:addressId", authUser, deleteAddress);
addressRouter.put("/:addressId/default", authUser, setDefaultAddress);

export default addressRouter;
