const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                title: String,
                price: Number,
                quantity: Number,
                image: String,
            },
        ],
        shippingAddress: {
            label: String,
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        paymentMethod: { type: String, default: "Stripe" },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
        isPaid: { type: Boolean, default: false },
        paidAt: Date,
        isDelivered: { type: Boolean, default: false },
        deliveredAt: Date,
    },
    { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
