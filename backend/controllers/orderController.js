const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

const createOrder = asyncHandler(async (req, res) => {
    let {
        orderItems,
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        total,
    } = req.body;

    if ((!orderItems || orderItems.length === 0) && items) {
        orderItems = items.map((item) => ({
            product: item.product,
            title: item.title || item.name || item.product?.title,
            price: item.price,
            quantity: item.quantity,
            image:
                item.image || item.product?.image || item.product?.images?.[0],
        }));
    }

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    if (totalPrice === undefined) {
        totalPrice = total;
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    });
    const created = await order.save();
    res.status(201).json(created);
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email",
    );
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
    });
    res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status || order.status;
        if (req.body.status === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        const updated = await order.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus,
};
