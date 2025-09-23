export const up = async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('service_fields', [
    // Basic Grocery Shopping Fields
    {
      service_id: 1,
      field_name: 'store_preference',
      field_type: 'select',
      field_label: 'Preferred Store',
      field_placeholder: 'Choose your preferred store',
      field_options: JSON.stringify([
        'Walmart', 'Target', 'Kroger', 'Safeway', 'Whole Foods', 
        'Trader Joes', 'Costco', 'Other'
      ]),
      is_required: true,
      sort_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 1,
      field_name: 'shopping_list',
      field_type: 'textarea',
      field_label: 'Shopping List',
      field_placeholder: 'List all items you need (one per line)',
      is_required: true,
      sort_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 1,
      field_name: 'special_instructions',
      field_type: 'textarea',
      field_label: 'Special Instructions',
      field_placeholder: 'Any specific brands, preferences, or special instructions',
      is_required: false,
      sort_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 1,
      field_name: 'budget_limit',
      field_type: 'number',
      field_label: 'Budget Limit ($)',
      field_placeholder: '100',
      validation_rules: JSON.stringify({ min: 10, max: 1000 }),
      is_required: false,
      sort_order: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // Restaurant Pickup Fields
    {
      service_id: 4,
      field_name: 'restaurant_name',
      field_type: 'text',
      field_label: 'Restaurant Name',
      field_placeholder: 'Enter restaurant name',
      is_required: true,
      sort_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 4,
      field_name: 'restaurant_address',
      field_type: 'text',
      field_label: 'Restaurant Address',
      field_placeholder: 'Full address of restaurant',
      is_required: true,
      sort_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 4,
      field_name: 'order_details',
      field_type: 'textarea',
      field_label: 'Order Details',
      field_placeholder: 'What items to order or confirmation number if already ordered',
      is_required: true,
      sort_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 4,
      field_name: 'payment_method',
      field_type: 'select',
      field_label: 'Payment Method',
      field_options: JSON.stringify([
        'Already Paid Online', 'Cash (I will provide)', 'Card (I will provide)', 
        'Pay on my behalf (add to bill)'
      ]),
      is_required: true,
      sort_order: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // Prescription Pickup Fields
    {
      service_id: 6,
      field_name: 'pharmacy_name',
      field_type: 'select',
      field_label: 'Pharmacy',
      field_options: JSON.stringify([
        'CVS', 'Walgreens', 'Rite Aid', 'Walmart Pharmacy', 
        'Target Pharmacy', 'Local Pharmacy', 'Other'
      ]),
      is_required: true,
      sort_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 6,
      field_name: 'pharmacy_address',
      field_type: 'text',
      field_label: 'Pharmacy Address',
      field_placeholder: 'Full address of pharmacy',
      is_required: true,
      sort_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 6,
      field_name: 'patient_name',
      field_type: 'text',
      field_label: 'Patient Name',
      field_placeholder: 'Name on the prescription',
      is_required: true,
      sort_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 6,
      field_name: 'prescription_info',
      field_type: 'textarea',
      field_label: 'Prescription Information',
      field_placeholder: 'Prescription numbers, doctor name, or other identifying information',
      is_required: true,
      sort_order: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // Custom Errand Fields
    {
      service_id: 15,
      field_name: 'errand_description',
      field_type: 'textarea',
      field_label: 'Errand Description',
      field_placeholder: 'Describe in detail what you need done',
      is_required: true,
      sort_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 15,
      field_name: 'estimated_time',
      field_type: 'select',
      field_label: 'Estimated Time Required',
      field_options: JSON.stringify([
        '30 minutes', '1 hour', '1.5 hours', '2 hours', '2+ hours'
      ]),
      is_required: true,
      sort_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_id: 15,
      field_name: 'locations_involved',
      field_type: 'textarea',
      field_label: 'Locations Involved',
      field_placeholder: 'List all addresses/locations that need to be visited',
      is_required: true,
      sort_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('service_fields', null, {});
};
