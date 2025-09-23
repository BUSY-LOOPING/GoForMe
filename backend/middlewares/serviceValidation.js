import { body } from 'express-validator';

export const validateCreateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Icon must be less than 100 characters'),
  body('sort_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a positive integer')
];

export const validateUpdateCategory = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Icon must be less than 100 characters'),
  body('sort_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a positive integer'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

export const validateCreateService = [
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('base_price')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('price_type')
    .optional()
    .isIn(['fixed', 'hourly', 'per_item', 'custom'])
    .withMessage('Price type must be one of: fixed, hourly, per_item, custom'),
  body('estimated_duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer (minutes)'),
  body('requires_location')
    .optional()
    .isBoolean()
    .withMessage('requires_location must be a boolean'),
  body('allows_scheduling')
    .optional()
    .isBoolean()
    .withMessage('allows_scheduling must be a boolean')
];

export const validateUpdateService = [
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('base_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('price_type')
    .optional()
    .isIn(['fixed', 'hourly', 'per_item', 'custom'])
    .withMessage('Price type must be one of: fixed, hourly, per_item, custom'),
  body('estimated_duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer (minutes)'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

export const validateCreateServiceField = [
  body('field_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Field name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .withMessage('Field name must be a valid identifier'),
  body('field_type')
    .isIn(['text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'file', 'date', 'time', 'datetime'])
    .withMessage('Invalid field type'),
  body('field_label')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Field label must be between 2 and 100 characters'),
  body('is_required')
    .optional()
    .isBoolean()
    .withMessage('is_required must be a boolean'),
  body('sort_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a positive integer')
];

export const validateUpdateServiceField = [
  body('field_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Field name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .withMessage('Field name must be a valid identifier'),
  body('field_type')
    .optional()
    .isIn(['text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'file', 'date', 'time', 'datetime'])
    .withMessage('Invalid field type'),
  body('field_label')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Field label must be between 2 and 100 characters'),
  body('is_required')
    .optional()
    .isBoolean()
    .withMessage('is_required must be a boolean'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];
