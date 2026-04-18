// backend/api/src/modules/leads/leads.validation.js
const Joi = require("joi");

const createLeadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full Name is required for project registration.",
    "string.min": "Full Name must be at least 3 characters long.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid 10-digit mobile number.",
      "any.required": "Phone number is required for follow-up.",
    }),
  village: Joi.string().required().messages({
    "string.empty": "Village or Community name is mandatory.",
  }),
  livestock_count: Joi.number().min(0).required().messages({
    "number.base": "Livestock count must be a numeric value.",
    "number.min": "Livestock count cannot be negative.",
  }),
  role: Joi.string()
    .valid("farmer", "entrepreneur", "ngo", "other")
    .default("farmer"),
  message: Joi.string().allow("", null),
  location_details: Joi.string().allow("", null).required().messages({
    "string.empty":
      "District and State details are required for regional mapping.",
  }),
});

module.exports = { createLeadSchema };
