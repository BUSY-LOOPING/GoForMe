import { User, UserRole } from '../models/index.js';
import bcrypt from 'bcryptjs';

class UserService {
  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [{
        model: UserRole,
        as: 'roles',
        where: { is_active: true },
        required: false
      }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId, updateData) {
    const { first_name, last_name, phone, address, city, state, zip_code, date_of_birth } = updateData;
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      first_name,
      last_name,
      phone,
      address,
      city,
      state,
      zip_code,
      date_of_birth
    });

    return this.getUserById(userId);
  }

  async updateProfileImage(userId, imagePath) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ profile_image: imagePath });

    return this.getUserById(userId);
  }

  async addRole(userId, role, assignedBy = null) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existingRole = await UserRole.findOne({
      where: { user_id: userId, role }
    });

    if (existingRole) {
      if (!existingRole.is_active) {
        await existingRole.update({ is_active: true, assigned_by: assignedBy });
      }
      return existingRole;
    }

    return await UserRole.create({
      user_id: userId,
      role,
      assigned_by: assignedBy,
      is_active: true
    });
  }

  async removeRole(userId, role) {
    const userRole = await UserRole.findOne({
      where: { user_id: userId, role, is_active: true }
    });

    if (!userRole) {
      throw new Error('Role not found for user');
    }

    await userRole.update({ is_active: false });

    return { message: `Role ${role} removed successfully` };
  }

  async getUserRoles(userId) {
    const roles = await UserRole.findAll({
      where: { user_id: userId, is_active: true }
    });

    return roles.map(role => role.role);
  }

  async deactivateUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ is_active: false });

    // Revoke all refresh tokens
    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId } }
    );

    return { message: 'User deactivated successfully' };
  }

  async reactivateUser(userId) {
    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ is_active: true });

    return { message: 'User reactivated successfully' };
  }

  sanitizeUser(user) {
    const userObj = user.toJSON ? user.toJSON() : user;
    delete userObj.password;
    delete userObj.google_id;
    delete userObj.deleted_at;
    
    if (userObj.roles) {
      userObj.roles = userObj.roles.map(role => role.role);
    }

    return userObj;
  }
}

export default new UserService();
