const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
