'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('service_fields', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    service_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    field_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    field_type: {
      type: Sequelize.ENUM('text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'file', 'date', 'time', 'datetime'),
      allowNull: false
    },
    field_label: {
      type: Sequelize.STRING,
      allowNull: false
    },
    field_placeholder: {
      type: Sequelize.STRING,
      allowNull: true
    },
    field_options: {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'For select, radio, checkbox options'
    },
    is_required: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    validation_rules: {
      type: Sequelize.JSON,
      allowNull: true
    },
    sort_order: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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

  await queryInterface.addIndex('service_fields', ['service_id']);
  await queryInterface.addIndex('service_fields', ['field_name']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('service_fields');
}