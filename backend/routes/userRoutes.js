import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateUpdateProfile } from '../middlewares/validation.js';
import upload from '../utils/uploadHandler.js';

const router = express.Router();

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, userController.updateProfile);
router.post('/profile/image', authenticateToken, upload.single('profile_image'), userController.updateProfileImage);
router.get('/roles', authenticateToken, userController.getUserRoles);

export default router;
