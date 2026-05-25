const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        requestType: {
            type: String,
            enum: ["Single", "Bulk", "Custom"],
            default: "Single",
        },
        quantity: { type: Number, default: 1 },
        notes: String,
        preferredDate: Date,
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Delivered"],
            default: "Pending",
        },
        contractorRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContractorRequest",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
