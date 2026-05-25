const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const filter = {};
    const sort = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.material) filter.material = req.query.material;
    if (req.query.color) filter.color = req.query.color;
    if (req.query.availability) filter.availability = req.query.availability;
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) {
        filter.$or = [
            { title: new RegExp(req.query.search, "i") },
            { description: new RegExp(req.query.search, "i") },
            { category: new RegExp(req.query.search, "i") },
        ];
    }
    switch (req.query.sort) {
        case "priceLow":
            sort.price = 1;
            break;
        case "priceHigh":
            sort.price = -1;
            break;
        case "newest":
            sort.createdAt = -1;
            break;
        case "popular":
            sort.rating = -1;
            break;
        default:
            sort.featured = -1;
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sort)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        title: req.body.title || "New Signature Piece",
        slug: req.body.slug || `luxury-${Date.now()}`,
        description:
            req.body.description ||
            "A premium furniture piece designed for timeless interiors.",
        category: req.body.category || "Sofas",
        material: req.body.material || "Walnut wood",
        color: req.body.color || "Ivory",
        price: req.body.price || 1299,
        discountPrice: req.body.discountPrice || 0,
        stock: req.body.stock || 10,
        availability: req.body.availability || "In stock",
        images: req.body.images || [],
        specs: req.body.specs || [],
        tags: req.body.tags || [],
        createdBy: req.user._id,
    });
    const created = await product.save();
    res.status(201).json(created);
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ featured: true })
        .limit(8)
        .sort({ createdAt: -1 });
    res.json(products);
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
};
