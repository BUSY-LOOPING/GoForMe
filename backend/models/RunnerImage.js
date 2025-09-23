import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class RunnerImage extends Model {
  static associate(models) {
    RunnerImage.belongsTo(models.Order, { 
      foreignKey: 'order_id', 
      as: 'order' 
    });
    
    RunnerImage.belongsTo(models.User, { 
      foreignKey: 'runner_id', 
      as: 'runner' 
    });
  }

  getFullPath() {
    return `/uploads/runner_images/${this.file_path}`;
  }

  getFileSize() {
    return this.file_size ? `${(this.file_size / 1024).toFixed(2)} KB` : 'Unknown';
  }
}

RunnerImage.init({
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
  runner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  image_type: {
    type: DataTypes.ENUM('before', 'during', 'after', 'receipt', 'proof_of_completion'),
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'RunnerImage',
  tableName: 'runner_images',
  paranoid: true,
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['order_id'] },
    { fields: ['runner_id'] },
    { fields: ['image_type'] }
  ]
});

export default RunnerImage;
