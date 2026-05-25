const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        material: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        ratingAvg: { type: Number, default: 4.6 },
        reviewsCount: { type: Number, default: 0 },
        dimensions: { type: String },
        contractorPricing: {
            unitPrice: Number,
            minQty: Number,
        },
        stock: { type: Number, default: 12 },
        availability: {
            type: String,
            enum: ["In stock", "Limited", "Out of stock"],
            default: "In stock",
        },
        images: [{ type: String }],
        specs: [{ label: String, value: String }],
        tags: [String],
        featured: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
