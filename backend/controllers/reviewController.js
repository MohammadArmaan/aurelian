const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Product = require("../models/Product");

const addReview = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    const review = new Review({
        user: req.user._id,
        product: productId,
        rating,
        comment,
    });
    await review.save();
    const reviews = await Review.find({ product: productId, approved: true });
    product.reviewsCount = reviews.length;
    product.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) /
        (reviews.length || 1);
    await product.save();
    res.status(201).json(review);
});

const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({
        product: req.params.productId,
        approved: true,
    }).populate("user", "name");
    res.json(reviews);
});

const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
        .populate("product", "title")
        .populate("user", "name");
    res.json(reviews);
});

const moderateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (review) {
        review.approved = req.body.approved;
        await review.save();
        res.json(review);
    } else {
        res.status(404);
        throw new Error("Review not found");
    }
});

module.exports = { addReview, getProductReviews, getReviews, moderateReview };
