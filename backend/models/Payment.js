import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Payment extends Model {
  static associate(models) {
    Payment.belongsTo(models.Order, { 
      foreignKey: 'order_id', 
      as: 'order' 
    });
    
    Payment.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user' 
    });
    
    Payment.belongsTo(models.PaymentMethod, { 
      foreignKey: 'payment_method_id', 
      as: 'paymentMethod' 
    });
  }

  isSuccessful() {
    return this.status === 'succeeded';
  }

  isFailed() {
    return this.status === 'failed';
  }

  isRefunded() {
    return ['refunded', 'partially_refunded'].includes(this.status);
  }
}

Payment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  payment_method_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'payment_methods',
      key: 'id'
    }
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stripe_charge_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
    validate: {
      len: [3, 3]
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  payment_type: {
    type: DataTypes.ENUM('payment', 'refund', 'payout'),
    defaultValue: 'payment'
  },
  failure_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['order_id'] },
    { fields: ['user_id'] },
    { fields: ['stripe_payment_intent_id'] },
    { fields: ['status'] },
    { fields: ['payment_type'] }
  ]
});

export default Payment;
