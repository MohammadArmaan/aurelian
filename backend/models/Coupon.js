const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountAmount: { type: Number, required: true },
        minOrderValue: { type: Number, default: 0 },
        expiresAt: Date,
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
