const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");

const createBooking = asyncHandler(async (req, res) => {
    const {
        product,
        requestType,
        quantity,
        notes,
        preferredDate,
        contractorRequest,
    } = req.body;
    const booking = new Booking({
        user: req.user._id,
        product,
        requestType,
        quantity,
        notes,
        preferredDate,
        contractorRequest,
    });
    const created = await booking.save();
    res.status(201).json(created);
});

const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate(
        "product",
        "title images",
    );
    res.json(bookings);
});

const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .populate("user", "name email")
        .populate("product", "title");
    res.json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
        booking.status = req.body.status || booking.status;
        const updated = await booking.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});

module.exports = {
    createBooking,
    getMyBookings,
    getBookings,
    updateBookingStatus,
};
