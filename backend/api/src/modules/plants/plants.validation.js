const Joi = require("joi");

const createPlantSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Plant name is required",
  }),
  village_name: Joi.string().required(),
  capacity: Joi.number().precision(2).required(),
  installer_name: Joi.string().allow(null, ""),
  status: Joi.string()
    .valid("active", "maintenance", "offline")
    .default("active"),
});

module.exports = { createPlantSchema };
