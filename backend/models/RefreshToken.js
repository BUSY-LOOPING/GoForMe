import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../config/db.js';

class RefreshToken extends Model {
  static associate(models) {
    RefreshToken.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user' 
    });
  }

  isExpired() {
    return new Date() > this.expires_at;
  }

  revoke() {
    this.is_revoked = true;
    return this.save();
  }

  static async cleanExpired() {
    return await this.destroy({
      where: {
        expires_at: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      }
    });
  }
}

RefreshToken.init({
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
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  device_info: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
  paranoid: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['token'], unique: true },
    { fields: ['expires_at'] },
    { fields: ['is_revoked'] }
  ]
});

export default RefreshToken;
