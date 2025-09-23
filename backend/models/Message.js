import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Message extends Model {
  static associate(models) {
    Message.belongsTo(models.User, { 
      foreignKey: 'sender_id', 
      as: 'sender' 
    });
    
    Message.belongsTo(models.User, { 
      foreignKey: 'receiver_id', 
      as: 'receiver' 
    });
    
    Message.belongsTo(models.Order, { 
      foreignKey: 'order_id', 
      as: 'order' 
    });
    
    Message.belongsTo(models.Ticket, { 
      foreignKey: 'ticket_id', 
      as: 'ticket' 
    });
  }

  markAsRead() {
    this.is_read = true;
    this.read_at = new Date();
    return this.save();
  }

  isFileMessage() {
    return this.message_type !== 'text';
  }
}

Message.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  message_type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'location'),
    defaultValue: 'text'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['sender_id'] },
    { fields: ['receiver_id'] },
    { fields: ['order_id'] },
    { fields: ['ticket_id'] },
    { fields: ['is_read'] },
    { fields: ['created_at'] }
  ]
});

export default Message;
