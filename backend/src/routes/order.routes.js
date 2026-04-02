const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { orderRules, validate } = require('../middleware/validator');
const { getActive, getRecent, create, complete, clearAll } = require('../controllers/order.controller');

// GET /api/orders/active — kitchen and admin
router.get('/active', authenticate, authorize('kitchen', 'admin'), getActive);

// GET /api/orders/recent — admin only
router.get('/recent', authenticate, authorize('admin'), getRecent);

// POST /api/orders — POS and admin can place orders
router.post('/', authenticate, authorize('pos', 'admin'), orderRules, validate, create);

// PUT /api/orders/:id/complete — kitchen and admin
router.put('/:id/complete', authenticate, authorize('kitchen', 'admin'), complete);
router.delete('/all', authenticate, authorize('admin'), clearAll);

module.exports = router;
