const express = require("express");
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookings,
    updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/mine", protect, getMyBookings);
router.get("/", protect, authorize("admin"), getBookings);
router.put("/:id/status", protect, authorize("admin"), updateBookingStatus);

module.exports = router;
