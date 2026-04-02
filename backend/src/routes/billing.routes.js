const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getBill, markPaid, getRecentBills } = require('../controllers/billing.controller');

// GET /api/billing/recent — Fetch recent completed bills (admin/pos)
router.get('/recent', authenticate, authorize('admin', 'pos'), getRecentBills);

// GET /api/billing/:billNo — Fetch bill by bill number (any authenticated role)
router.get('/:billNo', authenticate, getBill);

// PUT /api/billing/:id/pay — Mark order as paid (pos or admin)
router.put('/:id/pay', authenticate, authorize('pos', 'admin'), markPaid);

module.exports = router;
