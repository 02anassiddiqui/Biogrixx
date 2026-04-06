const express = require("express");
const router = express.Router();
const reportsController = require("./reports.controller");

router.get("/summary", reportsController.getReports);

module.exports = router;