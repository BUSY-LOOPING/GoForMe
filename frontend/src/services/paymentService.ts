import api from './api';
import { orderService } from './orderService';
import type { CreateOrderData } from './orderService';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  is_default: boolean;
}

export const paymentService = {
  getConfig: async () => {
    const response = await api.get('/api/payments/config');
    return response.data.data;
  },

  getPricingPreview: async (data: {
    service_id: number;
    priority?: string;
    delivery_address?: string;
    form_data?: Record<string, any>;
  }) => {
    const response = await api.post('/api/orders/pricing-preview', data);
    return response.data.data;
  },

  createPaymentIntent: async (data: {
    service_id: number;
    amount: number;
    currency?: string;
    form_data: Record<string, any>;
  }) => {
    try {
      console.log('Creating order first...');
      
      const orderData: CreateOrderData = {
        service_id: data.service_id,
        delivery_address: data.form_data.delivery_address,
        contact_phone: data.form_data.contact_phone,
        preferred_date: data.form_data.preferred_date,
        preferred_time: data.form_data.preferred_time,
        special_instructions: data.form_data.special_instructions,
        priority: data.form_data.priority || 'standard',
        form_data: data.form_data
      };

      const order = await orderService.createOrder(orderData);
      // console.log('Order created:', order);

      // console.log('Creating payment intent for order ID:', order.id);
      
      const paymentData = {
        order_id: order.id,
        amount: order.total_amount,
        currency: data.currency || 'cad'
      };
      
      const response = await api.post('/api/payments/create-payment-intent', paymentData);
      
      return {
        order,
        payment_intent: {
          id: response.data.data.payment_intent_id,
          client_secret: response.data.data.client_secret,
          amount: Math.round(paymentData.amount * 100),
          currency: data.currency || 'cad',
          status: 'requires_payment_method'
        }
      };
    } catch (error) {
      console.error('Error in createPaymentIntent:', error);
      throw error;
    }
  },

  confirmPayment: async (data: {
    payment_intent_id: string;
    payment_method_id: string;
    order_id: number;
  }) => {
    const response = await api.post('/api/payments/confirm-payment', {
      payment_intent_id: data.payment_intent_id,
      order_id: data.order_id
    });
    return response.data;
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/api/payments/payment-methods');
    return response.data.data.payment_methods || [];
  },

  savePaymentMethod: async (payment_method_id: string) => {
    const response = await api.post('/api/payments/save-payment-method', {
      payment_method_id
    });
    return response.data;
  },

  setDefaultPaymentMethod: async (payment_method_id: string) => {
    const response = await api.post('/api/payments/set-default-payment-method', {
      payment_method_id
    });
    return response.data;
  },


};
