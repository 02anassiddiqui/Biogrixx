// backend/api/src/modules/gas-usage/gas-usage.validation.js

exports.validateUsage = (data) => {
  const errors = [];
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  // 1. Meter ID Validation
  if (!data.meter_id) {
    errors.push("Meter ID is required for synchronization.");
  } else if (!uuidRegex.test(data.meter_id)) {
    errors.push("Invalid Meter ID format provided.");
  }

  // 2. Worker ID Validation
  if (!data.entered_by) {
    errors.push("Field agent identity (entered_by) is missing.");
  } else if (!uuidRegex.test(data.entered_by)) {
    errors.push("Invalid Agent ID format.");
  }

  // 3. Current Reading Validation
  if (
    data.current_reading === undefined ||
    data.current_reading === null ||
    data.current_reading === ""
  ) {
    errors.push("Current meter reading is mandatory.");
  } else if (isNaN(data.current_reading)) {
    errors.push("Meter reading must be a valid numeric value.");
  }

  // 4. Image URL Validation (Evidence)
  if (!data.image_url) {
    errors.push("Visual evidence (photo) is required for verification.");
  }

  return { isValid: errors.length === 0, errors };
};
