import api from './api';

export interface RunnerJob {
  id: number;
  order_number: string;
  service: {
    id: number;
    name: string;
    description: string;
  };
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  delivery_address: string;
  scheduled_date: string;
  special_instructions: string;
  priority: string;
  status: string;
  total_amount: number;
  runner_earnings: number;
  custom_fields: Record<string, any>;
  createdAt: string;
}

export interface RunnerStats {
  today: {
    earnings: number;
    jobsCompleted: number;
    hoursWorked: number;
    averageRating: number;
    totalDistance: number;
  };
  activeJobs: number;
}

export const runnerService = {
  getAvailableJobs: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/orders/available/list', { params });
    return response.data.data;
  },

  acceptJob: async (orderId: number) => {
    const response = await api.post(`/api/orders/${orderId}/accept`);
    return response.data.data;
  },

  getMyJobs: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/orders', { 
      params: {
        ...params,
        runner: true
      } 
    });
    return response.data.data;
  },

  updateJobStatus: async (
    orderId: number,
    status: string,
    notes?: string
  ) => {
    const response = await api.patch(`/api/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data.data;
  },

  getJobHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/api/orders', { 
      params: {
        ...params,
        runner: true,
        history: true
      }
    });
    return response.data.data;
  },

  getStats: async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    return {
      today: {
        earnings: 127,
        jobsCompleted: 8,
        hoursWorked: 6.5,
        averageRating: 4.9,
        totalDistance: 45
      },
      activeJobs: 1
    };
  },
};
