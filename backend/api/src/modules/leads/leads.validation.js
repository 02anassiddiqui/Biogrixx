const Joi = require("joi");

const createLeadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full Name is a required field.",
    "string.min": "Full Name must be at least 3 characters long.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  village: Joi.string().required().messages({
    "string.empty": "Village name is required.",
  }),
  livestock_count: Joi.number().min(0).required().messages({
    "number.base": "Livestock count must be a number.",
    "number.min": "Livestock count cannot be negative.",
  }),
  role: Joi.string()
    .valid("farmer", "entrepreneur", "ngo", "other")
    .default("farmer"),
  message: Joi.string().allow("", null),
  location_details: Joi.string().allow("", null).required().messages({
    "string.empty": "District and State details are required.",
  }),
});

module.exports = { createLeadSchema };
// ! I do changes in the this file, if any error appear that means this file is the reason.
