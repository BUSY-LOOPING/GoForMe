import stripe from '../config/stripe.js';
import { Payment, PaymentMethod, User, Order } from '../models/index.js';
import { Op } from 'sequelize';

class PaymentService {
  async createCustomer(userId, email, name) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          user_id: userId.toString()
        }
      });

      await User.update(
        { stripe_customer_id: customer.id },
        { where: { id: userId } }
      );

      return customer;
    } catch (error) {
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  async getOrCreateCustomer(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.stripe_customer_id) {
      try {
        const customer = await stripe.customers.retrieve(user.stripe_customer_id);
        return customer;
      } catch (error) {
      }
    }

    return await this.createCustomer(userId, user.email, `${user.first_name} ${user.last_name}`);
  }

  async savePaymentMethod(userId, paymentMethodId) {
    try {
      const customer = await this.getOrCreateCustomer(userId);
      
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      const savedPaymentMethod = await PaymentMethod.create({
        user_id: userId,
        stripe_customer_id: customer.id,
        stripe_payment_method_id: paymentMethodId,
        type: paymentMethod.type,
        brand: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
        exp_month: paymentMethod.card?.exp_month,
        exp_year: paymentMethod.card?.exp_year,
        is_active: true
      });

      return savedPaymentMethod;
    } catch (error) {
      throw new Error(`Failed to save payment method: ${error.message}`);
    }
  }

  async createPaymentIntent(orderId, userId, amount, currency = 'usd') {
    try {
      const customer = await this.getOrCreateCustomer(userId);
      const order = await Order.findByPk(orderId);
      amount = Math.round(amount * 100);
      
      if (!order) {
        throw new Error('Order not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), 
        currency,
        customer: customer.id,
        metadata: {
          order_id: orderId.toString(),
          user_id: userId.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      const payment = await Payment.create({
        order_id: orderId,
        user_id: userId,
        stripe_payment_intent_id: paymentIntent.id,
        amount,
        currency,
        status: 'pending',
        payment_type: 'payment'
      });

      return {
        paymentIntent,
        payment,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      const payment = await Payment.findOne({
        where: { stripe_payment_intent_id: paymentIntentId }
      });

      if (payment) {
        await payment.update({
          status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
          stripe_charge_id: paymentIntent.latest_charge,
          processed_at: new Date(),
          metadata: paymentIntent
        });

        if (paymentIntent.status === 'succeeded') {
          await Order.update(
            { status: 'confirmed' },
            { where: { id: payment.order_id } }
          );
        }
      }

      return { paymentIntent, payment };
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  async refundPayment(paymentId, amount = null, reason = 'requested_by_customer') {
    try {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const refundAmount = amount ? Math.round(amount * 100) : Math.round(payment.amount * 100);

      const refund = await stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
        amount: refundAmount,
        reason,
        metadata: {
          payment_id: paymentId.toString(),
          order_id: payment.order_id.toString()
        }
      });

      const refundPayment = await Payment.create({
        order_id: payment.order_id,
        user_id: payment.user_id,
        stripe_payment_intent_id: payment.stripe_payment_intent_id,
        stripe_charge_id: refund.id,
        amount: -(amount || payment.amount),
        currency: payment.currency,
        status: 'refunded',
        payment_type: 'refund',
        processed_at: new Date(),
        metadata: refund
      });

      await payment.update({
        status: amount < payment.amount ? 'partially_refunded' : 'refunded'
      });

      return { refund, refundPayment };
    } catch (error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  async getCustomerPaymentMethods(userId) {
    try {
      const customer = await this.getOrCreateCustomer(userId);
      
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      throw new Error(`Failed to get payment methods: ${error.message}`);
    }
  }

  async deletePaymentMethod(userId, paymentMethodId) {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
      
      await PaymentMethod.update(
        { is_active: false },
        { 
          where: { 
            user_id: userId,
            stripe_payment_method_id: paymentMethodId
          }
        }
      );

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete payment method: ${error.message}`);
    }
  }

  async setDefaultPaymentMethod(userId, paymentMethodId) {
    try {
      const customer = await this.getOrCreateCustomer(userId);
      
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      await PaymentMethod.update(
        { is_default: false },
        { where: { user_id: userId } }
      );

      await PaymentMethod.update(
        { is_default: true },
        { 
          where: { 
            user_id: userId,
            stripe_payment_method_id: paymentMethodId
          }
        }
      );

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to set default payment method: ${error.message}`);
    }
  }

  async processWebhook(body, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'payment_method.attached':
          await this.handlePaymentMethodAttached(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  async handlePaymentSucceeded(paymentIntent) {
    const payment = await Payment.findOne({
      where: { stripe_payment_intent_id: paymentIntent.id }
    });

    if (payment) {
      await payment.update({
        status: 'succeeded',
        processed_at: new Date()
      });

      await Order.update(
        { status: 'confirmed' },
        { where: { id: payment.order_id } }
      );
    }
  }

  async handlePaymentFailed(paymentIntent) {
    const payment = await Payment.findOne({
      where: { stripe_payment_intent_id: paymentIntent.id }
    });

    if (payment) {
      await payment.update({
        status: 'failed',
        failure_reason: paymentIntent.last_payment_error?.message,
        processed_at: new Date()
      });
    }
  }

  async handlePaymentMethodAttached(paymentMethod) {
    console.log('Payment method attached:', paymentMethod.id);
  }
}

export default new PaymentService();
