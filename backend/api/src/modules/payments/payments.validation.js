// backend/api/src/modules/payments/payment.validation.js

exports.validatePayment = (data) => {
  const errors = [];

  if (!data.bill_id) {
    errors.push("Payment reference (Bill ID) is mandatory.");
  }

  if (!data.amount_paid || data.amount_paid <= 0) {
    errors.push("A valid payment amount is required for this transaction.");
  }

  if (!data.payment_method) {
    errors.push(
      "Please specify the payment method (e.g., Cash, UPI, or Bank Transfer).",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
