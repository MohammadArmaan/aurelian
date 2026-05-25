const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
    );
    res.json(cart || { items: [] });
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
    );

    if (existingItem) {
        existingItem.quantity = Math.min(
            existingItem.quantity + quantity,
            product.stock,
        );
    } else {
        cart.items.push({
            product: product._id,
            quantity,
            price: product.discountPrice || product.price,
            name: product.title,
            image: product.images?.[0] || "",
        });
    }

    await cart.save();
    res.json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const item = cart.items.find(
        (item) => item.product.toString() === req.params.id,
    );
    if (!item) {
        res.status(404);
        throw new Error("Item not found in cart");
    }

    item.quantity = Math.max(1, Number(quantity));
    await cart.save();
    res.json(cart);
});

const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.id,
    );
    await cart.save();
    res.json(cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
