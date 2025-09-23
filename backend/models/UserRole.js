import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class UserRole extends Model {
  static associate(models) {
    UserRole.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user' 
    });
    
    UserRole.belongsTo(models.User, { 
      foreignKey: 'assigned_by', 
      as: 'assigner' 
    });
  }
}

UserRole.init({
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
  role: {
    type: DataTypes.ENUM('admin', 'user', 'runner'),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'UserRole',
  tableName: 'user_roles',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { 
      fields: ['user_id', 'role'],
      unique: true 
    },
    { fields: ['user_id'] },
    { fields: ['role'] }
  ]
});

export default UserRole;
