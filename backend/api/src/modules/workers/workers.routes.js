// backend/api/src/modules/worker/worker.routes.js
const express = require("express");
const router = express.Router();
const workerController = require("./workers.controller");

router.get("/", workerController.listWorkers);
router.post("/register", workerController.addWorker);
router.patch("/:id", workerController.updateWorker); // 🚀 Update Route
router.post("/login", workerController.login);

module.exports = router;
