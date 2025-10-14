import Order from "../models/Order.js";
import User from "../models/User.js";
import Service from "../models/Service.js";
import UserRole from "../models/UserRole.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

class OrderService {
  calculatePricing(basePrice, priority = "normal") {
    let baseAmount = parseFloat(basePrice);
    let discountAmount = 0;
    let serviceFee = 3.0; // Platform fee
    let taxAmount = 2.0; // Service tax

    switch (priority) {
      case "urgent":
        serviceFee += 10.0; // Urgent surcharge
        break;
      case "low":
        discountAmount = 5.0; // Low priority discount
        break;
    }

    const totalAmount = baseAmount + serviceFee + taxAmount - discountAmount;
    const runnerEarnings = baseAmount * 0.8;
    const platformFee = totalAmount - runnerEarnings;

    return {
      base_amount: baseAmount,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      service_fee: serviceFee,
      total_amount: totalAmount,
      runner_earnings: runnerEarnings,
      platform_fee: platformFee,
    };
  }

  mapPriority(priority) {
    const priorityMap = {
      flexible: "low",
      standard: "normal",
      urgent: "urgent",
    };
    return priorityMap[priority] || "normal";
  }

  calculateDistanceFee(address) {
    return 0;
  }

  getPriorityDescription(priority) {
    const descriptions = {
      urgent: "Urgent Priority (+$10)",
      high: "High Priority (+$5)",
      normal: "Standard Priority",
      low: "Low Priority (-$5)",
    };
    return descriptions[priority] || descriptions["normal"];
  }

  calculateComprehensivePricing(service, formData) {
    const basePrice = parseFloat(service.base_price);
    const priority = this.mapPriority(formData.priority || "standard");

    let platformFee = 3.0;
    let priorityAdjustment = 0;
    let distanceFee = 0;

    // Priority adjustments
    switch (priority) {
      case "urgent":
        priorityAdjustment = 10.0;
        break;
      case "high":
        priorityAdjustment = 5.0;
        break;
      case "low":
        priorityAdjustment = -5.0;
        break;
      case "normal":
      default:
        priorityAdjustment = 0;
        break;
    }

    if (formData.delivery_address) {
      distanceFee = this.calculateDistanceFee(formData.delivery_address);
    }

    const taxRate = 0.13;
    const subtotal = basePrice + platformFee + priorityAdjustment + distanceFee;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const runnerEarnings = basePrice * 0.8;

    return {
      base_price: basePrice,
      platform_fee: platformFee,
      priority_adjustment: priorityAdjustment,
      distance_fee: distanceFee,
      subtotal: subtotal,
      tax_rate: taxRate,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      currency: "CAD",
      runner_earnings: parseFloat(runnerEarnings.toFixed(2)),
      breakdown_details: {
        priority_level: priority,
        priority_description: this.getPriorityDescription(priority),
        tax_description: `HST (${(taxRate * 100).toFixed(0)}%)`,
        includes_distance_fee: distanceFee > 0,
      },
    };
  }

  // async createOrder(orderData) {
  //   const transaction = await sequelize.transaction();

  //   try {
  //     const service = await Service.findOne({
  //       where: {
  //         id: orderData.service_id,
  //         is_active: true,
  //       },
  //       transaction,
  //     });

  //     if (!service) {
  //       throw new Error("Service not found or inactive");
  //     }

  //     const mappedPriority = this.mapPriority(orderData.priority);
  //     const pricing = this.calculatePricing(service.base_price, mappedPriority);

  //     let scheduledDate = null;
  //     if (orderData.preferred_date) {
  //       scheduledDate = new Date(orderData.preferred_date);
  //       if (orderData.preferred_time) {
  //         const [hours, minutes] = orderData.preferred_time.split(":");
  //         scheduledDate.setHours(parseInt(hours), parseInt(minutes));
  //       }
  //     }

