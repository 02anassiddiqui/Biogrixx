/**
 * Customers routes.
 */

const express = require('express');
const router = express.Router();
const leadsController = require('./leads.controller');
const { createLeadSchema } = require('./leads.validation');
const { authGuard } = require('../../middleware/authMiddleware'); // 👈 1. Auth Guard import kiya

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
router.post('/register', validate(createLeadSchema), leadsController.registerLead);

// 2. GET: Saari leads fetch karna (Secure - Sirf Admin ke liye)
// 👈 2. Yahan authGuard add kiya
router.get('/', authGuard, leadsController.getAllLeads);

// 3. DELETE: Lead delete karna (Secure - Sirf Admin ke liye)
// 👈 3. Naya delete route banaya authGuard ke saath
router.delete('/:id', authGuard, leadsController.deleteLead);

router.patch('/:id/status', authGuard, leadsController.updateStatus);

// ✅ Ye file leads.routes.js honi chahiye!
router.post('/:id/convert', authGuard, leadsController.convertToCustomer);

module.exports = router;