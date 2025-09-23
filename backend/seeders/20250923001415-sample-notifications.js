export const up = async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('notifications', [
    {
      user_id: 3,
      type: 'order_completed',
      title: 'Order Completed',
      message: 'Your grocery shopping order has been completed successfully!',
      data: JSON.stringify({ order_id: 1, order_number: 'GO1672567123ABCD' }),
      is_read: true,
      read_at: new Date(),
      sent_via_email: true,
      sent_via_push: true,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updated_at: new Date()
    },
    {
      user_id: 2,
      type: 'order_assigned',
      title: 'New Order Assigned',
      message: 'You have been assigned a new food delivery order.',
      data: JSON.stringify({ order_id: 2, order_number: 'GO1672567124EFGH' }),
      is_read: false,
      sent_via_email: true,
      sent_via_push: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 1,
      type: 'system_announcement',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM EST.',
      data: JSON.stringify({ maintenance_window: '2-4 AM EST' }),
      is_read: false,
      sent_via_email: true,
      sent_via_push: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('notifications', null, {});
};
