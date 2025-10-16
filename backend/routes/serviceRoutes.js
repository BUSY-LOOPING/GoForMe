import express from 'express';
import serviceController from '../controllers/serviceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { 
  validateCreateCategory, 
  validateUpdateCategory,
  validateCreateService,
  validateUpdateService,
  validateCreateServiceField,
  validateUpdateServiceField
} from '../middlewares/serviceValidation.js';

const router = express.Router();

// ===== CATEGORY ROTES =====
router.get('/categories', serviceController.getAllCategories);
router.get('/categories/:id', serviceController.getCategoryById);
router.get('/categories/slug/:slug', serviceController.getCategoryBySlug);

router.post('/categories', 
  authenticateToken, 
  authorize('admin'), 
  validateCreateCategory, 
  serviceController.createCategory
);
router.put('/categories/:id', 
  authenticateToken, 
  authorize('admin'), 
  validateUpdateCategory, 
  serviceController.updateCategory
);
router.delete('/categories/:id', 
  authenticateToken, 
  authorize('admin'), 
  serviceController.deleteCategory
);

router.get('/search', serviceController.searchServices);
router.get('/featured', serviceController.getFeaturedServices);

// router.get('/:id/includes', serviceController.getServiceIncludes);
router.get('/:serviceId/fields', serviceController.getServiceFields);
router.post('/:serviceId/pricing', serviceController.getServicePricing);
router.post('/:serviceId/validate', serviceController.validateServiceData);

router.post('/:serviceId/fields', 
  authenticateToken, 
  authorize('admin'), 
  validateCreateServiceField, 
  serviceController.createServiceField
);
router.put('/fields/:fieldId', 
  authenticateToken, 
  authorize('admin'), 
  validateUpdateServiceField, 
  serviceController.updateServiceField
);
router.delete('/fields/:fieldId', 
  authenticateToken, 
  authorize('admin'), 
  serviceController.deleteServiceField
);

router.get('/category/:categoryId', serviceController.getServicesByCategory);
router.get('/slug/:slug', serviceController.getServiceBySlug);

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.post('/', 
  authenticateToken, 
  authorize('admin'), 
  validateCreateService, 
  serviceController.createService
);
router.put('/:id', 
  authenticateToken, 
  authorize('admin'), 
  validateUpdateService, 
  serviceController.updateService
);
router.delete('/:id', 
  authenticateToken, 
  authorize('admin'), 
  serviceController.deleteService
);

export default router;
