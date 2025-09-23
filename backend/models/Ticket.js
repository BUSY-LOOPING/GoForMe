import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Ticket extends Model {
  static associate(models) {
    Ticket.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user' 
    });
    
    Ticket.belongsTo(models.User, { 
      foreignKey: 'assigned_to', 
      as: 'assignee' 
    });
    
    Ticket.belongsTo(models.Order, { 
      foreignKey: 'order_id', 
      as: 'order' 
    });
    
    Ticket.hasMany(models.Message, { 
      foreignKey: 'ticket_id', 
      as: 'messages',
      onDelete: 'SET NULL'
    });
  }

  static generateTicketNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `TK${timestamp}${random}`;
  }

  isOpen() {
    return ['open', 'in_progress', 'waiting_customer'].includes(this.status);
  }

  isClosed() {
    return ['resolved', 'closed'].includes(this.status);
  }

  resolve(resolution) {
    this.status = 'resolved';
    this.resolution = resolution;
    this.resolved_at = new Date();
    return this.save();
  }

  close() {
    this.status = 'closed';
    this.closed_at = new Date();
    return this.save();
  }
}

Ticket.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  category: {
    type: DataTypes.ENUM(
      'general_inquiry', 'order_issue', 'payment_issue', 
      'runner_issue', 'technical_issue', 'refund_request', 'complaint'
    ),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Ticket',
  tableName: 'tickets',
  paranoid: true,
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: (ticket) => {
      if (!ticket.ticket_number) {
        ticket.ticket_number = Ticket.generateTicketNumber();
      }
    }
  },
  indexes: [
    { fields: ['ticket_number'] },
    { fields: ['user_id'] },
    { fields: ['assigned_to'] },
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['priority'] }
  ]
});

export default Ticket;
