const meterRepo = require("./meters.repository");

exports.getAllMeters = async () => {
  return await meterRepo.findAll();
};

exports.getMetersByWorker = async (workerId) => {
  return await meterRepo.findByWorker(workerId);
}; // 🚀 Added

exports.registerMeter = async (meterData) => {
  return await meterRepo.create(meterData);
};

exports.getPendingMeters = async () => {
  return await meterRepo.findPendingReadings();
};

exports.updateMeter = async (meterId, updateData) => {
  return await meterRepo.update(meterId, updateData);
};

exports.assignMeterToCustomer = async (assignmentData) => {
  const { meter_id, customer_id, assigned_worker_id, installation_date } =
    assignmentData; // 🚀 Accept Worker ID

  const meterList = await meterRepo.findAll();
  const targetMeter = meterList.find((m) => m.id === meter_id);

  if (!targetMeter) throw new Error("Bhai, meter system mein nahi hai!");
  if (targetMeter.status !== "available")
    throw new Error("Meter pehle se hi active hai!");

  return await meterRepo.assignToCustomer(
    meter_id,
    customer_id,
    assigned_worker_id, // 🚀 Passing to Repo
    targetMeter.serial_number,
    installation_date,
  );
};

exports.deleteMeter = async (id) => {
  return await meterRepo.delete(id);
};
