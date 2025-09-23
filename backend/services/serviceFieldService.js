import { ServiceField, Service } from '../models/index.js';

class ServiceFieldService {
  async getFieldsByServiceId(serviceId) {
    const fields = await ServiceField.findAll({
      where: { 
        service_id: serviceId,
        is_active: true 
      },
      order: [['sort_order', 'ASC'], ['field_label', 'ASC']]
    });

    return fields;
  }

  async getFieldById(id) {
    const field = await ServiceField.findByPk(id);
    if (!field) {
      throw new Error('Service field not found');
    }
    return field;
  }

  async createField(fieldData) {
    const {
      service_id,
      field_name,
      field_type,
      field_label,
      field_placeholder,
      field_options,
      is_required = false,
      validation_rules,
      sort_order = 0
    } = fieldData;

    const service = await Service.findByPk(service_id);
    if (!service) {
      throw new Error('Service not found');
    }

    const field = await ServiceField.create({
      service_id,
      field_name,
      field_type,
      field_label,
      field_placeholder,
      field_options,
      is_required,
      validation_rules,
      sort_order,
      is_active: true
    });

    return field;
  }

  async updateField(id, updateData) {
    const field = await ServiceField.findByPk(id);
    if (!field) {
      throw new Error('Service field not found');
    }

    const {
      field_name,
      field_type,
      field_label,
      field_placeholder,
      field_options,
      is_required,
      validation_rules,
      sort_order,
      is_active
    } = updateData;

    const updates = {};
    if (field_name) updates.field_name = field_name;
    if (field_type) updates.field_type = field_type;
    if (field_label) updates.field_label = field_label;
    if (field_placeholder !== undefined) updates.field_placeholder = field_placeholder;
    if (field_options !== undefined) updates.field_options = field_options;
    if (is_required !== undefined) updates.is_required = is_required;
    if (validation_rules !== undefined) updates.validation_rules = validation_rules;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_active !== undefined) updates.is_active = is_active;

    await field.update(updates);
    return field;
  }

  async deleteField(id) {
    const field = await ServiceField.findByPk(id);
    if (!field) {
      throw new Error('Service field not found');
    }

    await field.destroy();
    return { message: 'Field deleted successfully' };
  }

  async reorderFields(serviceId, orderData) {
    const updates = orderData.map(item => 
      ServiceField.update(
        { sort_order: item.sort_order },
        { where: { id: item.id, service_id: serviceId } }
      )
    );

    await Promise.all(updates);
    return { message: 'Fields reordered successfully' };
  }

  validateFieldData(field, value) {
    if (field.is_required && (!value || value.toString().trim() === '')) {
      return { isValid: false, error: `${field.field_label} is required` };
    }

    if (!value) {
      return { isValid: true };
    }

    switch (field.field_type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, error: `${field.field_label} must be a valid email` };
        }
        break;
      
      case 'number':
        if (isNaN(value)) {
          return { isValid: false, error: `${field.field_label} must be a number` };
        }
        if (field.validation_rules) {
          const rules = field.validation_rules;
          if (rules.min && parseFloat(value) < rules.min) {
            return { isValid: false, error: `${field.field_label} must be at least ${rules.min}` };
          }
          if (rules.max && parseFloat(value) > rules.max) {
            return { isValid: false, error: `${field.field_label} must be at most ${rules.max}` };
          }
        }
        break;
      
      case 'select':
      case 'radio':
        if (field.field_options && field.field_options.length > 0) {
          if (!field.field_options.includes(value)) {
            return { isValid: false, error: `${field.field_label} must be one of the available options` };
          }
        }
        break;
      
      case 'checkbox':
        if (!Array.isArray(value)) {
          return { isValid: false, error: `${field.field_label} must be an array` };
        }
        break;
    }

    return { isValid: true };
  }

  validateAllFieldData(fields, data) {
    const errors = [];
    const validatedData = {};

    for (const field of fields) {
      const value = data[field.field_name];
      const validation = this.validateFieldData(field, value);
      
      if (!validation.isValid) {
        errors.push({
          field: field.field_name,
          message: validation.error
        });
      } else {
        validatedData[field.field_name] = value;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: validatedData
    };
  }
}

export default new ServiceFieldService();
