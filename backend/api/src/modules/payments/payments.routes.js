const express = require("express");
const router = express.Router();
const paymentController = require("./payments.controller");

// POST /v1/payments -> Naya payment lene ke liye
router.post("/", paymentController.collectPayment);

// GET /v1/payments/ledger -> Saari history dekhne ke liye
router.get("/ledger", paymentController.getLedger);

module.exports = router;