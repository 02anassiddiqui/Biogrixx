const express = require('express');
const router = express.Router();
const plantsController = require('./plants.controller');
const { createPlantSchema } = require('./plants.validation');
const { authGuard } = require('../../middleware/auth');

// Middleware for validation
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

// Routes
router.post('/register', authGuard, validate(createPlantSchema), plantsController.createPlant);
router.get('/', authGuard, plantsController.getAllPlants);
router.delete('/:id', authGuard, plantsController.deletePlant);
router.patch('/:id/status', authGuard, plantsController.updateStatus);

module.exports = router;