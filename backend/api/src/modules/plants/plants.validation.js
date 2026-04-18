// backend/api/src/modules/plants/plants.validation.js
const Joi = require("joi");

const createPlantSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Plant designation name is required.",
    "string.min": "Plant name must be at least 3 characters long.",
  }),
  village_name: Joi.string().required().messages({
    "string.empty": "Village hub designation is required.",
  }),
  capacity: Joi.number().precision(2).required().messages({
    "number.base": "Plant capacity must be a valid numeric value.",
    "any.required": "Production capacity (m³) is required.",
  }),
  installer_name: Joi.string().allow(null, ""),
  status: Joi.string()
    .valid("active", "maintenance", "offline")
    .default("active")
    .messages({
      "any.only": "Invalid status. Must be active, maintenance, or offline.",
    }),
});

module.exports = { createPlantSchema };