  //     const order = await Order.create(
  //       {
  //         user_id: orderData.user_id,
  //         service_id: orderData.service_id,
  //         status: "pending",
  //         priority: mappedPriority,
  //         delivery_address: orderData.delivery_address,
  //         scheduled_date: scheduledDate,
  //         special_instructions: orderData.special_instructions || null,
  //         custom_fields: orderData.form_data || {},
  //         base_amount: pricing.base_amount,
  //         discount_amount: pricing.discount_amount,
  //         tax_amount: pricing.tax_amount,
  //         service_fee: pricing.service_fee,
  //         total_amount: pricing.total_amount,
  //         runner_earnings: pricing.runner_earnings,
  //         platform_fee: pricing.platform_fee,
  //       },
  //       { transaction, individualHooks: true }
  //     );

  //     await transaction.commit();

  //     return await this.getOrderById(order.id);
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // }

  async createOrder(orderData) {
    const transaction = await sequelize.transaction();
    try {
      const service = await Service.findOne({
        where: {
          id: orderData.service_id,
          is_active: true,
        },
        transaction,
      });

      if (!service) {
        throw new Error("Service not found or inactive");
      }

      const pricing = this.calculateComprehensivePricing(service, orderData);
      const mappedPriority = this.mapPriority(orderData.priority || "standard");

      let scheduledDate = null;
      if (orderData.preferred_date) {
        scheduledDate = new Date(orderData.preferred_date);
        if (orderData.preferred_time) {
          const [hours, minutes] = orderData.preferred_time.split(":");
          scheduledDate.setHours(parseInt(hours), parseInt(minutes));
        }
      }

      const order = await Order.create(
        {
          user_id: orderData.user_id,
          service_id: orderData.service_id,
          status: "pending",
          priority: mappedPriority,
          delivery_address: orderData.delivery_address,
          scheduled_date: scheduledDate,
          special_instructions: orderData.special_instructions || null,
          custom_fields: orderData.form_data || {},
          base_amount: pricing.base_price,
          discount_amount: 0,
          tax_amount: pricing.tax,
          service_fee:
            pricing.platform_fee +
            pricing.priority_adjustment +
            pricing.distance_fee,
          total_amount: pricing.total,
          runner_earnings: pricing.runner_earnings,
          platform_fee: pricing.platform_fee,
        },
        { transaction, individualHooks: true }
      );

      await transaction.commit();

      const orderWithDetails = await this.getOrderById(order.id);
      orderWithDetails.pricing = pricing;
      return orderWithDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getOrderById(orderId, userId = null, userRoles = []) {
    const whereClause = { id: orderId };

    if (userId && !userRoles.includes("admin")) {
      if (userRoles.includes("runner")) {
        whereClause[Op.or] = [{ user_id: userId }, { runner_id: userId }];
      } else {
        whereClause.user_id = userId;
      }
    }

    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "first_name", "last_name", "email", "phone"],
        },
        {
          model: User,
          as: "runner",
          attributes: ["id", "first_name", "last_name", "email", "phone"],
        },
        {
          model: Service,
          as: "service",
          attributes: [
            "id",
            "name",
            "description",
            "base_price",
            "category_id",
          ],
        },
      ],
    });

    return order;
  }

  async getUserOrders(userId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const whereClause = { user_id: userId };
    if (status) {
      whereClause.status = status;
    } else {
      // By default, exclude pending orders from history
      whereClause.status = {
        [Op.ne]: "pending", // Not equal to pending
      };
    }

    const result = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "runner",
          attributes: ["id", "first_name", "last_name", "phone"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return {
      orders: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.count / limit),
      },
    };
  }

  async getAllOrders(options = {}) {
    const { status, runner_id, page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (runner_id) whereClause.runner_id = runner_id;

    const result = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "first_name", "last_name", "email", "phone"],
        },
        {
          model: User,
          as: "runner",
          attributes: ["id", "first_name", "last_name", "email", "phone"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return {
      orders: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.count / limit),
      },
    };
  }

  async getAvailableOrders(runnerId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const result = await Order.findAndCountAll({
      where: {
        status: "pending",
        runner_id: null,
      },
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "first_name", "last_name", "phone"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description"],
        },
      ],
      order: [
        [
          sequelize.literal(`
            CASE 
              WHEN priority = 'urgent' THEN 0 
              WHEN priority = 'high' THEN 1 
              WHEN priority = 'normal' THEN 2 
              ELSE 3 
            END`),
        ],
        ["created_at", "ASC"],
      ],
      limit: parseInt(limit),
      offset: offset,
    });

    return {
      orders: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.count / limit),
      },
    };
  }

  async acceptOrder(orderId, runnerId) {
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          status: "pending",
          runner_id: null,
        },
        transaction,
      });

      if (!order) {
        throw new Error("Order not available or already assigned");
      }

      await order.update(
        {
          runner_id: runnerId,
          status: "confirmed",
        },
        { transaction }
      );

      await transaction.commit();

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateOrderStatus(orderId, runnerId, status, notes = null) {
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          runner_id: runnerId,
        },
        transaction,
      });

      if (!order) {
        throw new Error("Order not found or not assigned to you");
      }

      const updateData = { status };

      if (status === "in_progress") {
        updateData.started_at = new Date();
      } else if (status === "completed") {
        updateData.completed_at = new Date();
      } else if (status === "cancelled") {
        updateData.cancelled_at = new Date();
      }

      if (notes) {
        const currentInstructions = order.special_instructions || "";
        updateData.special_instructions =
          currentInstructions +
          (currentInstructions ? " | " : "") +
          `Runner note: ${notes}`;
      }

      await order.update(updateData, { transaction });

      await transaction.commit();

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async cancelOrder(orderId, userId, reason = null) {
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          user_id: userId,
          status: {
            [Op.in]: ["pending", "confirmed"],
          },
        },
        transaction,
      });

      if (!order) {
        throw new Error("Order not found or cannot be cancelled");
      }

      const currentInstructions = order.special_instructions || "";
      const cancelNote = reason || "Cancelled by customer";

      await order.update(
        {
          status: "cancelled",
          cancelled_at: new Date(),
          special_instructions:
            currentInstructions +
            (currentInstructions ? " | " : "") +
            `Cancelled: ${cancelNote}`,
        },
        { transaction }
      );

      await transaction.commit();

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async rateOrder(orderId, userId, rating, review = null) {
    const order = await Order.findOne({
      where: {
        id: orderId,
        user_id: userId,
        status: "completed",
      },
    });

    if (!order) {
      throw new Error("Order not found or not completed");
    }

    await order.update({
      rating: rating,
      review: review,
    });

    return await this.getOrderById(orderId);
  }

  async assignRunner(orderId, runnerId) {
    const transaction = await sequelize.transaction();

    try {
      const runner = await User.findOne({
        where: {
          id: runnerId,
          is_active: true,
        },
        include: [
          {
            model: UserRole,
            as: "roles",
            where: {
              role: "runner",
              is_active: true,
            },
          },
        ],
        transaction,
      });

      if (!runner) {
        throw new Error("Runner not found or inactive");
      }

      const order = await Order.findByPk(orderId, { transaction });
      if (!order) {
        throw new Error("Order not found");
      }

      await order.update(
        {
          runner_id: runnerId,
          status: "confirmed",
        },
        { transaction }
      );

      await transaction.commit();

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateOrder(orderId, updateData) {
    const allowedFields = [
      "delivery_address",
      "pickup_address",
      "scheduled_date",
      "special_instructions",
      "base_amount",
      "discount_amount",
      "tax_amount",
      "service_fee",
      "total_amount",
      "priority",
      "custom_fields",
    ];

    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields to update");
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    await order.update(filteredData);

    return await this.getOrderById(orderId);
  }
}

export default new OrderService();
