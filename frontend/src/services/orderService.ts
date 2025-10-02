import api from "./api";
import type { Order, OrdersResponse } from "../types";

// export interface Order {
//   id: number;
//   order_number: string;
//   user_id: number;
//   service_id: number;
//   status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
//   total_amount: number;
//   delivery_address: string;
//   scheduled_date?: string;
//   special_instructions?: string;
//   priority: 'standard' | 'urgent' | 'flexible';
//   form_data: Record<string, any>;
//   created_at: string;
//   updated_at: string;
// }

export interface CreateOrderData {
  service_id: number;
  delivery_address: string;
  contact_phone?: string;
  preferred_date?: string;
  preferred_time?: string;
  special_instructions?: string;
  priority: "low" | "normal" | "high" | "urgent";
  form_data: Record<string, any>;
}

export const orderService = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    console.log('orderData', orderData);
    const response = await api.post("/api/orders", orderData);
    return response.data.data;
  },

  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/api/orders/${orderId}`);
    console.log(response.data.data);
    return response.data.data;
  },

  getUserOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> => {
    const response = await api.get("/api/orders", { params });
    return response.data.data || [];
  },

  updateOrderStatus: async (
    orderId: number,
    status: string
  ): Promise<Order> => {
    const response = await api.patch(`/api/orders/${orderId}/status`, {
      status,
    });
    return response.data.data;
  },

  cancelOrder: async (orderId: number, reason?: string): Promise<Order> => {
    const response = await api.patch(`/api/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data.data;
  },

  rateOrder: async (
    orderId: number,
    rating: number,
    review?: string
  ): Promise<void> => {
    await api.post(`/orders/${orderId}/rate`, { rating, review });
  },
};
