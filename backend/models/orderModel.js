import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },

    items: [{
        productId: String,
        name: String,
        price: Number,
        images: Array,
        size: String,
        quantity: Number
    }],

    address: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        phone: String
    },

    amount: Number,
    paymentMethod: String,
    payment: Boolean,
    status: { type: String, default: "Order Placed" },
    date: Number
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;