const express = require("express");
const router = express.Router();
const usageController = require("./gas-usage.controller");
const { authGuard } = require("../../middleware/auth"); // Jaisa plants mein tha

router.post("/submit", usageController.submitReading); // ! No authGuard
router.get("/history", authGuard, usageController.getHistory);

module.exports = router;