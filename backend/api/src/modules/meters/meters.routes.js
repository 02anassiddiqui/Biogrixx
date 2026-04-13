// backend/api/src/modules/meters/meters.routes.js
const express = require("express");
const router = express.Router(); 
const meterController = require("./meters.controller");
const { authGuard } = require("../../middleware/authMiddleware");

// --- 🔓 OPEN ROUTES (For Agent UI) ---
// Agent ko saare active meters dekhne ki permission honi chahiye
router.get("/", meterController.getAllMeters); // ! ✅ no authGuard
router.get("/pending", meterController.getPendingMeters); // ! ✅ no authGuard

// --- 🔐 PROTECTED ROUTES (For Admin Dashboard) ---
// Meter register karna aur assign karna sirf Admin kar sakega
router.post("/register", authGuard, meterController.registerMeter);
router.patch("/assign", authGuard, meterController.assignMeter);
router.patch("/:id", authGuard, meterController.updateMeter);

// ✅ Add this line for Delete
router.delete("/:id", authGuard, meterController.deleteMeter);

module.exports = router;