const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.address) {
            user.addresses = [req.body.address, ...user.addresses].slice(0, 4);
        }
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

const blockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({
            message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = { getUserProfile, updateUserProfile, getUsers, blockUser };
