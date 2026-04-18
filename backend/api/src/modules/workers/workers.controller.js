// backend/api/src/modules/worker/worker.controller.js
const workerService = require("./workers.service");
const {
  registerWorkerSchema,
  updateWorkerSchema,
  loginWorkerSchema,
} = require("./workers.validation");

exports.listWorkers = async (req, res) => {
  try {
    const data = await workerService.getAllWorkers();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addWorker = async (req, res) => {
  try {
    const { error } = registerWorkerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const data = await workerService.register(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const { error } = updateWorkerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const data = await workerService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginWorkerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const worker = await workerService.login(req.body.phone, req.body.password);
    res.json({ success: true, data: worker });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
