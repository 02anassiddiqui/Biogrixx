// backend/api/src/modules/customers/customers.validation.js
const Joi = require("joi");

const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Customer name must be at least 3 characters long.",
    "any.required": "Customer name is a required field.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid 10-digit phone number.",
      "any.required": "Phone number is required for grid synchronization.",
    }),

  village_id: Joi.string().uuid().required().messages({
    "string.uuid": "Invalid Village ID format.",
    "any.required": "Village link is required.",
  }),

  plant_id: Joi.string().uuid().required().messages({
    "string.uuid": "Invalid Plant ID format.",
    "any.required": "Plant assignment is required.",
  }),

  meter_number: Joi.string().min(4).required().messages({
    "any.required": "Meter serial number is required.",
  }),

  livestock_count: Joi.number().min(0).default(0).messages({
    "number.min": "Livestock count cannot be negative.",
  }),
});

module.exports = { createCustomerSchema };
