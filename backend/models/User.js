import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class User extends Model {
  static associate(models) {
    User.hasMany(models.UserRole, {
      foreignKey: 'user_id',
      as: 'roles',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'userOrders',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.Order, {
      foreignKey: 'runner_id',
      as: 'runnerOrders',
      onDelete: 'SET NULL'
    });

    User.hasMany(models.PaymentMethod, {
      foreignKey: 'user_id',
      as: 'paymentMethods',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Payment, {
      foreignKey: 'user_id',
      as: 'payments',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.RunnerPayout, {
      foreignKey: 'runner_id',
      as: 'payouts',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Ticket, {
      foreignKey: 'user_id',
      as: 'tickets',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.Ticket, {
      foreignKey: 'assigned_to',
      as: 'assignedTickets',
      onDelete: 'SET NULL'
    });

    User.hasMany(models.Message, {
      foreignKey: 'sender_id',
      as: 'sentMessages',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.Message, {
      foreignKey: 'receiver_id',
      as: 'receivedMessages',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.RunnerImage, {
      foreignKey: 'runner_id',
      as: 'runnerImages',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: 'user_id',
      as: 'refreshTokens',
      onDelete: 'CASCADE'
    });
  }

  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  async hasRole(role) {
    const userRole = await this.getRoles({ where: { role, is_active: true } });
    return userRole.length > 0;
  }

  async addRole(role, assignedBy = null) {
    const { UserRole } = sequelize.models;
    return await UserRole.findOrCreate({
      where: { user_id: this.id, role },
      defaults: { assigned_by: assignedBy, is_active: true }
    });
  }

  async removeRole(role) {
    const { UserRole } = sequelize.models;
    return await UserRole.destroy({
      where: { user_id: this.id, role }
    });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stripe_customer_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['google_id'] },
    { fields: ['phone'] }
  ]
});

export default User;
