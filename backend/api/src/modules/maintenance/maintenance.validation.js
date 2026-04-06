exports.validateMaintenanceLog = (data) => {
  const errors = [];
  if (!data.assigned_to) errors.push("Technician name is required.");
  if (!data.task_type) errors.push("Task type (Corrective/Preventive) is required.");
  if (!data.scheduled_date) errors.push("Scheduled date is required.");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};