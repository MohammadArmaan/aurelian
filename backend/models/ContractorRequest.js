const mongoose = require("mongoose");

const contractorRequestSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        projectName: { type: String, required: true },
        details: { type: String, required: true },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        requestedBudget: { type: Number },
        preferredTimeline: { type: String },
        files: [{ type: String }],
    },
    { timestamps: true },
);

module.exports = mongoose.model("ContractorRequest", contractorRequestSchema);
