const express = require("express");
const router = express.Router();
const usageController = require("./gas-usage.controller");
const { authGuard } = require("../../middleware/authMiddleware");

router.post("/submit", usageController.submitReading); // Agent uses this
router.get("/history", authGuard, usageController.getHistory); // Admin uses this

module.exports = router;