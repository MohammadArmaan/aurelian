const express = require("express");
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUsers,
    blockUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/", protect, authorize("admin"), getUsers);
router.put("/block/:id", protect, authorize("admin"), blockUser);

module.exports = router;
