'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(
      "UPDATE users SET last_name = 'User' WHERE last_name IS NULL"
    );
    
    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
}