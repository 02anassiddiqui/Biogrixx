// backend/api/src/modules/meters/meter.validation.js

exports.validateRegister = (data) => {
  const errors = [];
  if (!data.serial_number || data.serial_number.trim() === "") {
    errors.push("Meter serial number is required.");
  } else if (data.serial_number.length < 5) {
    errors.push("Serial number must be at least 5 characters long.");
  }
  if (!data.plant_id) {
    errors.push("Please select a plant unit for this hardware.");
  }
  return { isValid: errors.length === 0, errors };
};

exports.validateAssignment = (data) => {
  const errors = [];
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!data.meter_id || !uuidRegex.test(data.meter_id))
    errors.push("Invalid Hardware identification.");
  if (!data.customer_id || !uuidRegex.test(data.customer_id))
    errors.push("Invalid Customer identification.");
  if (!data.assigned_worker_id || !uuidRegex.test(data.assigned_worker_id))
    errors.push("Field Agent selection is required for installation.");
  if (!data.serial_number)
    errors.push("Serial number verification is mandatory.");
  if (!data.installation_date) errors.push("Installation date is required.");

  return { isValid: errors.length === 0, errors };
};
