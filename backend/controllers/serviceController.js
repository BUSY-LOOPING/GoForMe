import serviceService from '../services/serviceService.js';
import serviceCategoryService from '../services/serviceCategoryService.js';
import serviceFieldService from '../services/serviceFieldService.js';
import { validationResult } from 'express-validator';
import ServiceCategory from '../models/ServiceCategory.js';

class ServiceController {
  async getAllCategories(req, res, next) {
    try {
      const { include_services = false, is_active = true } = req.query;

      const categories = await serviceCategoryService.getAllCategories({
        is_active: is_active === 'true',
        include_services: include_services === 'true'
      });

      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const { include_services = false } = req.query;

      const category = await serviceCategoryService.getCategoryById(
        id,
        include_services === 'true'
      );

      res.json({
        success: true,
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { include_services = false } = req.query;

      const category = await serviceCategoryService.getCategoryBySlug(
        slug,
        include_services === 'true'
      );

      res.json({
        success: true,
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const category = await serviceCategoryService.createCategory(
        req.body,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const category = await serviceCategoryService.updateCategory(
        id,
        req.body,
        req.user.id
      );

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const result = await serviceCategoryService.deleteCategory(id, req.user.id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllServices(req, res, next) {
    try {
      const filters = {
        category_id: req.query.category_id,
        is_active: req.query.is_active !== 'false',
        price_min: req.query.price_min,
        price_max: req.query.price_max,
        requires_location: req.query.requires_location === 'true' ? true :
          req.query.requires_location === 'false' ? false : undefined,
        allows_scheduling: req.query.allows_scheduling === 'true' ? true :
          req.query.allows_scheduling === 'false' ? false : undefined,
        search: req.query.search,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        include_fields: req.query.include_fields === 'true',
        include_category: req.query.include_category !== 'false'
      };

      const result = await serviceService.getAllServices(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req, res, next) {
    try {
      const { id } = req.params;
      const { include_fields = true } = req.query;

      const service = await serviceService.getServiceById(
        id,
        include_fields === 'true'
      );

      res.json({
        success: true,
        data: { service }
      });
    } catch (error) {
      next(error);
    }
  }

  async getServiceBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { include_fields = true } = req.query;

      const service = await serviceService.getServiceBySlug(
        slug,
        include_fields === 'true'
      );

      res.json({
        success: true,
        data: { service }
      });
    } catch (error) {
      next(error);
    }
  }

  async createService(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const service = await serviceService.createService(req.body, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: { service }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateService(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const service = await serviceService.updateService(id, req.body, req.user.id);

      res.json({
        success: true,
        message: 'Service updated successfully',
        data: { service }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    try {
      const { id } = req.params;
      const result = await serviceService.deleteService(id, req.user.id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async getServicesByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        include_fields: req.query.include_fields === 'true'
      };

      const result = await serviceService.getServicesByCategory(categoryId, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async searchServices(req, res, next) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        category_id: req.query.category_id,
        price_min: req.query.price_min,
        price_max: req.query.price_max
      };

      const result = await serviceService.searchServices(query, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedServices(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const services = await serviceService.getFeaturedServices(limit);

      res.json({
        success: true,
        data: { services }
      });
    } catch (error) {
      next(error);
    }
  }

  async getServicePricing(req, res, next) {
    try {
      const { id } = req.params;
      const customData = req.body || {};

      const pricing = await serviceService.getServicePricing(id, customData);

      res.json({
        success: true,
        data: { pricing }
      });
    } catch (error) {
      next(error);
    }
  }

  async getServiceFields(req, res, next) {
    try {
      const { serviceId } = req.params;
      const fields = await serviceFieldService.getFieldsByServiceId(serviceId);

      res.json({
        success: true,
        data: { fields }
      });
    } catch (error) {
      next(error);
    }
  }

  async createServiceField(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { serviceId } = req.params;
      const fieldData = { ...req.body, service_id: serviceId };

      const field = await serviceFieldService.createField(fieldData);

      res.status(201).json({
        success: true,
        message: 'Service field created successfully',
        data: { field }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateServiceField(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { fieldId } = req.params;
      const field = await serviceFieldService.updateField(fieldId, req.body);

      res.json({
        success: true,
        message: 'Service field updated successfully',
        data: { field }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteServiceField(req, res, next) {
    try {
      const { fieldId } = req.params;
      const result = await serviceFieldService.deleteField(fieldId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async validateServiceData(req, res, next) {
    try {
      const { serviceId } = req.params;
      const data = req.body;

      const fields = await serviceFieldService.getFieldsByServiceId(serviceId);
      const validation = serviceFieldService.validateAllFieldData(fields, data);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      res.json({
        success: true,
        message: 'Validation passed',
        data: { validatedData: validation.data }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ServiceController();
