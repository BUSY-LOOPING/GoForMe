import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, UserRole, RefreshToken } from "../models/index.js";
import { Op } from "sequelize";

class AuthService {
  async register(userData) {
    const { email, password, first_name, last_name, phone, address } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      address,
      email_verified: false,
    });

    await UserRole.create({
      user_id: user.id,
      role: "user",
      is_active: true,
    });

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email },
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
      throw new Error("Invalid credentials");
    }

    if (!user.password) {
      throw new Error("Please use Google login for this account");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    await user.update({ last_login: new Date() });

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async googleAuth(profile) {
    const email = profile.emails[0].value;

    let user = await User.findOne({
      where: { email },
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
      user = await User.create({
        email,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        google_id: profile.id,
        email_verified: true,
        is_active: true,
      });

      await UserRole.create({
        user_id: user.id,
        role: "user",
        is_active: true,
      });

      user = await User.findByPk(user.id, {
        include: [
          {
            model: UserRole,
            as: "roles",
            where: { is_active: true },
            required: false,
          },
        ],
      });
    } else {
      await user.update({
        google_id: profile.id,
        last_login: new Date(),
      });
    }

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshTokenValue) {
    const refreshTokenRecord = await RefreshToken.findOne({
      where: {
        token: refreshTokenValue,
        is_revoked: false,
      },
      include: [
        {
          model: User,
          as: "user",
          where: { is_active: true },
          include: [
            {
              model: UserRole,
              as: "roles",
              where: { is_active: true },
              required: false,
            },
          ],
        },
      ],
    });

    if (!refreshTokenRecord || refreshTokenRecord.isExpired()) {
      throw new Error("Invalid or expired refresh token");
    }

    await refreshTokenRecord.revoke();

    const tokens = await this.generateTokens(refreshTokenRecord.user.id);

    return {
      user: this.sanitizeUser(refreshTokenRecord.user),
      ...tokens,
    };
  }

  async logout(userId, refreshTokenValue) {
    try {
      if (refreshTokenValue) {
        await RefreshToken.destroy({
          where: {
            user_id: userId,
            token: refreshTokenValue,
          },
        });
      }
      return { message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      return { message: "Logged out successfully" };
    }
  }

  async logoutAll(userId) {
    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId } }
    );

    return { message: "Logged out from all devices" };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("Cannot change password for Google authenticated users");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashedNewPassword });

    await this.logoutAll(userId);

    return { message: "Password changed successfully" };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { message: "If email exists, reset instructions will be sent" };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    return {
      message: "Reset token generated",
      resetToken,
    };
  }

  async generateTokens(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserRole,
          as: "roles",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    const roles = user.roles.map((role) => role.role);

    const payload = {
      id: userId,
      email: user.email,
      roles,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });

    const refreshTokenValue = crypto.randomUUID();
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      user_id: userId,
      token: refreshTokenValue,
      expires_at: refreshTokenExpiry,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshTokenValue,
      expires_in: refreshTokenExpiry, 
      token_type: "Bearer",
    };
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

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.id, {
        where: { is_active: true },
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

      return {
        user: this.sanitizeUser(user),
        decoded,
      };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async cleanupExpiredTokens() {
    await RefreshToken.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });
  }
}

export default new AuthService();
