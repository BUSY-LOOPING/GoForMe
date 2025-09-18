import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Service extends Model {}

Service.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  basePrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  deletedAt: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'Service',
  paranoid: true,
  timestamps: true,
  tableName: 'services'
});

export default Service;
