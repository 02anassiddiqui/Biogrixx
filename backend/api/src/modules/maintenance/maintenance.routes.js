const express = require("express");
const router = express.Router();
const maintenanceController = require("./maintenance.controller");

// POST /v1/maintenance -> Create a new work order
router.post("/", maintenanceController.assignTechnician);

// GET /v1/maintenance -> Get all maintenance logs
router.get("/", maintenanceController.getLogs);

// PATCH /v1/maintenance/:id -> Update status or add work notes
router.patch("/:id", maintenanceController.updateTask);

module.exports = router;