module.exports = {
  generateText: (migrationName) => `
'use strict';

export async function up(queryInterface, Sequelize) {
  // TODO: Define migration for ${migrationName}
}

export async function down(queryInterface, Sequelize) {
  // TODO: Revert migration for ${migrationName}
}
`
};
