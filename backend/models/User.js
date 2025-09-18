import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin','user','runner'), allowNull: false, defaultValue: 'user' },
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  deletedAt: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'User',
  paranoid: true,
  timestamps: true,
  tableName: 'users'
});

export default User;
