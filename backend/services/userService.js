import { RefreshToken, User, UserRole } from "../models/index.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

class UserService {
  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: UserRole,
          as: "roles",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId, updateData) {
    const {
      first_name,
      last_name,
      phone,
      address,
      city,
      state,
      zip_code,
      date_of_birth,
    } = updateData;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({
      first_name,
      last_name,
      phone,
      address,
      city,
      state,
      zip_code,
      date_of_birth,
    });

    return this.getUserById(userId);
  }

  async updateProfileImage(userId, imagePath) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ profile_image: imagePath });

    return this.getUserById(userId);
  }

  async addRole(userId, role, assignedBy = null) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingRole = await UserRole.findOne({
      where: { user_id: userId, role },
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
      is_active: true,
    });
  }

  async removeRole(userId, role) {
    const userRole = await UserRole.findOne({
      where: { user_id: userId, role, is_active: true },
    });

    if (!userRole) {
      throw new Error("Role not found for user");
    }

    await userRole.update({ is_active: false });

    return { message: `Role ${role} removed successfully` };
  }

  async getUserRoles(userId) {
    const roles = await UserRole.findAll({
      where: { user_id: userId, is_active: true },
    });

    return roles.map((role) => role.role);
  }

  async deactivateUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ is_active: false });

    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId } }
    );

    return { message: "User deactivated successfully" };
  }

  async reactivateUser(userId) {
    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ is_active: true });

    return { message: "User reactivated successfully" };
  }

  sanitizeUser(user) {
    const userObj = user.toJSON ? user.toJSON() : user;
    delete userObj.password;
    delete userObj.google_id;
    delete userObj.deleted_at;

    if (userObj.roles) {
      userObj.roles = userObj.roles.map((role) => role.role);
    }

    return userObj;
  }

  async getAllUsers(is_active = false, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let whereClause = is_active ? { is_active: true } : {};
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      distinct: true,
      include: [
        {
          model: UserRole,
          as: "roles",
          where: { is_active: true },
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const users = rows.map((user) => this.sanitizeUser(user));
    return {
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        hasNextPage: offset + limit < count,
        hasPrevPage: page > 1,
      },
    };
  }

  async createUser(userData) {
    const { first_name, last_name, email, phone, password, role } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      is_active: true,
      email_verified: false,
    });

    if (role) {
      await UserRole.create({
        user_id: user.id,
        role: role,
        is_active: true,
      });
    }

    return this.getUserById(user.id);
  }

  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
      is_active,
      address,
      city,
      state,
      zip_code,
      date_of_birth,
    } = updateData;

    const updates = {};
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (email !== undefined) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId },
        },
      });
      if (existingUser) {
        throw new Error("Email already in use");
      }
      updates.email = email;
    }
    if (phone !== undefined) updates.phone = phone;
    if (is_active !== undefined) updates.is_active = is_active;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (zip_code !== undefined) updates.zip_code = zip_code;
    if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await user.update(updates);

    if (role !== undefined) {
      await UserRole.update(
        { is_active: false },
        { where: { user_id: userId } }
      );

      const existingRole = await UserRole.findOne({
        where: { user_id: userId, role },
      });

      if (existingRole) {
        await existingRole.update({ is_active: true });
      } else {
        await UserRole.create({
          user_id: userId,
          role: role,
          is_active: true,
        });
      }
    }

    return this.getUserById(userId);
  }

  async deleteUser(userId) {
    console.log('userId', userId);
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('not found')
      throw new Error("User not found");
    } else {
      console.log('user', user);
    }

    await User.update({ is_active: false }, { where: { id: userId } });

    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId } }
    );

    await user.destroy();

    return { message: "User deleted successfully" };
  }

  async searchUsers(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${searchTerm}%` } },
          { last_name: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      },
      distinct: true,
      include: [
        {
          model: UserRole,
          as: "roles",
          where: { is_active: true },
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      data: rows.map((user) => this.sanitizeUser(user)),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        hasNextPage: offset + limit < count,
        hasPrevPage: page > 1,
      },
    };
  }

}

export default new UserService();
