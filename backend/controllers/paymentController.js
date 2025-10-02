import paymentService from '../services/PaymentService.js';
import { validationResult } from 'express-validator';

class PaymentController {
  async createPaymentIntent(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { order_id, amount, currency = 'cad' } = req.body;
      const userId = req.user.id;

      const result = await paymentService.createPaymentIntent(
        order_id, 
        userId, 
        amount, 
        currency
      );

      res.json({
        success: true,
        data: {
          client_secret: result.clientSecret,
          payment_intent_id: result.paymentIntent.id
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const { payment_intent_id } = req.body;

      const result = await paymentService.confirmPayment(payment_intent_id);

      res.json({
        success: true,
        message: 'Payment confirmed',
        data: {
          status: result.paymentIntent.status,
          payment: result.payment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async savePaymentMethod(req, res, next) {
    try {
      const { payment_method_id } = req.body;
      const userId = req.user.id;

      const paymentMethod = await paymentService.savePaymentMethod(
        userId, 
        payment_method_id
      );

      res.json({
        success: true,
        message: 'Payment method saved successfully',
        data: { payment_method: paymentMethod }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentMethods(req, res, next) {
    try {
      const userId = req.user.id;
      const paymentMethods = await paymentService.getCustomerPaymentMethods(userId);

      res.json({
        success: true,
        data: { payment_methods: paymentMethods }
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePaymentMethod(req, res, next) {
    try {
      const { payment_method_id } = req.params;
      const userId = req.user.id;

      await paymentService.deletePaymentMethod(userId, payment_method_id);

      res.json({
        success: true,
        message: 'Payment method deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultPaymentMethod(req, res, next) {
    try {
      const { payment_method_id } = req.body;
      const userId = req.user.id;

      await paymentService.setDefaultPaymentMethod(userId, payment_method_id);

      res.json({
        success: true,
        message: 'Default payment method updated'
      });
    } catch (error) {
      next(error);
    }
  }

  async processRefund(req, res, next) {
    try {
      const { payment_id } = req.params;
      const { amount, reason } = req.body;

      const result = await paymentService.refundPayment(payment_id, amount, reason);

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refund: result.refund,
          refund_payment: result.refundPayment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async webhook(req, res, next) {
    try {
      const signature = req.headers['stripe-signature'];
      
      await paymentService.processWebhook(req.body, signature);

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPublishableKey(req, res, next) {
    try {
      res.json({
        success: true,
        data: {
          publishable_key: process.env.STRIPE_PUBLISHABLE_KEY
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
