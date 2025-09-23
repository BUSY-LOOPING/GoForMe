import bcrypt from 'bcryptjs';

export const up = async (queryInterface, Sequelize) => {
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  await queryInterface.bulkInsert('users', [
    {
      id: 1,
      email: 'admin@goforeme.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      phone: '+15551234567',
      email_verified: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      email: 'runner@goforeme.com',
      password: hashedPassword,
      first_name: 'Runner',
      last_name: 'Smith',
      phone: '+15551234568',
      email_verified: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      email: 'customer@goforeme.com',
      password: hashedPassword,
      first_name: 'Customer',
      last_name: 'Jones',
      phone: '+15551234569',
      email_verified: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('users', null, {});
};
