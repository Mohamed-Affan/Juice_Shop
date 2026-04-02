const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../controllers/auth.controller');
const { loginRules, changePasswordRules, validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', loginRules, validate, login);

// PUT /api/auth/change-password
router.put('/change-password', authenticate, changePasswordRules, validate, changePassword);

module.exports = router;
