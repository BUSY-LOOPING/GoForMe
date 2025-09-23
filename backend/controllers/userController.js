import userService from '../services/userService.js';
import { validationResult } from 'express-validator';

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const user = await userService.updateProfile(req.user.id, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfileImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const imagePath = `/uploads/profiles/${req.file.filename}`;
      const user = await userService.updateProfileImage(req.user.id, imagePath);

      res.json({
        success: true,
        message: 'Profile image updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRoles(req, res, next) {
    try {
      const roles = await userService.getUserRoles(req.user.id);

      res.json({
        success: true,
        data: { roles }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
