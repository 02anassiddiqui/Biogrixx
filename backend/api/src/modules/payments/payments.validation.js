exports.validatePayment = (data) => {
  const errors = [];
  if (!data.bill_id) errors.push("Bill ID is required");
  if (!data.amount_paid || data.amount_paid <= 0) errors.push("Valid amount is required");
  if (!data.payment_method) errors.push("Payment method (Cash/UPI) is required");

  return {
    isValid: errors.length === 0,
    errors
  };
};