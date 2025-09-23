import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { 
  validateCreatePaymentIntent,
  validateSavePaymentMethod,
  validateProcessRefund
} from '../middlewares/paymentValidation.js';

const router = express.Router();

router.get('/config', paymentController.getPublishableKey);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);

router.post('/create-payment-intent', 
  authenticateToken, 
  validateCreatePaymentIntent, 
  paymentController.createPaymentIntent
);

router.post('/confirm-payment', 
  authenticateToken, 
  paymentController.confirmPayment
);

router.post('/save-payment-method', 
  authenticateToken, 
  validateSavePaymentMethod, 
  paymentController.savePaymentMethod
);

router.get('/payment-methods', 
  authenticateToken, 
  paymentController.getPaymentMethods
);

router.delete('/payment-methods/:payment_method_id', 
  authenticateToken, 
  paymentController.deletePaymentMethod
);

router.post('/set-default-payment-method', 
  authenticateToken, 
  paymentController.setDefaultPaymentMethod
);

router.post('/refund/:payment_id', 
  authenticateToken, 
  authorize('admin'), 
  validateProcessRefund, 
  paymentController.processRefund
);

export default router;
