const Joi = require('joi');

const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  village_id: Joi.string().uuid().required(),
  plant_id: Joi.string().uuid().required(),
  meter_number: Joi.string().min(4).required(),
  livestock_count: Joi.number().min(0).default(0),
});

module.exports = { createCustomerSchema };