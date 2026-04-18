// backend/api/src/modules/complaints/complaints.validation.js

exports.validateComplaint = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Customer name is required.");
  }

  if (!data.phone || data.phone.length < 10) {
    errors.push("Please enter a valid 10-digit phone number.");
  }

  if (!data.issue_type) {
    errors.push("Please select an issue category.");
  }

  if (!data.village) {
    errors.push("Village name is required for field support.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
