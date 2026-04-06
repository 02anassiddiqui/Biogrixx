// backend/api/src/modules/meters/meters.validation.js

exports.validateRegister = (data) => {
  const errors = [];
  if (!data.serial_number || data.serial_number.trim() === "") {
    errors.push(
      "Bhai, Serial Number toh dalo! Bina identity ke meter register nahi hoga.",
    );
  } else if (data.serial_number.length < 5) {
    errors.push(
      "Serial Number thoda lamba hona chahiye (Minimum 5 characters).",
    );
  }
  if (!data.plant_id) {
    errors.push("Bhai, batana padega ki ye meter kis Plant unit ka hai.");
  }
  return { isValid: errors.length === 0, errors };
};

exports.validateAssignment = (data) => {
  const errors = [];
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!data.meter_id || !uuidRegex.test(data.meter_id))
    errors.push("Invalid Meter ID.");
  if (!data.customer_id || !uuidRegex.test(data.customer_id))
    errors.push("Invalid Customer ID.");
  if (!data.serial_number)
    errors.push("Serial Number confirmation is required.");
  if (!data.installation_date)
    errors.push(
      "Bhai, Installation date dalna zaroori hai tabhi record poora hoga.",
    );

  return { isValid: errors.length === 0, errors };
};
