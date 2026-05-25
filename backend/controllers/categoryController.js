const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, featured } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) {
        res.status(400);
        throw new Error("Category already exists");
    }
    const category = await Category.create({ name, description, featured });
    res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    category.featured = req.body.featured ?? category.featured;
    const updated = await category.save();
    res.json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    await category.remove();
    res.json({ message: "Category removed" });
});

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
