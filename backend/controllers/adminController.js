const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const totalReviews = await Review.countDocuments({ approved: true });
    const revenue = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalBookings,
        pendingOrders,
        totalReviews,
        revenue: revenue[0]?.total || 0,
    });
});

module.exports = { getDashboardStats };
