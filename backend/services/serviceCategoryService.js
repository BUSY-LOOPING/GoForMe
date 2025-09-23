import { ServiceCategory, Service, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class ServiceCategoryService {
  async getAllCategories(filters = {}) {
    const { is_active = true, include_services = false } = filters;
 
    const whereClause = {};
    if (is_active !== undefined) {
      whereClause.is_active = 1;
    }

    const includeOptions = [];
    if (include_services) {
      includeOptions.push({
        model: Service,
        as: 'services',
        where: { is_active: 1 },
        required: false
      });
    }

    const categories = await ServiceCategory.findAll({
      where: whereClause,
      include: includeOptions,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    return categories;
  }

  async getCategoryById(id, include_services = false) {
    const includeOptions = [];
    if (include_services) {
      includeOptions.push({
        model: Service,
        as: 'services',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']]
      });
    }

    const category = await ServiceCategory.findByPk(id, {
      include: includeOptions
    });

    if (!category) {
      throw new Error('Service category not found');
    }

    return category;
  }

  async getCategoryBySlug(slug, include_services = false) {
    const includeOptions = [];
    if (include_services) {
      includeOptions.push({
        model: Service,
        as: 'services',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']]
      });
    }

    const category = await ServiceCategory.findOne({
      where: { slug, is_active: true },
      include: includeOptions
    });

    if (!category) {
      throw new Error('Service category not found');
    }

    return category;
  }

  async createCategory(categoryData, userId = null) {
    const { name, description, icon, sort_order } = categoryData;

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingCategory = await ServiceCategory.findOne({ where: { slug } });
    if (existingCategory) {
      throw new Error('Category with similar name already exists');
    }

    const category = await ServiceCategory.create({
      name,
      slug,
      description,
      icon,
      sort_order: sort_order || 0,
      is_active: true
    });

    return category;
  }

  async updateCategory(id, updateData, userId = null) {
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw new Error('Service category not found');
    }

    const { name, description, icon, sort_order, is_active } = updateData;

    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updates.description = description;
    if (icon) updates.icon = icon;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_active !== undefined) updates.is_active = is_active;

    await category.update(updates);
    return category;
  }

  async deleteCategory(id, userId = null) {
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw new Error('Service category not found');
    }

    const serviceCount = await Service.count({
      where: { category_id: id, is_active: true }
    });

    if (serviceCount > 0) {
      throw new Error('Cannot delete category with active services');
    }

    await category.destroy();
    return { message: 'Category deleted successfully' };
  }

  async reorderCategories(orderData, userId = null) {
    const updates = orderData.map(item =>
      ServiceCategory.update(
        { sort_order: item.sort_order },
        { where: { id: item.id } }
      )
    );

    await Promise.all(updates);
    return { message: 'Categories reordered successfully' };
  }
}

export default new ServiceCategoryService();
