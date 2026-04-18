// backend/api/src/modules/maintenance/maintenance.validation.js

exports.validateMaintenanceLog = (data) => {
  const errors = [];

  if (!data.assigned_to || data.assigned_to.trim() === "") {
    errors.push("Technician assignment is required.");
  }

  if (!data.task_type) {
    errors.push("Maintenance task type must be specified.");
  }

  if (!data.scheduled_date) {
    errors.push("A valid scheduled date is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
