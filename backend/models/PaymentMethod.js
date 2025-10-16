import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../config/db.js';

class PaymentMethod extends Model {
  static associate(models) {
    PaymentMethod.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user' 
    });
    
    PaymentMethod.hasMany(models.Payment, { 
      foreignKey: 'payment_method_id', 
      as: 'payments',
      onDelete: 'SET NULL'
    });
  }

  getMaskedNumber() {
    return `****-****-****-${this.last4}`;
  }

  isExpired() {
    if (!this.exp_month || !this.exp_year) return false;
    
    const now = new Date();
    const expiry = new Date(this.exp_year, this.exp_month - 1);
    return now > expiry;
  }
}

PaymentMethod.init({
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
  stripe_customer_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stripe_payment_method_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('card', 'bank_account', 'paypal', 'apple_pay', 'google_pay'),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last4: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [4, 4]
    }
  },
  exp_month: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 12
    }
  },
  exp_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: new Date().getFullYear()
    }
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'PaymentMethod',
  tableName: 'payment_methods',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['stripe_customer_id'] },
    { fields: ['stripe_payment_method_id'] }
  ]
});

export default PaymentMethod;
