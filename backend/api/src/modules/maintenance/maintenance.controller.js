const maintenanceService = require("./maintenance.service");
const { validateMaintenanceLog } = require("./maintenance.validation");

exports.assignTechnician = async (req, res) => {
  try {
    const { isValid, errors } = validateMaintenanceLog(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    const data = await maintenanceService.scheduleTask(req.body);
    res.status(201).json({ success: true, message: "Technician assigned successfully!", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const data = await maintenanceService.getWorkOrders();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await maintenanceService.updateJobProgress(id, req.body);
    res.status(200).json({ success: true, message: "Work order updated!", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};