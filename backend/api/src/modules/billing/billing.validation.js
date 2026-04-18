// backend/api/src/modules/billing/billing.validation.js

exports.validateStatusUpdate = (data) => {
  const errors = [];
  const validStatuses = ["paid", "unpaid", "cancelled"];

  // Check if status exists and is one of the permitted values
  if (!data.status) {
    errors.push("Payment status is required.");
  } else if (!validStatuses.includes(data.status)) {
    errors.push(
      "Invalid status provided. Please use: paid, unpaid, or cancelled.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
