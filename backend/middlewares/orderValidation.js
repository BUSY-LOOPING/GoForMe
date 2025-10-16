import { body, param } from 'express-validator';

export const validateCreateOrder = [
  body('service_id')
    .isInt({ min: 1 })
    .withMessage('Valid service ID is required'),
  body('delivery_address')
    .notEmpty()
    .withMessage('Delivery address is required'),
  body('contact_phone')
    .optional()
    .notEmpty()
    .withMessage('Contact phone cannot be empty if provided'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('special_instructions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Special instructions cannot exceed 1000 characters'),
  body('form_data')
    .optional()
    .isObject()
    .withMessage('Form data must be an object'),
  body('preferred_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('preferred_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)')
];

export const validateUpdateOrder = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  body('delivery_address')
    .optional()
    .notEmpty()
    .withMessage('Delivery address cannot be empty'),
  body('special_instructions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Special instructions cannot exceed 1000 characters')
];

export const validateUpdateOrderStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  body('status')
    .isIn(['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refunded']) 
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

export const validateAssignRunner = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  body('runner_id')
    .isInt({ min: 1 })
    .withMessage('Valid runner ID is required')
];
