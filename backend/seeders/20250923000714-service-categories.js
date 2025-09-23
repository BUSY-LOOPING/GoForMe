export const up = async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('service_categories', [
    {
      id: 1,
      name: 'Grocery Shopping',
      slug: 'grocery-shopping',
      description: 'Get your groceries delivered from your favorite stores',
      icon: 'fas fa-shopping-cart',
      is_active: true,
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name: 'Food Delivery',
      slug: 'food-delivery',
      description: 'Order from restaurants and get food delivered',
      icon: 'fas fa-utensils',
      is_active: true,
      sort_order: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name: 'Pharmacy & Medical',
      slug: 'pharmacy-medical',
      description: 'Prescription pickups and medical supply delivery',
      icon: 'fas fa-prescription-bottle-alt',
      is_active: true,
      sort_order: 3,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      name: 'Package & Mail',
      slug: 'package-mail',
      description: 'Package delivery, mail services, and document handling',
      icon: 'fas fa-box',
      is_active: true,
      sort_order: 4,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      name: 'Household Services',
      slug: 'household-services',
      description: 'Cleaning supplies, laundry, and household errands',
      icon: 'fas fa-home',
      is_active: true,
      sort_order: 5,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      name: 'Personal Care',
      slug: 'personal-care',
      description: 'Beauty products, personal items, and care services',
      icon: 'fas fa-spa',
      is_active: true,
      sort_order: 6,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 7,
      name: 'Pet Services',
      slug: 'pet-services',
      description: 'Pet food, supplies, and pet-related errands',
      icon: 'fas fa-paw',
      is_active: true,
      sort_order: 7,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 8,
      name: 'Miscellaneous',
      slug: 'miscellaneous',
      description: 'Other services and custom requests',
      icon: 'fas fa-ellipsis-h',
      is_active: true,
      sort_order: 8,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('service_categories', null, {});
};
