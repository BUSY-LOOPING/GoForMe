import orderService from "../services/orderService.js";
import serviceService from "../services/serviceService.js";
import { validationResult } from "express-validator";

class OrderController {
  async createOrder(req, res, next) {
    console.log("create Order");
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const orderData = {
        ...req.body,
        user_id: req.user.id,
      };

      const order = await orderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const result = await orderService.getUserOrders(userId, {
        status,
        page,
        limit,
      });

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      const order = await orderService.getOrderById(id, userId, userRoles);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const order = await orderService.cancelOrder(id, userId, reason);

      res.json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async rateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const userId = req.user.id;

      const order = await orderService.rateOrder(id, userId, rating, review);

      res.json({
        success: true,
        message: "Order rated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableOrders(req, res, next) {
    try {
      const runnerId = req.user.id;
      console.log('runner id', runnerId);
      const { page = 1, limit = 20 } = req.query;

      const result = await orderService.getAvailableOrders(runnerId, {
        page,
        limit,
      });
      console.log('result', result);

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptOrder(req, res, next) {
    try {
      const { id } = req.params;
      const runnerId = req.user.id;

      const order = await orderService.acceptOrder(id, runnerId);

      res.json({
        success: true,
        message: "Order accepted successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { status, notes } = req.body;
      const runnerId = req.user.id;

      const order = await orderService.updateOrderStatus(
        id,
        runnerId,
        status,
        notes
      );

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const { status, runner_id, page = 1, limit = 20 } = req.query;

      const result = await orderService.getAllOrders({
        status,
        runner_id,
        page,
        limit,
      });

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignRunner(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { runner_id } = req.body;

      const order = await orderService.assignRunner(id, runner_id);

      res.json({
        success: true,
        message: "Runner assigned successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const order = await orderService.updateOrder(id, updateData);

      res.json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPricingPreview(req, res) {
    try {
      const { service_id, priority, delivery_address, form_data } = req.body;

      const service = await serviceService.getServiceById(service_id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found or inactive",
        });
      }

      const formData = {
        priority: priority || "standard",
        delivery_address: delivery_address,
        ...form_data,
      };

      const pricing = await orderService.calculateComprehensivePricing(
        service,
        formData
      );

      return res.status(200).json({
        success: true,
        data: pricing,
      });
    } catch (error) {
      console.error("Error calculating pricing preview:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to calculate pricing",
        error: error.message,
      });
    }
  }
}

export default new OrderController();
