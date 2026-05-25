const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Coupon = require("../models/Coupon");
const Booking = require("../models/Booking");
const ContractorRequest = require("../models/ContractorRequest");
const products = require("./products");
const categories = require("./categories");

dotenv.config();
connectDB();

const seed = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Coupon.deleteMany();
        await Booking.deleteMany();
        await ContractorRequest.deleteMany();

        const adminPassword = await bcrypt.hash("Premium123!", 10);
        const admin = await User.create({
            name: "Maison Admin",
            email: "admin@furnlux.com",
            password: adminPassword,
            role: "admin",
            isVerified: true,
        });

        const sampleUser = await User.create({
            name: "Aurora Lane",
            email: "customer@furnlux.com",
            password: await bcrypt.hash("Customer123!", 10),
            role: "customer",
            isVerified: true,
        });

        const contractor = await User.create({
            name: "Edward Brooks",
            email: "contractor@furnlux.com",
            password: await bcrypt.hash("Contractor123!", 10),
            role: "contractor",
            isVerified: true,
        });

        await Category.insertMany(categories);
        const createdProducts = await Product.insertMany(
            products.map((product) => ({ ...product, createdBy: admin._id })),
        );

        await Coupon.create({
            code: "VELVET15",
            discountAmount: 150,
            minOrderValue: 1200,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        });
        await Coupon.create({
            code: "LUXE25",
            discountAmount: 250,
            minOrderValue: 2200,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        await Booking.create({
            user: sampleUser._id,
            product: createdProducts[0]._id,
            requestType: "Single",
            quantity: 1,
            notes: "Please deliver after 5pm.",
            status: "Pending",
        });

        await ContractorRequest.create({
            user: contractor._id,
            projectName: "Penthouse Suite Design",
            details:
                "Bulk order for living and dining spaces with custom sizing.",
            requestedBudget: 18000,
            preferredTimeline: "8 weeks",
        });

        console.log("Data seeded successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
