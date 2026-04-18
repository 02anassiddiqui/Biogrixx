// backend/api/src/modules/gas-usage/gas-usage.service.js
const usageRepo = require("./gas-usage.repository");
const meterRepo = require("../meters/meters.repository");

exports.recordNewReading = async (inputData) => {
  const { meter_id, current_reading, image_url, entered_by } = inputData;

  // 1. Fetch Meter details
  const meters = await meterRepo.findAll();
  const meter = meters.find(m => m.id === meter_id);

  if (!meter) throw new Error("Meter not found in inventory!");
  if (!meter.customer_id) throw new Error("This meter is not assigned to any customer!");

  const prev = parseFloat(meter.last_reading || 0);
  const curr = parseFloat(current_reading);

  // 2. 🛡️ Validation: Lower reading check
  if (curr < prev) {
    throw new Error(`Invalid Reading: Current (${curr}) cannot be less than Previous (${prev})`);
  }

  const consumption = curr - prev;

  // 4. Save to DB via Repository
  return await usageRepo.createReading({
    meter_id,
    customer_id: meter.customer_id,
    previous_reading: prev,
    current_reading: curr,
    consumption: consumption,
    image_url,
    entered_by // 👈 Pass worker ID
  });
};

exports.getAllReadings = async () => {
  return await usageRepo.findAll();
};