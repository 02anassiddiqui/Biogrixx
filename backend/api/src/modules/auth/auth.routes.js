const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { validateLogin, validateChangePassword } = require('./auth.validation');
const { authGuard } = require('../../middleware/authMiddleware');

router.post('/login', validateLogin, authController.login);
router.post('/change-password', authGuard, validateChangePassword, authController.changePassword);

module.exports = router;