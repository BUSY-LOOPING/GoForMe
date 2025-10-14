import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentService } from "../../services/paymentService";
import type {
  PaymentIntent,
  PaymentMethod,
} from "../../services/paymentService";
import type { Service } from "../../types";

interface PricingBreakdown {
  base_price: number;
  platform_fee: number;
  tax: number;
  priority_adjustment: number;
  distance_fee: number;
  subtotal: number;
  total: number;
  currency: string;
  tax_rate: number;
  breakdown_details: {
    priority_level: string;
    priority_description: string;
    tax_description: string;
    includes_distance_fee: boolean;
  };
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  formData: Record<string, any>;
  pricingBreakdown: PricingBreakdown;
}

interface PaymentFormProps {
  service: Service;
  formData: Record<string, any>;
  pricingBreakdown: PricingBreakdown;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily: '"Inter", sans-serif',
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
  hidePostalCode: false,
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  service,
  formData,
  pricingBreakdown,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("new");
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    initializePayment();
    loadSavedPaymentMethods();
  }, []);

  const mapPriorityToBackend = (priority: string) => {
    const priorityMap: Record<string, string> = {
      flexible: "low",
      standard: "normal",
      urgent: "urgent",
    };
    return priorityMap[priority] || "normal";
  };

  const initializePayment = async () => {
    try {
      if (!formData.delivery_address?.trim()) {
        onError("Delivery address is required");
        return;
      }

      if (!formData.contact_phone?.trim()) {
        onError("Contact phone is required");
        return;
      }

      const mappedPriority = mapPriorityToBackend(formData.priority || "standard");
      const mappedFormData = {
        ...formData,
        priority: mappedPriority,
      };

      const response = await paymentService.createPaymentIntent({
        service_id: service.id,
        amount: Math.round(pricingBreakdown.total * 100),
        currency: pricingBreakdown.currency.toLowerCase(),
        form_data: mappedFormData,
      });

      setOrderId(response.order.id);
      setPaymentIntent(response.payment_intent);
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      onError(error.message || "Failed to initialize payment. Please try again.");
    }
  };

  const loadSavedPaymentMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods();
      setSavedPaymentMethods(methods);

      const defaultMethod = methods.find((method) => method.is_default);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent || !orderId) {
      onError("Payment system not ready. Please try again.");
      return;
    }

    setLoading(true);

    try {
      let paymentMethodId = selectedPaymentMethod;

      if (selectedPaymentMethod === "new") {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          onError("Card information not found.");
          setLoading(false);
          return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          onError(error.message || "Failed to process card information.");
          setLoading(false);
          return;
        }

        paymentMethodId = paymentMethod.id;

        if (saveCard) {
          try {
            await paymentService.savePaymentMethod(paymentMethodId);
          } catch (error) {
            console.error("Failed to save payment method:", error);
          }
        }
      }

      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: paymentMethodId,
        }
      );

      if (confirmError) {
        onError(confirmError.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      const confirmResponse = await paymentService.confirmPayment({
        payment_intent_id: paymentIntent.id,
        payment_method_id: paymentMethodId,
        order_id: orderId,
      });

      onSuccess({
        ...confirmResponse,
        order_id: orderId,
        order_number: `GO${Date.now()}`,
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      onError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-black p-3 rounded-xl">
              <span className="material-icons text-white text-2xl">directions_run</span>
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">{service.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-300">
            <h5 className="font-semibold text-gray-900 mb-3">Service Details</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">location_on</span>
                <div>
                  <div className="font-medium text-gray-900">Delivery Address</div>
                  <div className="text-gray-600">{formData.delivery_address}</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">phone</span>
                <div>
                  <div className="font-medium text-gray-900">Contact</div>
                  <div className="text-gray-600">{formData.contact_phone}</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">schedule</span>
                <div>
                  <div className="font-medium text-gray-900">Scheduled Time</div>
                  <div className="text-gray-600">
                    {formData.preferred_date} at {formData.preferred_time}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-gray-600 text-sm mr-2 mt-0.5">flag</span>
                <div>
                  <div className="font-medium text-gray-900">Priority</div>
                  <div className="text-gray-600 capitalize">{formData.priority}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
          <h4 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Service</span>
              <span className="font-medium text-gray-900">${pricingBreakdown.base_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium text-gray-900">${pricingBreakdown.platform_fee.toFixed(2)}</span>
            </div>
            {pricingBreakdown.priority_adjustment !== 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Priority Adjustment</span>
                <span className={`font-medium ${pricingBreakdown.priority_adjustment > 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                  {pricingBreakdown.priority_adjustment > 0 ? '+' : ''}${pricingBreakdown.priority_adjustment.toFixed(2)}
                </span>
              </div>
            )}
            {pricingBreakdown.distance_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance Fee</span>
                <span className="font-medium text-gray-900">${pricingBreakdown.distance_fee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({(pricingBreakdown.tax_rate * 100).toFixed(0)}%)</span>
              <span className="font-medium text-gray-900">${pricingBreakdown.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  ${pricingBreakdown.total.toFixed(2)} {pricingBreakdown.currency}
                </span>
              </div>
            </div>
          </div>

          {orderId && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
              <div className="flex items-center text-sm">
                <span className="material-icons text-gray-700 text-sm mr-2">info</span>
                <div>
                  <span className="text-gray-900 font-medium">Order ID: </span>
                  <span className="text-gray-700">#{orderId}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-xl border border-gray-300">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-gray-700">verified_user</span>
            <div className="text-xs text-gray-600">
              <div className="font-semibold text-gray-900 mb-1">Secure Payment Processing</div>
              Your payment information is encrypted and secure
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        {savedPaymentMethods.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
            <h4 className="font-bold text-lg text-gray-900 mb-4">Select Payment Method</h4>
            <div className="space-y-3">
              {savedPaymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5"
                  />
                  <div className="flex items-center flex-1">
                    <div className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-bold mr-4">
                      {method.card?.brand.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        •••• •••• •••• {method.card?.last4}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires {method.card?.exp_month}/{method.card?.exp_year}
                      </div>
                    </div>
                    {method.is_default && (
                      <span className="ml-auto px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}

              <label
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPaymentMethod === "new"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="new"
                  checked={selectedPaymentMethod === "new"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5"
                />
                <div className="flex items-center">
                  <span className="material-icons text-gray-700 mr-3">add_card</span>
                  <span className="font-medium text-gray-900">Use a new card</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {(selectedPaymentMethod === "new" || savedPaymentMethods.length === 0) && (
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
            <h4 className="font-bold text-lg text-gray-900 mb-4">Card Information</h4>
            <div className="p-4 border-2 border-gray-300 rounded-xl focus-within:border-black transition-colors">
              <CardElement options={cardElementOptions} />
            </div>

            <label className="flex items-start mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="mt-1 mr-3 w-5 h-5 rounded border-gray-300"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Save this card for future payments
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Your card will be securely saved for faster checkout next time
                </div>
              </div>
            </label>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
          <button
            type="submit"
            disabled={!stripe || loading || !paymentIntent || !orderId}
            className="w-full bg-black text-white font-bold py-4 px-8 rounded-full hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="material-icons mr-2">lock</span>
                Pay ${pricingBreakdown.total.toFixed(2)} {pricingBreakdown.currency}
              </div>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            By completing this purchase, you agree to our Terms of Service
          </p>
        </div>
      </form>
    </div>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  formData,
  pricingBreakdown,
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      initializeStripe();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const initializeStripe = async () => {
    try {
      const config = await paymentService.getConfig();
      const stripe = await loadStripe(config.publishable_key);
      setStripePromise(stripe);
    } catch (error) {
      console.error("Stripe initialization error:", error);
      setError("Failed to load payment system. Please try again.");
    }
  };

  const handleSuccess = (result: any) => {
    setSuccess(true);
    setTimeout(() => {
      onClose();
      alert(
        `Payment successful! Your service request has been submitted.\n\nOrder ID: ${result.order_id}\nAmount: $${pricingBreakdown.total.toFixed(2)} ${pricingBreakdown.currency}`
      );
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(""), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-t-2xl p-6 border-b-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Secure Checkout</h2>
                <p className="text-gray-600 mt-1">Complete your payment securely</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={success}
              >
                <span className="material-icons text-gray-700">close</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 md:p-8 rounded-b-2xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center">
                  <span className="material-icons text-red-500 mr-3">error</span>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {success ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 border-2 border-gray-300">
                  <span className="material-icons text-5xl text-gray-900">check_circle</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h3>
                <p className="text-gray-600 mb-8">Your service request has been confirmed.</p>
                <div className="animate-pulse text-gray-600">Redirecting...</div>
              </div>
            ) : stripePromise ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  service={service}
                  formData={formData}
                  pricingBreakdown={pricingBreakdown}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </Elements>
            ) : (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-6"></div>
                <p className="text-gray-700">Loading secure payment system...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
