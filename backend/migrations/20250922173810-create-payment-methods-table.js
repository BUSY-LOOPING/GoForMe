'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('payment_methods', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    stripe_customer_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    stripe_payment_method_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('card', 'bank_account', 'paypal', 'apple_pay', 'google_pay'),
      allowNull: false
    },
    brand: {
      type: Sequelize.STRING,
      allowNull: true
    },
    last4: {
      type: Sequelize.STRING,
      allowNull: true
    },
    exp_month: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    exp_year: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
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

  await queryInterface.addIndex('payment_methods', ['user_id']);
  await queryInterface.addIndex('payment_methods', ['stripe_customer_id']);
  await queryInterface.addIndex('payment_methods', ['stripe_payment_method_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('payment_methods');
}