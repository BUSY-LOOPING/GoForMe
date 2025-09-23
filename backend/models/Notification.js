import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Notification extends Model {
  static associate(models) {
    Notification.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user' 
    });
  }

  markAsRead() {
    this.is_read = true;
    this.read_at = new Date();
    return this.save();
  }

  static async createForUser(userId, type, title, message, data = null) {
    return await this.create({
      user_id: userId,
      type,
      title,
      message,
      data
    });
  }
}

Notification.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'order_created', 'order_assigned', 'order_started', 'order_completed', 
      'order_cancelled', 'payment_received', 'payout_processed', 
      'message_received', 'system_announcement'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sent_via_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sent_via_push: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['is_read'] },
    { fields: ['created_at'] }
  ]
});

export default Notification;
