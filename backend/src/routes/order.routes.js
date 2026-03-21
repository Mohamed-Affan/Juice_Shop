const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { orderRules, validate } = require('../middleware/validator');
const { getPending, getCompleted, create, complete } = require('../controllers/order.controller');

// GET /api/orders/pending — kitchen and admin
router.get('/pending', authenticate, authorize('kitchen', 'admin'), getPending);

// GET /api/orders/completed — admin only
router.get('/completed', authenticate, authorize('admin'), getCompleted);

// POST /api/orders — POS and admin can place orders
router.post('/', authenticate, authorize('pos', 'admin'), orderRules, validate, create);

// PUT /api/orders/:id/complete — kitchen and admin
router.put('/:id/complete', authenticate, authorize('kitchen', 'admin'), complete);

module.exports = router;
