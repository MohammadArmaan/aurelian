const express = require("express");
const router = express.Router();
const {
    addReview,
    getProductReviews,
    getReviews,
    moderateReview,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, addReview);
router.get("/product/:productId", getProductReviews);
router.get("/", protect, authorize("admin"), getReviews);
router.put("/:id", protect, authorize("admin"), moderateReview);

module.exports = router;
