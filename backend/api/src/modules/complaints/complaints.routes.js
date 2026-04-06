const express = require("express");
const router = express.Router();
const complaintController = require("./complaints.controller");

// 🌐 Public Route (Kisan website se bina login ke kar sakega)
router.post("/public", complaintController.publicSubmit);

// 🛠 Admin Routes (Dashboard ke liye)
router.get("/", complaintController.adminList);
router.patch("/:id/status", complaintController.updateStatus);

module.exports = router;