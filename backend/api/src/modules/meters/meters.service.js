// backend/api/src/modules/meters/meters.service.js
const meterRepo = require("./meters.repository");

exports.getAllMeters = async () => {
  return await meterRepo.findAll();
};

exports.registerMeter = async (meterData) => {
  return await meterRepo.create(meterData);
};

// ✅ Add this function
exports.getPendingMeters = async () => {
  // Repository se data mango
  return await meterRepo.findPendingReadings();
};

// ✅ NAYA FUNCTION: Jo controller call kar raha hai
exports.updateMeter = async (meterId, updateData) => {
  if (!meterId) throw new Error("Meter ID zaroori hai update ke liye.");
  
  // Repository ko call karo data update karne ke liye
  return await meterRepo.update(meterId, updateData);
};

exports.assignMeterToCustomer = async (assignmentData) => {
  const { meter_id, customer_id, installation_date } = assignmentData;

  const meterList = await meterRepo.findAll();
  const targetMeter = meterList.find(m => m.id === meter_id);

  if (!targetMeter) throw new Error("Bhai, ye meter system mein mila hi nahi!");

  if (targetMeter.status !== 'available') {
    throw new Error(`Bhai, ye meter (${targetMeter.serial_number}) pehle se hi active hai!`);
  }

  return await meterRepo.assignToCustomer(
    meter_id,
    customer_id,
    targetMeter.serial_number,
    installation_date
  );
};

// ✅ Ye function add karo
exports.deleteMeter = async (id) => {
  if (!id) throw new Error("Bhai, Meter ID bhejna zaroori hai!");
  
  // Repository ke delete function ko call karo
  return await meterRepo.delete(id);
};