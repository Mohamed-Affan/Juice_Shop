const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboard } = require('../controllers/report.controller');

// GET /api/reports/dashboard — admin only
router.get('/dashboard', authenticate, authorize('admin'), getDashboard);

module.exports = router;
