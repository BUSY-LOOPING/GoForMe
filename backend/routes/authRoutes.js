import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateRegister, validateLogin, validateChangePassword } from '../middlewares/validation.js';

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.post('/logout-all', authenticateToken, authController.logoutAll);
router.post('/change-password', authenticateToken, validateChangePassword, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.get('/profile', authenticateToken, authController.getProfile);

// Google
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent'
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

export default router;
