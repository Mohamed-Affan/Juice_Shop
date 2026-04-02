const { body, validationResult } = require('express-validator');

// Run validation and return errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

// Validation rules for login
const loginRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 1, max: 50 }).withMessage('Username must be 1-50 characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 1, max: 100 }).withMessage('Password must be 1-100 characters'),
];

// Validation rules for menu items
const menuRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Item name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Item name must be 1-50 characters'),
    body('price')
        .isNumeric().withMessage('Price must be a number')
        .custom(val => val > 0).withMessage('Price must be greater than 0'),
    body('image_url')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isURL().withMessage('Image URL must be a valid URL'),
];

// Validation rules for creating orders
const orderRules = [
    body('table_number')
        .isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
    body('order_type')
        .optional()
        .trim()
        .isIn(['dine-in', 'takeaway']).withMessage('Order type must be dine-in or takeaway'),
    body('items')
        .isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.menu_id')
        .notEmpty().withMessage('Each item must have a menu_id'),
    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const changePasswordRules = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 1, max: 100 }).withMessage('New password must be at least 1 characters'),
];

module.exports = {
    validate,
    loginRules,
    menuRules,
    orderRules,
    changePasswordRules,
};
