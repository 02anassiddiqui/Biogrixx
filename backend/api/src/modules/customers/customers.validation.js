/**
 * Customers validation.
 * TODO: Add request validation for create, update, list.
 */
const Joi = require('joi');

const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': "Bhai, naam likhna zaroori hai!",
    'string.min': "Naam kam se kam 3 letters ka hona chahiye."
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': "Phone number 10 digits ka hona chahiye (sirf numbers)."
  }),
  village: Joi.string().required(),
  livestock_count: Joi.number().min(0).required(),
  role: Joi.string().valid('farmer', 'entrepreneur', 'ngo', 'other').default('farmer'),
  message: Joi.string().allow('', null),
  location_details: Joi.string().allow('', null)
});

module.exports = { createCustomerSchema };