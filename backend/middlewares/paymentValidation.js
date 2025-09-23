import { body, param } from 'express-validator';

export const validateCreatePaymentIntent = [
  body('order_id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  body('amount')
    .isFloat({ min: 0.50 })
    .withMessage('Amount must be at least $0.50'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters')
];

export const validateSavePaymentMethod = [
  body('payment_method_id')
    .notEmpty()
    .withMessage('Payment method ID is required')
    .matches(/^pm_/)
    .withMessage('Invalid payment method ID format')
];

export const validateProcessRefund = [
  param('payment_id')
    .isInt({ min: 1 })
    .withMessage('Valid payment ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Refund amount must be greater than 0'),
  body('reason')
    .optional()
    .isIn(['duplicate', 'fraudulent', 'requested_by_customer'])
    .withMessage('Invalid refund reason')
];
