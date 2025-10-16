import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../config/db.js';

class ServiceCategory extends Model {
  static associate(models) {
    ServiceCategory.hasMany(models.Service, { 
      foreignKey: 'category_id', 
      as: 'services',
      onDelete: 'RESTRICT'
    });
  }
}

ServiceCategory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  icon: {
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
  }
}, {
  sequelize,
  modelName: 'ServiceCategory',
  tableName: 'service_categories',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['is_active'] }
  ]
});

export default ServiceCategory;
