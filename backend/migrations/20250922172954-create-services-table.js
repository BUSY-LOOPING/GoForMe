'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('services', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'service_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    base_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    price_type: {
      type: Sequelize.ENUM('fixed', 'hourly', 'per_item', 'custom'),
      defaultValue: 'fixed'
    },
    estimated_duration: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes'
    },
    requires_location: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    allows_scheduling: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    sort_order: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  await queryInterface.addIndex('services', ['category_id']);
  await queryInterface.addIndex('services', ['slug']);
  await queryInterface.addIndex('services', ['is_active']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('services');
}