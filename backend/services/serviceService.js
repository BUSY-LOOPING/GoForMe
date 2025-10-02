import { Service, ServiceCategory, ServiceField } from '../models/index.js';
import { Op } from 'sequelize';

class ServiceService {
  async getAllServices(filters = {}) {
    const { 
      category_id, 
      is_active = true, 
      price_min, 
      price_max,
      requires_location,
      allows_scheduling,
      search,
      page = 1,
      limit = 20,
      include_fields = false,
      include_category = true
    } = filters;

    const whereClause = {};
    
    if (is_active !== undefined) {
      whereClause.is_active = is_active;
    }
    
    if (category_id) {
      whereClause.category_id = category_id;
    }
    
    if (price_min || price_max) {
      whereClause.base_price = {};
      if (price_min) whereClause.base_price[Op.gte] = price_min;
      if (price_max) whereClause.base_price[Op.lte] = price_max;
    }
    
    if (requires_location !== undefined) {
      whereClause.requires_location = requires_location;
    }
    
    if (allows_scheduling !== undefined) {
      whereClause.allows_scheduling = allows_scheduling;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const includeOptions = [];
    
    if (include_category) {
      includeOptions.push({
        model: ServiceCategory,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      });
    }
    
    if (include_fields) {
      includeOptions.push({
        model: ServiceField,
        as: 'fields',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']]
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Service.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      services: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  async getServiceById(id, include_fields = true) {
    const includeOptions = [
      {
        model: ServiceCategory,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }
    ];

    if (include_fields) {
      includeOptions.push({
        model: ServiceField,
        as: 'fields',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']]
      });
    }
    const service = await Service.findByPk(id, {
      include: includeOptions
    });

    if (!service) {
      throw new Error('Service not found');
    }

    return service;
  }

  async getServiceBySlug(slug, include_fields = true) {
    const includeOptions = [
      {
        model: ServiceCategory,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }
    ];

    if (include_fields) {
      includeOptions.push({
        model: ServiceField,
        as: 'fields',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']]
      });
    }

    const service = await Service.findOne({
      where: { slug, is_active: true },
      include: includeOptions
    });

    if (!service) {
      throw new Error('Service not found');
    }

    return service;
  }

  async createService(serviceData, userId = null) {
    const {
      category_id,
      name,
      description,
      base_price,
      price_type = 'fixed',
      estimated_duration,
      requires_location = true,
      allows_scheduling = true,
      image,
      sort_order = 0,
      fields = []
    } = serviceData;

    const category = await ServiceCategory.findByPk(category_id);
    if (!category) {
      throw new Error('Service category not found');
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingService = await Service.findOne({ where: { slug } });
    if (existingService) {
      throw new Error('Service with similar name already exists');
    }

    const service = await Service.create({
      category_id,
      name,
      slug,
      description,
      base_price,
      price_type,
      estimated_duration,
      requires_location,
      allows_scheduling,
      image,
      sort_order,
      created_by: userId,
      is_active: true
    });

    if (fields && fields.length > 0) {
      const serviceFields = fields.map(field => ({
        service_id: service.id,
        ...field,
        is_active: true
      }));
      
      await ServiceField.bulkCreate(serviceFields);
    }

    return this.getServiceById(service.id);
  }

  async updateService(id, updateData, userId = null) {
    const service = await Service.findByPk(id);
    if (!service) {
      throw new Error('Service not found');
    }

    const {
      category_id,
      name,
      description,
      base_price,
      price_type,
      estimated_duration,
      requires_location,
      allows_scheduling,
      image,
      sort_order,
      is_active
    } = updateData;

    const updates = {};
    
    if (category_id) {
      const category = await ServiceCategory.findByPk(category_id);
      if (!category) {
        throw new Error('Service category not found');
      }
      updates.category_id = category_id;
    }
    
    if (name) {
      updates.name = name;
      updates.slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    if (description !== undefined) updates.description = description;
    if (base_price !== undefined) updates.base_price = base_price;
    if (price_type) updates.price_type = price_type;
    if (estimated_duration !== undefined) updates.estimated_duration = estimated_duration;
    if (requires_location !== undefined) updates.requires_location = requires_location;
    if (allows_scheduling !== undefined) updates.allows_scheduling = allows_scheduling;
    if (image !== undefined) updates.image = image;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_active !== undefined) updates.is_active = is_active;

    await service.update(updates);
    return this.getServiceById(service.id);
  }

  async deleteService(id, userId = null) {
    const service = await Service.findByPk(id);
    if (!service) {
      throw new Error('Service not found');
    }

    await service.update({ is_active: false });
    return { message: 'Service deleted successfully' };
  }

  async getServicesByCategory(categoryId, filters = {}) {
    return this.getAllServices({ ...filters, category_id: categoryId });
  }

  async searchServices(query, filters = {}) {
    return this.getAllServices({ ...filters, search: query });
  }

  async getFeaturedServices(limit = 10) {
    const services = await Service.findAll({
      where: { is_active: true },
      include: [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'icon']
        }
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    return services;
  }

  async getServicePricing(serviceId, customData = {}) {
    const service = await Service.findByPk(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    let calculatedPrice = parseFloat(service.base_price);
    
    switch (service.price_type) {
      case 'hourly':
        const hours = customData.hours || 1;
        calculatedPrice = service.base_price * hours;
        break;
      case 'per_item':
        const items = customData.items || 1;
        calculatedPrice = service.base_price * items;
        break;
      case 'custom':
        calculatedPrice = this.calculateCustomPricing(service, customData);
        break;
      default:
        break;
    }

    const serviceFee = calculatedPrice * 0.15;
    const taxAmount = calculatedPrice * 0.08; 
    const totalAmount = calculatedPrice + serviceFee + taxAmount;

    return {
      base_amount: calculatedPrice.toFixed(2),
      service_fee: serviceFee.toFixed(2),
      tax_amount: taxAmount.toFixed(2),
      total_amount: totalAmount.toFixed(2),
      price_breakdown: {
        service_price: calculatedPrice.toFixed(2),
        service_fee: serviceFee.toFixed(2),
        tax: taxAmount.toFixed(2)
      }
    };
  }

  async getServicePricing(serviceId, customData = {}) {
    console.log('getServicePricing serviceId', serviceId);
    try {
      const service = await Service.findByPk(serviceId);
      
      if (!service) {
        throw new Error('Service not found');
      }

      const basePrice = parseFloat(service.base_price);
      const platformFee = 3.00;
      
      let priorityAdjustment = 0;
      const priority = customData.priority || 'standard';
      
      switch (priority) {
        case 'urgent':
          priorityAdjustment = 10.00;
          break;
        case 'flexible':
          priorityAdjustment = -5.00;
          break;
        default: // standard
          priorityAdjustment = 0;
          break;
      }

      let distanceFee = 0;
      if (customData.delivery_address && service.requires_location) {
        //  distance calculation
        distanceFee = 0;
      }

      const subtotal = basePrice + platformFee + priorityAdjustment + distanceFee;
      
      const taxRate = 0.13;
      const tax = subtotal * taxRate;
      
      const total = subtotal + tax;

      const pricingBreakdown = {
        base_price: parseFloat(basePrice.toFixed(2)),
        platform_fee: parseFloat(platformFee.toFixed(2)),
        priority_adjustment: parseFloat(priorityAdjustment.toFixed(2)),
        distance_fee: parseFloat(distanceFee.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax_rate: taxRate,
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        currency: 'CAD',
        breakdown_details: {
          priority_level: priority,
          // priority_description: this.getPriorityDescription(priority),
          tax_description: 'HST (13%)',
          includes_distance_fee: service.requires_location && customData.delivery_address
        }
      };

      return pricingBreakdown;
    } catch (error) {
      console.error('Error calculating service pricing:', error);
      throw error;
    }
  }



}

export default new ServiceService();
