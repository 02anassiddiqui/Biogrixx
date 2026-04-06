exports.validateStatusUpdate = (data) => {
  const errors = [];
  const validStatuses = ['paid', 'unpaid', 'cancelled'];

  if (!data.status || !validStatuses.includes(data.status)) {
    errors.push("Bhai, status sahi dalo (paid, unpaid, or cancelled)!");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};