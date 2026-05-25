const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/", protect, authorize("admin"), getOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;
