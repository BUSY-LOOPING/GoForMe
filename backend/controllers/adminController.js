import { User, Order, Ticket, UserRole } from "../models/index.js";
import { Op } from "sequelize";
import userService from "../services/userService.js";

class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const currentMonth = new Date(
        Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
      );
      const previousMonth = new Date(
        Date.UTC(
          currentMonth.getUTCFullYear(),
          currentMonth.getUTCMonth() - 1,
          1
        )
      );

      const totalUsers = await User.count();
      const activeOrders = await Order.count({
        where: {
          status: {
            [Op.in]: ["pending", "confirmed", "accepted", "in_progress"],
          },
        },
      });
      const openTickets = await Ticket.count({ where: { status: "open" } });

      const monthlyRevenue = await Order.sum("total_amount", {
        where: {
          status: "confirmed",
          created_at: { [Op.gte]: currentMonth },
        },
      });
      const previousMonthRevenue = await Order.sum("total_amount", {
        where: {
          status: "confirmed",
          created_at: { [Op.gte]: previousMonth, [Op.lt]: currentMonth },
        },
      });

      const revenueGrowth =
        previousMonthRevenue && previousMonthRevenue > 0
          ? (
              ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) *
              100
            ).toFixed(2)
          : "0";

      const recentOrders = await Order.findAll({
        where: { status: "confirmed" },
        order: [["created_at", "DESC"]],
        limit: 5,
        raw: true,
      });

      const recentUsers = (await userService.getAllUsers(false, 1, 5)).data;
      console.log('recentUsers', recentUsers);

      // const recentUsers = await User.findAll({
      //   // where: { is_active: true },
      //   order: [["created_at", "DESC"]],
      //   limit: 5,
      //   include: [
      //     {
      //       model: UserRole,
      //       as: "roles",
      //       where: {
      //         is_active: true,
      //       },
      //       required: false,
      //     },
      //   ],
      //   // raw: true,
      // });

      // recentUsers = userService.sanitizeUser(recentUsers);

      res.json({
        success: true,
        data: {
          totalUsers,
          activeOrders,
          openTickets,
          monthlyRevenue: parseFloat(monthlyRevenue) || 0,
          revenueGrowth: parseFloat(revenueGrowth),
          recentOrders,
          recentUsers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, is_active } = req.query;

      console.log('getAllUsers isActive', is_active);
      const includeInactive =
        is_active == "false"  ? false : is_active == "true" ? true : true;

      const users = await userService.getAllUsers(
        includeInactive,
        parseInt(page),
        parseInt(limit),
        
      );

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const { is_active } = req.body;
      const user = await userService.updateUser(req.params.id, { is_active });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Role Management
  async assignRole(req, res) {
    try {
      const { role } = req.body;
      const result = await userService.addRole(req.params.id, role, req.user.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeRole(req, res) {
    try {
      const result = await userService.removeRole(req.params.id, req.params.role);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}

export default new AdminController();
