import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class RunnerPayout extends Model {
  static associate(models) {
    RunnerPayout.belongsTo(models.User, { 
      foreignKey: 'runner_id', 
      as: 'runner' 
    });
    
    RunnerPayout.belongsTo(models.Order, { 
      foreignKey: 'order_id', 
      as: 'order' 
    });
  }

  isPaid() {
    return this.status === 'paid';
  }

  isFailed() {
    return this.status === 'failed';
  }

  isPending() {
    return this.status === 'pending';
  }
}

RunnerPayout.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  runner_id: {
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
  stripe_transfer_id: {
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
    type: DataTypes.ENUM('pending', 'processing', 'paid', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  payout_method: {
    type: DataTypes.ENUM('bank_transfer', 'stripe_express', 'paypal'),
    defaultValue: 'stripe_express'
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failure_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'RunnerPayout',
  tableName: 'runner_payouts',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['runner_id'] },
    { fields: ['order_id'] },
    { fields: ['status'] },
    { fields: ['scheduled_date'] }
  ]
});

export default RunnerPayout;
