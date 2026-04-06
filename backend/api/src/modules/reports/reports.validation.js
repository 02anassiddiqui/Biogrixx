exports.validateReportQuery = (query) => {
  const errors = [];
  if (query.startDate && isNaN(Date.parse(query.startDate))) {
    errors.push("Invalid Start Date format.");
  }
  if (query.endDate && isNaN(Date.parse(query.endDate))) {
    errors.push("Invalid End Date format.");
  }
  return { isValid: errors.length === 0, errors };
};