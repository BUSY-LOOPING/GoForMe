export const up = async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('orders', [
    {
      id: 1,
      order_number: 'GO1672567123ABCD',
      user_id: 3,
      runner_id: 2,
      service_id: 1,
      status: 'completed',
      priority: 'normal',
      delivery_address: '123 Main St, City, State 12345',
      delivery_latitude: 40.7128,
      delivery_longitude: -74.0060,
      scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      started_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      base_amount: 15.00,
      tax_amount: 1.20,
      service_fee: 2.00,
      total_amount: 18.20,
      runner_earnings: 12.00,
      platform_fee: 6.20,
      special_instructions: 'Please get organic milk and free-range eggs',
      custom_fields: JSON.stringify({
        store_preference: 'Whole Foods',
        shopping_list: 'Milk\nEggs\nBread\nApples',
        budget_limit: 50
      }),
      rating: 5,
      review: 'Excellent service! Got everything on my list.',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updated_at: new Date()
    },
    {
      id: 2,
      order_number: 'GO1672567124EFGH',
      user_id: 3,
      service_id: 4,
      status: 'pending',
      priority: 'high',
      delivery_address: '456 Oak Ave, City, State 12346',
      delivery_latitude: 40.7589,
      delivery_longitude: -73.9851,
      scheduled_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      base_amount: 8.00,
      tax_amount: 0.64,
      service_fee: 1.50,
      total_amount: 10.14,
      runner_earnings: 6.00,
      platform_fee: 4.14,
      special_instructions: 'Ring doorbell twice, food for elderly person',
      custom_fields: JSON.stringify({
        restaurant_name: 'Pizza Palace',
        restaurant_address: '789 Food St, City, State',
        order_details: 'Large pepperoni pizza, already paid online',
        payment_method: 'Already Paid Online'
      }),
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('orders', null, {});
};
