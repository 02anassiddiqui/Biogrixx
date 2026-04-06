exports.validateComplaint = (data) => {
  const errors = [];
  if (!data.name) errors.push("Kisan ka naam zaroori hai");
  if (!data.phone || data.phone.length < 10) errors.push("Sahi phone number dalein");
  if (!data.issue_type) errors.push("Issue type (Leakage/Pressure etc) select karein");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};