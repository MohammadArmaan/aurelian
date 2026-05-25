const asyncHandler = require("express-async-handler");
const ContractorRequest = require("../models/ContractorRequest");

const createContractorRequest = asyncHandler(async (req, res) => {
    const { projectName, details, requestedBudget, preferredTimeline, files } =
        req.body;
    const request = new ContractorRequest({
        user: req.user._id,
        projectName,
        details,
        requestedBudget,
        preferredTimeline,
        files,
    });
    const created = await request.save();
    res.status(201).json(created);
});

const getRequests = asyncHandler(async (req, res) => {
    const requests = await ContractorRequest.find().populate(
        "user",
        "name email",
    );
    res.json(requests);
});

const updateRequestStatus = asyncHandler(async (req, res) => {
    const request = await ContractorRequest.findById(req.params.id);
    if (!request) {
        res.status(404);
        throw new Error("Request not found");
    }
    request.status = req.body.status || request.status;
    const updated = await request.save();
    res.json(updated);
});

module.exports = { createContractorRequest, getRequests, updateRequestStatus };
