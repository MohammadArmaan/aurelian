const express = require("express");
const router = express.Router();
const {
    createCoupon,
    getCoupons,
    validateCoupon,
    updateCoupon,
    deleteCoupon,
} = require("../controllers/couponController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), getCoupons);
router.post("/", protect, authorize("admin"), createCoupon);
router.get("/:code", validateCoupon);
router.put("/:id", protect, authorize("admin"), updateCoupon);
router.delete("/:id", protect, authorize("admin"), deleteCoupon);

module.exports = router;
