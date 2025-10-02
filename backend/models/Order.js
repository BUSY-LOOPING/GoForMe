import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Order extends Model {
  static associate(models) {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "customer",
    });

    Order.belongsTo(models.User, {
      foreignKey: "runner_id",
      as: "runner",
    });

    Order.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "service",
    });

    Order.hasMany(models.Payment, {
      foreignKey: "order_id",
      as: "payments",
      onDelete: "RESTRICT",
    });

    Order.hasOne(models.RunnerPayout, {
      foreignKey: "order_id",
      as: "payout",
      onDelete: "SET NULL",
    });

    Order.hasMany(models.Message, {
      foreignKey: "order_id",
      as: "messages",
      onDelete: "SET NULL",
    });

    Order.hasMany(models.RunnerImage, {
      foreignKey: "order_id",
      as: "images",
      onDelete: "CASCADE",
    });
  }

  static generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `GO${timestamp}${random}`;
  }

  getTotalWithoutFees() {
    return parseFloat(this.base_amount) - parseFloat(this.discount_amount);
  }

  getCustomerTotal() {
    return parseFloat(this.total_amount);
  }

  getRunnerEarnings() {
    return parseFloat(this.runner_earnings || 0);
  }

  getPlatformFee() {
    return parseFloat(this.platform_fee || 0);
  }

  isCompleted() {
    return this.status === "completed";
  }

  canBeCancelled() {
    return ["pending", "confirmed"].includes(this.status);
  }
}


Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    runner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "refunded"
      ),
      defaultValue: "pending",
    },
    priority: {
      type: DataTypes.ENUM("low", "normal", "high", "urgent"),
      defaultValue: "normal",
    },
    pickup_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pickup_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    pickup_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    delivery_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    delivery_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    base_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      validate: {
        min: 0,
      },
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      validate: {
        min: 0,
      },
    },
    service_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      validate: {
        min: 0,
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    runner_earnings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    platform_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    custom_fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    paranoid: true,
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (order, options) => {
        console.log("hook inside before create");
        if (!order.order_number) {
          order.order_number = Order.generateOrderNumber();
        }
      },
    },
    indexes: [
      { fields: ["order_number"] },
      { fields: ["user_id"] },
      { fields: ["runner_id"] },
      { fields: ["service_id"] },
      { fields: ["status"] },
      { fields: ["scheduled_date"] },
      { fields: ["created_at"] },
    ],
  }
);


Order.beforeCreate((order, options) => {
  if (!order.order_number) {
    order.order_number = Order.generateOrderNumber();
  }
});

export default Order;
