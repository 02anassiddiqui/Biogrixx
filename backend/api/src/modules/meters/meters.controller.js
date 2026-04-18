const meterService = require("./meters.service");
const { validateRegister, validateAssignment } = require("./meters.validation");

exports.getAllMeters = async (req, res) => {
  try {
    const meters = await meterService.getAllMeters();
    return res.status(200).json({ success: true, data: meters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🚀 NEW: Get Meters assigned to a specific worker
exports.getAssignedMeters = async (req, res) => {
  try {
    const { worker_id } = req.query;
    if (!worker_id)
      return res
        .status(400)
        .json({ success: false, message: "Worker ID missing" });
    const meters = await meterService.getMetersByWorker(worker_id);
    return res.status(200).json({ success: true, data: meters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerMeter = async (req, res) => {
  try {
    const { isValid, errors } = validateRegister(req.body);
    if (!isValid)
      return res.status(400).json({ success: false, message: errors[0] });
    const meter = await meterService.registerMeter(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Meter added to inventory",
        data: meter,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignMeter = async (req, res) => {
  try {
    const { isValid, errors } = validateAssignment(req.body);
    if (!isValid)
      return res.status(400).json({ success: false, message: errors[0] });

    const result = await meterService.assignMeterToCustomer(req.body);
    return res
      .status(200)
      .json({
        success: true,
        message: "Hardware & Agent assigned successfully!",
        data: result,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMeter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMeter = await meterService.updateMeter(id, req.body);
    return res
      .status(200)
      .json({ success: true, message: "Meter updated!", data: updatedMeter });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingMeters = async (req, res) => {
  try {
    const pendingMeters = await meterService.getPendingMeters();
    return res.status(200).json({ success: true, data: pendingMeters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMeter = async (req, res) => {
  try {
    const { id } = req.params;
    await meterService.deleteMeter(id);
    return res.status(200).json({ success: true, message: "Meter deleted!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
