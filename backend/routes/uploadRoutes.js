const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadImage } = require("../utils/cloudinary");

router.post("/", protect, authorize("admin"), async (req, res) => {
    const { image } = req.body;
    if (!image) {
        return res.status(400).json({ message: "Image data is required" });
    }
    const result = await uploadImage(image);
    res.json({ url: result.secure_url });
});

module.exports = router;
