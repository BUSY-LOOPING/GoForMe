import api from './api';
import type { Service, ServiceCategory } from '../types';

export const serviceService = {
  getServices: async (): Promise<Service[]> => {
    const response = await api.get('/api/services');
    return response.data.data.services || [];
  },

  getServiceById: async (id: number): Promise<Service> => {
    const response = await api.get(`/api/services/${id}`);
    return response.data.data || [];
  },

  getServiceCategories: async (): Promise<ServiceCategory[]> => {
    const response = await api.get('/api/services/categories');
    return response.data.data.categories || [];
  },

  calculatePrice: async (serviceId: number, formData: any) => {
    console.log('calc price form data', formData);
    const response = await api.post(`/api/services/${serviceId}/pricing`, formData);
    console.log('calc price', response);
    return response.data;
  },

  getServiceFields: async (serviceId: number) => {
    const response = await api.get(`/api/services/${serviceId}/fields`);
    return response.data.data;
  },

  validateServiceData: async (serviceId: number, data: Record<string, any>) => {
    const response = await api.post(`/api/services/${serviceId}/validate`, data);
    return response.data;
  },

  getServicePricing: async (serviceId: number, data: Record<string, any>) => {
    const response = await api.post(`/api/services/${serviceId}/pricing`, data);
    return response.data;
  },

  getServiceIncludes: async (serviceId: number) => {
    try {
      const response = await api.get(`/api/services/${serviceId}/includes`);
      return response.data.data;
    } catch (error) {
      console.error('Caught error:', error);
      return {
        includes: [
          { id: 1, service_id: serviceId, feature_name: 'Professional service execution', feature_description: 'Experienced runners handle your request', icon_class: 'fas fa-star', sort_order: 1 },
          { id: 2, service_id: serviceId, feature_name: 'Real-time updates', feature_description: 'Get notified throughout the process', icon_class: 'fas fa-bell', sort_order: 2 },
          { id: 3, service_id: serviceId, feature_name: 'Quality guarantee', feature_description: 'Satisfaction guaranteed or money back', icon_class: 'fas fa-shield-alt', sort_order: 3 }
        ]
      };
    }
  },
};
