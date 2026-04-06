// backend/api/src/modules/gas-usage/gas-usage.service.js

const usageRepo = require("./gas-usage.repository");
const meterRepo = require("../meters/meters.repository");

exports.recordNewReading = async (inputData) => {
  const { meter_id, current_reading, image_url } = inputData;

  // 1. Meter aur Previous Reading fetch karo
  const meters = await meterRepo.findAll();
  const meter = meters.find(m => m.id === meter_id);

  if (!meter) throw new Error("Meter not found in inventory!");
  if (!meter.customer_id) throw new Error("This meter is not assigned to any customer!");

  const prev = parseFloat(meter.last_reading || 0);
  const curr = parseFloat(current_reading);

  // 2. 🛡️ Validation
  if (curr < prev) {
    throw new Error(`Invalid Reading: Current (${curr}) cannot be less than Previous (${prev})`);
  }

  // 3. 🧮 Calculate Consumption
  const consumption = curr - prev;

  // 4. Save to DB via Repository
  return await usageRepo.createReading({
    meter_id,
    customer_id: meter.customer_id,
    previous_reading: prev,
    current_reading: curr,
    consumption: consumption, // ✅ Pass to Repo
    image_url
  });
};

exports.getAllReadings = async () => {
  return await usageRepo.findAll();
};