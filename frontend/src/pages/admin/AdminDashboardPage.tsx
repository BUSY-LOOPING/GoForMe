import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { adminService } from "../../services/adminService";

interface DashboardStats {
  totalUsers: number;
  activeOrders: number;
  monthlyRevenue: number;
  openTickets: number;
  revenueGrowth: number;
  recentOrders: Array<{
    id: number;
    user_id: number;
    total_amount: string;
    status: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    createdAt: string;
    is_active: boolean;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeOrders: 0,
    monthlyRevenue: 0,
    openTickets: 0,
    revenueGrowth: 0,
    recentOrders: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      console.log('stat data', data);
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  function handleViewAllUsers(): any {
    navigate('/admin/users');
  }

  return (
    <>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.totalUsers}
                    </p>
                    <p className="text-xs text-green-600">
                      ↗ 12% vs last month
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#e6f4ed" }}
                  >
                    <span
                      className="material-icons"
                      style={{ color: "#0d572d" }}
                    >
                      people
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Orders
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.activeOrders}
                    </p>
                    <p className="text-xs" style={{ color: "#0d572d" }}>
                      ↗ 8% vs yesterday
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#e6f4ed" }}
                  >
                    <span
                      className="material-icons"
                      style={{ color: "#0d572d" }}
                    >
                      shopping_cart
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Monthly Revenue
                    </p>
                    <p className="text-3xl font-bold text-black">
                      ${stats.monthlyRevenue}
                    </p>
                    <p
                      className={`text-xs ${
                        stats.revenueGrowth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stats.revenueGrowth >= 0 ? "↗" : "↘"} $
                      {stats.revenueGrowth} vs last month
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      stats.revenueGrowth >= 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <span
                      className="material-icons"
                      style={{ color: "#0d572d" }}
                    >
                      {stats.revenueGrowth >= 0
                        ? "trending_up"
                        : "trending_down"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Open Tickets
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.openTickets}
                    </p>
                    <p className="text-xs text-red-600">↗ 3 new today</p>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#e6f4ed" }}
                  >
                    <span
                      className="material-icons"
                      style={{ color: "#0d572d" }}
                    >
                      support_agent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Recent Users</h3>
                      <button onClick={handleViewAllUsers} className="text-green-600 hover:text-green-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stats.recentUsers.map((user) => (
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">
                                      {user.first_name[0]}
                                      {user.last_name[0] || ""}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                {user.roles && user.roles.length > 0
                                  ? user.roles
                                      .map((role) => role)
                                      .join(", ")
                                  : "User"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="status-badge status-active">
                                  {user.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {Math.floor(
                                  (new Date().getTime() -
                                    new Date(user.createdAt).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days ago
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-green-600 hover:text-green-900">
                                    Edit
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    Suspend
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Support Tickets</h3>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="material-icons text-red-600 text-sm">
                              priority_high
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              Payment Processing Issue
                            </h4>
                            <span className="priority-high status-badge">
                              High Priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Customer unable to complete payment for order #12847
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-2">
                            <span>Ticket #4721</span>
                            <span className="mx-2">•</span>
                            <span>2 hours ago</span>
                            <span className="mx-2">•</span>
                            <span>By: sarah@example.com</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700">
                            Respond
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="material-icons text-yellow-600 text-sm">
                              help
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              Runner Application Question
                            </h4>
                            <span className="priority-medium status-badge">
                              Medium Priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Question about background check requirements
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-2">
                            <span>Ticket #4720</span>
                            <span className="mx-2">•</span>
                            <span>4 hours ago</span>
                            <span className="mx-2">•</span>
                            <span>By: alex@example.com</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700">
                            Respond
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="material-icons text-green-600 text-sm">
                              feedback
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              Feature Request
                            </h4>
                            <span className="priority-low status-badge">
                              Low Priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Request for scheduling recurring services
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-2">
                            <span>Ticket #4719</span>
                            <span className="mx-2">•</span>
                            <span>1 day ago</span>
                            <span className="mx-2">•</span>
                            <span>By: emma@example.com</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                            Respond
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="flex justify-center items-center w-full bg-green-800 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      <span className="material-icons text-sm mr-2">
                        person_add
                      </span>
                      Create New User
                    </button>
                    <button className="flex justify-center items-center w-full bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      <span className="material-icons text-sm mr-2">undo</span>
                      Process Refund
                    </button>
                    <button className="flex justify-center items-center w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      <span className="material-icons text-sm mr-2">email</span>
                      Send Notification
                    </button>
                    <button className="flex justify-center items-center w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      <span className="material-icons text-sm mr-2">
                        backup
                      </span>
                      Generate Report
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg mb-4">System Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">API Server</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Database</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Healthy
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Payment Gateway</span>
                      </div>
                      <span className="text-sm text-yellow-600 font-medium">
                        Slow
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Email Service</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg mb-4">Recent Refunds</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="text-sm font-medium">Order #12847</div>
                        <div className="text-xs text-gray-500">
                          Payment issue
                        </div>
                      </div>
                      <div className="text-sm font-bold text-red-600">
                        -$25.00
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="text-sm font-medium">Order #12846</div>
                        <div className="text-xs text-gray-500">
                          Service cancelled
                        </div>
                      </div>
                      <div className="text-sm font-bold text-red-600">
                        -$18.50
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="text-sm font-medium">Order #12845</div>
                        <div className="text-xs text-gray-500">
                          Runner unavailable
                        </div>
                      </div>
                      <div className="text-sm font-bold text-red-600">
                        -$32.00
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Total Today
                        </span>
                        <span className="font-bold text-red-600">-$75.50</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg mb-4">Active Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="material-icons text-yellow-600 text-sm mt-0.5">
                        warning
                      </span>
                      <div>
                        <div className="text-sm font-medium">
                          High Server Load
                        </div>
                        <div className="text-xs text-gray-500">
                          CPU usage at 85%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="material-icons text-blue-600 text-sm mt-0.5">
                        info
                      </span>
                      <div>
                        <div className="text-sm font-medium">
                          Scheduled Maintenance
                        </div>
                        <div className="text-xs text-gray-500">
                          Tonight at 2:00 AM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage;
