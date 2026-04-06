const express = require('express');
const router = express.Router();
const customersController = require('./customers.controller');
const { authGuard } = require('../../middleware/auth');

// GET: /v1/customers (Secure route for Admin)
router.get('/', authGuard, customersController.getAllCustomers);

router.delete('/:id', authGuard, customersController.deleteCustomer);

module.exports = router;