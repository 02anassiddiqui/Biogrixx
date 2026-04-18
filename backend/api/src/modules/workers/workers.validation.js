// backend/api/src/modules/worker/worker.validation.js
const Joi = require("joi");

const registerWorkerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(4).max(8).required(),
});

const updateWorkerSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional(),
  password: Joi.string().min(4).max(8).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});

const loginWorkerSchema = Joi.object({
  phone: Joi.string().length(10).required(),
  password: Joi.string().required(),
});

module.exports = { registerWorkerSchema, updateWorkerSchema, loginWorkerSchema };