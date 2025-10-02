import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import type { Order } from "../types";

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders({ page, limit: 10 });
      setOrders(response);
      setTotalPages(response.pagination.pages);
      console.log("Pagination pages", response.pagination.pages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gray-900 text-white";
      case "in_progress":
        return "bg-gray-600 text-white";
      case "accepted":
        return "bg-gray-700 text-white";
      case "pending":
        return "bg-gray-300 text-gray-900";
      case "cancelled":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "normal":
        return "text-gray-900";
      case "low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-gray-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-white text-2xl">
                        shopping_bag
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {order.service?.name || "Service"}
                        </h3>
                        <span
                          className={`material-icons text-sm ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority === "urgent"
                            ? "bolt"
                            : order.priority === "low"
                            ? "schedule"
                            : "flag"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">
                        #{order.order_number}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      {order.runner && (
                        <div className="flex items-center mt-2 text-sm text-gray-700">
                          <span className="material-icons text-sm mr-1">
                            person
                          </span>
                          {order.runner.first_name} {order.runner.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="font-bold text-2xl text-gray-900">
                      ${Number(order.total_amount).toFixed(2)}
                    </p>
                    <span className="text-xs text-gray-500">CAD</span>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="material-icons text-sm mr-1">
                        location_on
                      </span>
                      <span className="truncate max-w-md">
                        {order.delivery_address.split(",")[0]}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="material-icons text-sm mr-1">
                        schedule
                      </span>
                      {new Date(order.scheduled_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
          <span className="material-icons text-6xl text-gray-400 mb-4">
            shopping_bag
          </span>
          <h3 className="font-bold text-xl text-gray-900 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start ordering services to see your history here
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
          >
            Browse Services
          </button>
        </div>
      )}
    </>
  );
};

export default OrderHistoryPage;
