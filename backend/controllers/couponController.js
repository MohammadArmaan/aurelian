const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountAmount, minOrderValue, expiresAt } = req.body;
    const coupon = new Coupon({
        code,
        discountAmount,
        minOrderValue,
        expiresAt,
    });
    const created = await coupon.save();
    res.status(201).json(created);
});

const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
});

const validateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findOne({
        code: req.params.code.toUpperCase(),
        active: true,
    });
    if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        res.status(404);
        throw new Error("Coupon invalid or expired");
    }
    res.json(coupon);
});

const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error("Coupon not found");
    }
    Object.assign(coupon, req.body);
    const updated = await coupon.save();
    res.json(updated);
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
        await coupon.remove();
        res.json({ message: "Coupon deleted" });
    } else {
        res.status(404);
        throw new Error("Coupon not found");
    }
});

module.exports = {
    createCoupon,
    getCoupons,
    validateCoupon,
    updateCoupon,
    deleteCoupon,
};
