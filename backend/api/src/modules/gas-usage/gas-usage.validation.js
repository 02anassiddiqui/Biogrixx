/**
 * Biogrix Gas Usage Validation Logic
 */

exports.validateUsage = (data) => {
  const errors = [];
  
  // UUID format check (Supabase IDs ke liye)
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  // 1. Meter ID Validation
  if (!data.meter_id) {
    errors.push("Bhai, Meter ID toh dalo! Bina hardware identity ke reading save nahi hogi.");
  } else if (!uuidRegex.test(data.meter_id)) {
    errors.push("Bhai, ye Meter ID valid format mein nahi hai.");
  }

  // 2. Current Reading Validation
  if (data.current_reading === undefined || data.current_reading === null || data.current_reading === "") {
    errors.push("Bhai, Current Reading dalna zaroori hai.");
  } else if (isNaN(data.current_reading)) {
    errors.push("Reading hamesha number mein honi chahiye.");
  } else if (parseFloat(data.current_reading) < 0) {
    errors.push("Reading negative nahi ho sakti, bhai!");
  }

  // 3. Image URL (Optional check)
  if (data.image_url && typeof data.image_url !== 'string') {
    errors.push("Invalid image URL format.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};