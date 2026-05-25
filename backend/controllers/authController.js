const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const attachToken = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please provide name, email and password");
    }
    const exists = await User.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error("Email already registered");
    }
    const user = await User.create({
        name,
        email,
        password,
        role: role || "customer",
    });
    const token = createToken(user._id);
    attachToken(res, token);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const token = createToken(user._id);
        attachToken(res, token);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.json({ message: "Logged out successfully" });
});

const currentUser = asyncHandler(async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401);
        throw new Error("Not authenticated");
    }
});

module.exports = { registerUser, loginUser, logoutUser, currentUser };
