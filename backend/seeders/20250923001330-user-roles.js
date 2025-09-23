export const up = async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('user_roles', [
    {
      user_id: 1,
      role: 'admin',
      is_active: true,
      assigned_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 1,
      role: 'user',
      is_active: true,
      assigned_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 2,
      role: 'runner',
      is_active: true,
      assigned_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 2,
      role: 'user',
      is_active: true,
      assigned_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 3,
      role: 'user',
      is_active: true,
      assigned_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('user_roles', null, {});
};
