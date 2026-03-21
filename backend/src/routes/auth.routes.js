const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { loginRules, validate } = require('../middleware/validator');

// POST /api/auth/login
router.post('/login', loginRules, validate, login);

module.exports = router;
