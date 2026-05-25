const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/Wishlist");

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
        "products.product",
    );
    res.json(wishlist?.products || []);
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, products: [] });
    }
    const exists = wishlist.products.some(
        (item) => item.product.toString() === productId,
    );
    if (!exists) {
        wishlist.products.push({ product: productId });
        await wishlist.save();
    }
    res.json(wishlist.products);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
        wishlist.products = wishlist.products.filter(
            (item) => item.product.toString() !== req.params.id,
        );
        await wishlist.save();
        res.json(wishlist.products);
    } else {
        res.status(404);
        throw new Error("Wishlist not found");
    }
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
