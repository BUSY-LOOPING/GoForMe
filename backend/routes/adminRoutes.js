import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard/stats', 
  authenticateToken, 
  authorize('admin'), 
  adminController.getDashboardStats
);

//user management
router.get('/users', 
  authenticateToken, 
  authorize('admin'), 
  adminController.getAllUsers
);

router.get('/users/:id', 
  authenticateToken, 
  authorize('admin'), 
  adminController.getUserById
);

router.post('/users', 
  authenticateToken, 
  authorize('admin'), 
  adminController.createUser
);

router.put('/users/:id', 
  authenticateToken, 
  authorize('admin'), 
  adminController.updateUser
);

router.patch('/users/:id/status', 
  authenticateToken, 
  authorize('admin'), 
  adminController.toggleUserStatus
);

router.delete('/users/:id', 
  authenticateToken, 
  authorize('admin'), 
  adminController.deleteUser
);

// Role Management
router.post('/users/:id/roles', 
  authenticateToken, 
  authorize('admin'), 
  adminController.assignRole
);

router.delete('/users/:id/roles/:role', 
  authenticateToken, 
  authorize('admin'), 
  adminController.removeRole
);

export default router;
