const maintenanceRepo = require("./maintenance.repository");

exports.scheduleTask = async (data) => {
  return await maintenanceRepo.create(data);
};

exports.getWorkOrders = async () => {
  return await maintenanceRepo.findAll();
};

exports.updateJobProgress = async (id, updateData) => {
  return await maintenanceRepo.updateStatus(id, updateData);
};