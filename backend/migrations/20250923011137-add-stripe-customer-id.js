'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'stripe_customer_id', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'stripe_customer_id');

}
