const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { menuRules, validate } = require('../middleware/validator');
const { getAll, create, update, remove } = require('../controllers/menu.controller');

// GET /api/menu — all authenticated users can view menu
router.get('/', authenticate, getAll);

// POST /api/menu — admin only
router.post('/', authenticate, authorize('admin'), menuRules, validate, create);

// PUT /api/menu/:id — admin only
router.put('/:id', authenticate, authorize('admin'), menuRules, validate, update);

// DELETE /api/menu/:id — admin only
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
