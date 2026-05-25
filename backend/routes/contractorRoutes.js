const express = require("express");
const router = express.Router();
const {
    createContractorRequest,
    getRequests,
    updateRequestStatus,
} = require("../controllers/contractorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
    "/",
    protect,
    authorize("contractor", "customer"),
    createContractorRequest,
);
router.get("/", protect, authorize("admin"), getRequests);
router.put("/:id/status", protect, authorize("admin"), updateRequestStatus);

module.exports = router;
