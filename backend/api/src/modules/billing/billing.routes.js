const express = require("express");
const router = express.Router();
const billingController = require("./billing.controller");
const { authGuard } = require("../../middleware/authMiddleware");

router.get("/", authGuard, billingController.getAllBills);
router.patch("/:id/status", authGuard, billingController.updateBillStatus);

module.exports = router;