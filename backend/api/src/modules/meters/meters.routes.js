const express = require("express");
const router = express.Router();
const meterController = require("./meters.controller");
const { authGuard } = require("../../middleware/authMiddleware");

// --- 🔓 OPEN ROUTES (For Agent UI) ---
router.get("/", meterController.getAllMeters);
router.get("/pending", meterController.getPendingMeters);
router.get("/assigned", meterController.getAssignedMeters); // 🚀 NEW: For Task-based filtering

// --- 🔐 PROTECTED ROUTES ---
router.post("/register", authGuard, meterController.registerMeter);
router.patch("/assign", authGuard, meterController.assignMeter);
router.patch("/:id", authGuard, meterController.updateMeter);
router.delete("/:id", authGuard, meterController.deleteMeter);

module.exports = router;
