import api from "./api";

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_active?: boolean;
}

interface ServiceFormData {
  name: string;
  description?: string;
  base_price?: number;
  is_active?: boolean;
}

interface OrderUpdateData {
  status?: string;
}

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get("api/admin/dashboard/stats");
    return response.data;
  },

  getAllUsers: async (params?: PaginationParams, is_active?: boolean) => {
    const queryParams: any = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    if (is_active !== undefined) {
      queryParams.is_active = is_active;
    }
    const response = await api.get("/api/admin/users", { params: queryParams });
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData: UserFormData) => {
    const response = await api.post("/api/admin/users", userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<UserFormData>) => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id: number, is_active: boolean) => {
    const response = await api.patch(`/api/admin/users/${id}/status`, {
      is_active,
    });
    return response.data;
  },

  assignRole: async (userId: number, role: string) => {
    const response = await api.post(`/api/admin/users/${userId}/roles`, {
      role,
    });
    return response.data;
  },

  removeRole: async (userId: number, role: string) => {
    const response = await api.delete(
      `/api/admin/users/${userId}/roles/${role}`
    );
    return response.data;
  },

  getAllOrders: async (params?: PaginationParams, status?: string) => {
    const queryParams: any = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    if (status) {
      queryParams.status = status;
    }
    const response = await api.get("/api/admin/orders", { params: queryParams });
    return response.data;
  },

  getOrderById: async (id: number) => {
    const response = await api.get(`/api/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await api.patch(`/api/admin/orders/${id}/status`, {
      status,
    });
    return response.data;
  },

  deleteOrder: async (id: number) => {
    const response = await api.delete(`/api/admin/orders/${id}`);
    return response.data;
  },

  getAllServices: async (params?: PaginationParams) => {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    const response = await api.get("/api/admin/services", {
      params: queryParams,
    });
    return response.data;
  },

  getServiceById: async (id: number) => {
    const response = await api.get(`/api/admin/services/${id}`);
    return response.data;
  },

  createService: async (serviceData: ServiceFormData) => {
    const response = await api.post("/api/admin/services", serviceData);
    return response.data;
  },

  updateService: async (id: number, serviceData: Partial<ServiceFormData>) => {
    const response = await api.put(`/api/admin/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id: number) => {
    const response = await api.delete(`/api/admin/services/${id}`);
    return response.data;
  },

  getAllRunners: async (params?: PaginationParams, status?: string) => {
    const queryParams: any = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    if (status) {
      queryParams.status = status;
    }
    const response = await api.get("/api/admin/runners", {
      params: queryParams,
    });
    return response.data;
  },

  getRunnerById: async (id: number) => {
    const response = await api.get(`/api/admin/runners/${id}`);
    return response.data;
  },

  approveRunner: async (id: number) => {
    const response = await api.patch(`/api/admin/runners/${id}/approve`);
    return response.data;
  },

  rejectRunner: async (id: number, reason?: string) => {
    const response = await api.patch(`/api/admin/runners/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  getRevenueAnalytics: async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await api.get("/api/admin/analytics/revenue", { params });
    return response.data;
  },

  getUserAnalytics: async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await api.get("/api/admin/analytics/users", { params });
    return response.data;
  },

  searchUsers: async (searchTerm: string, params?: PaginationParams) => {
    const queryParams = {
      search: searchTerm,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    const response = await api.get("/api/admin/users/search", {
      params: queryParams,
    });
    return response.data;
  },

  bulkDeleteUsers: async (userIds: number[]) => {
    const response = await api.post("/api/admin/users/bulk-delete", {
      ids: userIds,
    });
    return response.data;
  },

  bulkUpdateUserStatus: async (userIds: number[], is_active: boolean) => {
    const response = await api.post("/api/admin/users/bulk-status", {
      ids: userIds,
      is_active,
    });
    return response.data;
  },

  exportUsers: async (format: "csv" | "xlsx" = "csv") => {
    const response = await api.get("/api/admin/reports/users", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },

  exportOrders: async (format: "csv" | "xlsx" = "csv") => {
    const response = await api.get("/api/admin/reports/orders", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },

  getSystemSettings: async () => {
    const response = await api.get("/api/admin/settings");
    return response.data;
  },

  updateSystemSettings: async (settings: Record<string, any>) => {
    const response = await api.put("/api/admin/settings", settings);
    return response.data;
  },

  getActivityLogs: async (params?: PaginationParams) => {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    const response = await api.get("/api/admin/logs/activity", {
      params: queryParams,
    });
    return response.data;
  },

  getUserActivityLogs: async (userId: number, params?: PaginationParams) => {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    const response = await api.get(`/api/admin/users/${userId}/logs`, {
      params: queryParams,
    });
    return response.data;
  },

  sendNotification: async (
    userIds: number[],
    notification: {
      title: string;
      message: string;
      type?: string;
    }
  ) => {
    const response = await api.post("/api/admin/notifications/send", {
      user_ids: userIds,
      ...notification,
    });
    return response.data;
  },

  // sendEmail: async (
  //   userIds: number[],
  //   email: {
  //     subject: string;
  //     body: string;
  //     template?: string;
  //   }
  // ) => {
  //   const response = await api.post("api/admin/emails/send", {
  //     user_ids: userIds,
  //     ...email,
  //   });
  //   return response.data;
  // },

  // resetUserPassword: async (userId: number) => {
  //   const response = await api.post(`api/admin/users/${userId}/reset-password`);
  //   return response.data;
  // },

  // verifyUserEmail: async (userId: number) => {
  //   const response = await api.patch(`api/admin/users/${userId}/verify-email`);
  //   return response.data;
  // },

  // verifyUserPhone: async (userId: number) => {
  //   const response = await api.patch(`api/admin/users/${userId}/verify-phone`);
  //   return response.data;
  // },
};
