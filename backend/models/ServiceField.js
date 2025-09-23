import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class ServiceField extends Model {
  static associate(models) {
    ServiceField.belongsTo(models.Service, { 
      foreignKey: 'service_id', 
      as: 'service' 
    });
  }
}

ServiceField.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  field_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  field_type: {
    type: DataTypes.ENUM('text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'file', 'date', 'time', 'datetime'),
    allowNull: false
  },
  field_label: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  field_placeholder: {
    type: DataTypes.STRING,
    allowNull: true
  },
  field_options: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  validation_rules: {
    type: DataTypes.JSON,
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'ServiceField',
  tableName: 'service_fields',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['service_id'] },
    { fields: ['field_name'] }
  ]
});

export default ServiceField;
