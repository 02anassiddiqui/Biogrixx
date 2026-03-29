/**
 * Customers routes.
 */

const express = require('express');
const router = express.Router();
const customersController = require('./customers.controller');
const { createCustomerSchema } = require('./customers.validation');
const { authGuard } = require('../../middleware/auth'); // 👈 1. Auth Guard import kiya

// Middleware function: Jo data check karega
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  next();
};

// --- ROUTES ---

// 1. POST: Register Route (Public - Kisan form bhar sakein)
// Isme validation hai par auth ki zaroorat nahi
router.post('/register', validate(createCustomerSchema), customersController.createCustomer);

// 2. GET: Saari leads fetch karna (Secure - Sirf Admin ke liye)
// 👈 2. Yahan authGuard add kiya
router.get('/', authGuard, customersController.getCustomers);

// 3. DELETE: Lead delete karna (Secure - Sirf Admin ke liye)
// 👈 3. Naya delete route banaya authGuard ke saath
router.delete('/:id', authGuard, customersController.deleteCustomer);

module.exports = router;