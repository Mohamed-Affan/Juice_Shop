const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { menuRules, validate } = require('../middleware/validator');
const { getAll, create, update, remove, uploadImage, clearAll } = require('../controllers/menu.controller');
const upload = require('../middleware/upload');

// GET /api/menu — all authenticated users can view menu
router.get('/', authenticate, getAll);

// POST /api/menu/upload — image upload
router.post('/upload', authenticate, authorize('admin'), upload.single('image'), uploadImage);

// POST /api/menu — admin only
router.post('/', authenticate, authorize('admin'), menuRules, validate, create);

// PUT /api/menu/:id — admin only
router.put('/:id', authenticate, authorize('admin'), menuRules, validate, update);

// DELETE /api/menu/all — admin only
router.delete('/all', authenticate, authorize('admin'), clearAll);

// DELETE /api/menu/:id — admin only
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
