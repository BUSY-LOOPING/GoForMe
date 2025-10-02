import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import type { Order } from "../types";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(Number(id));
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order || !confirm("Are you sure you want to cancel this order?"))
      return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(order.id);
      await fetchOrder();
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!order) return;

    try {
      await orderService.rateOrder(order.id, rating, review);
      await fetchOrder();
      setShowRating(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/orders")}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <span className="material-icons mr-1">arrow_back</span>
        Back to Orders
      </button>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {order.service?.name}
            </h1>
            <p className="text-gray-600 font-mono">#{order.order_number}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.replace("_", " ").toUpperCase()}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Delivery Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">
                  location_on
                </span>
                <div>
                  <div className="font-medium text-gray-700">Address</div>
                  <div className="text-gray-600">{order.delivery_address}</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">
                  phone
                </span>
                <div>
                  <div className="font-medium text-gray-700">Contact</div>
                  <div className="text-gray-600">{order.contact_phone}</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">
                  schedule
                </span>
                <div>
                  <div className="font-medium text-gray-700">
                    Scheduled Time
                  </div>
                  <div className="text-gray-600">
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
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">Runner Information</h3>
            {order.runner ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="material-icons text-gray-600 text-sm mr-2">
                    person
                  </span>
                  <span className="text-gray-900">
                    {order.runner.first_name} {order.runner.last_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-gray-600 text-sm mr-2">
                    phone
                  </span>
                  <span className="text-gray-900">{order.runner.phone}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No runner assigned yet</p>
            )}
          </div>
        </div>

        {order.special_instructions && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Special Instructions
            </h3>
            <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
              {order.special_instructions}
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price</span>
              <span className="text-gray-900">
                ${Number(order.base_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee</span>
              <span className="text-gray-900">
                ${Number(order.platform_fee).toFixed(2)}
              </span>
            </div>
            {order.distance_fee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Fee</span>
                <span className="text-gray-900">
                  ${order.distance_fee.toFixed(2)}
                </span>
              </div>
            )}
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-gray-900">
                  -${Number(order.discount_amount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">
                ${Number(order.tax_amount).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  ${Number(order.total_amount).toFixed(2)} CAD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {order.status === "pending" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
        {order.status === "completed" && !order.rating && (
          <button
            onClick={() => setShowRating(true)}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
          >
            Rate Service
          </button>
        )}
      </div>

      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Rate Your Experience</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-4xl"
                >
                  <span
                    className={`material-icons ${
                      star <= rating ? "text-black" : "text-gray-300"
                    }`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience (optional)"
              className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
