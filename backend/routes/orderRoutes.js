import express from 'express';
import orderController from '../controllers/orderController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { 
  validateCreateOrder,
  validateUpdateOrder,
  validateUpdateOrderStatus,
  validateAssignRunner
} from '../middlewares/orderValidation.js';

const router = express.Router();

router.post('/', 
  authenticateToken, 
  validateCreateOrder, 
  orderController.createOrder
);

router.get('/', 
  authenticateToken, 
  orderController.getUserOrders
);

router.get('/:id', 
  authenticateToken, 
  orderController.getOrderById
);

router.patch('/:id/cancel', 
  authenticateToken, 
  orderController.cancelOrder
);

router.post('/:id/rate', 
  authenticateToken, 
  orderController.rateOrder
);

router.post('/pricing-preview', 
  authenticateToken, 
  orderController.getPricingPreview);

// Runner
router.get('/available/list', 
  authenticateToken, 
  authorize('runner'), 
  orderController.getAvailableOrders
);

router.post('/:id/accept', 
  authenticateToken, 
  authorize('runner'), 
  orderController.acceptOrder
);

router.patch('/:id/status', 
  authenticateToken, 
  authorize('runner'), 
  validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

// Admin
router.get('/admin/all', 
  authenticateToken, 
  authorize('admin'), 
  orderController.getAllOrders
);

router.patch('/:id/assign-runner', 
  authenticateToken, 
  authorize('admin'), 
  validateAssignRunner,
  orderController.assignRunner
);

router.put('/:id', 
  authenticateToken, 
  authorize('admin'), 
  validateUpdateOrder,
  orderController.updateOrder
);

export default router;
