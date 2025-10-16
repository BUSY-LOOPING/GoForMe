import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../config/db.js';

class Service extends Model {
  static associate(models) {
    Service.belongsTo(models.ServiceCategory, { 
      foreignKey: 'category_id', 
      as: 'category' 
    });
    
    Service.belongsTo(models.User, { 
      foreignKey: 'created_by', 
      as: 'creator' 
    });
    
    Service.hasMany(models.ServiceField, { 
      foreignKey: 'service_id', 
      as: 'fields',
      onDelete: 'CASCADE'
    });
    
    Service.hasMany(models.Order, { 
      foreignKey: 'service_id', 
      as: 'orders',
      onDelete: 'RESTRICT'
    });
  }
}

Service.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'service_categories',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9-]+$/
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  price_type: {
    type: DataTypes.ENUM('fixed', 'hourly', 'per_item', 'custom'),
    defaultValue: 'fixed'
  },
  estimated_duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  requires_location: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allows_scheduling: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Service',
  tableName: 'services',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['category_id'] },
    { fields: ['slug'] },
    { fields: ['is_active'] }
  ]
});

export default Service;
