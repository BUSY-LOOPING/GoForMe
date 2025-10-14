import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { serviceService } from "../../services/serviceService";
import PaymentModal from "./PaymentModal";
import AddressAutocomplete from "./AddressAutocomplete";

interface ServiceField {
  id: number;
  service_id: number;
  field_name: string;
  field_label: string;
  field_type:
    | "text"
    | "textarea"
    | "select"
    | "number"
    | "date"
    | "time"
    | "email"
    | "tel";
  is_required: boolean;
  field_placeholder?: string;
  field_options?: string;
  validation_rules?: string;
  sort_order: number;
}

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

interface Props {
  formData: Record<string, any>;
  onFormDataChange: (formData: any) => void;
  pricingBreakdown: PricingBreakdown | null;
}

const ServiceRequestForm: React.FC<Props> = ({
  formData,
  onFormDataChange,
  pricingBreakdown,
}) => {
  const { selectedService } = useSelector((state: RootState) => state.services);
  const { user } = useSelector((state: RootState) => state.auth);

  // const [formData, setFormData] = useState<Record<string, any>>({
  //   special_instructions: "",
  //   priority: "flexible",
  //   delivery_address: "",
  //   contact_phone: "",
  //   preferred_date: "",
  //   preferred_time: "",
  // });
  const [serviceFields, setServiceFields] = useState<ServiceField[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (selectedService) {
      fetchServiceFields();
      const initialFormData = {
        special_instructions: "",
        priority: "flexible",
        delivery_address: "",
        contact_phone: "",
        preferred_date: "",
        preferred_time: "",
      };
      onFormDataChange(initialFormData); // Now safe to call without checking
      setErrors({});
    }
  }, [selectedService?.id]);

  useEffect(() => {
    if (serviceFields.length > 0 && selectedService) {
      const dynamicFieldsInitial: Record<string, any> = {};

      serviceFields.forEach((field) => {
        if (!(field.field_name in formData)) {
          dynamicFieldsInitial[field.field_name] = "";
        }
      });

      if (Object.keys(dynamicFieldsInitial).length > 0) {
        onFormDataChange({
          ...formData,
          ...dynamicFieldsInitial,
        });
      }
    }
  }, [serviceFields]);

  const fetchServiceFields = async () => {
    if (!selectedService) return;

    try {
      setLoading(true);
      const response = await serviceService.getServiceFields(
        selectedService.id
      );
      console.log('response.data', response);
      setServiceFields(response.fields || []);
    } catch (error) {
      console.error("Error fetching service fields:", error);
      setServiceFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    const updatedFormData = {
      ...formData,
      [fieldName]: value,
    };

    onFormDataChange(updatedFormData);

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }

    if (onFormDataChange) {
      onFormDataChange(updatedFormData);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.delivery_address?.trim()) {
      newErrors.delivery_address = "Delivery address is required";
    }

    if (!formData.contact_phone?.trim()) {
      newErrors.contact_phone = "Contact phone is required";
    }

    if (!formData.preferred_date?.trim()) {
      newErrors.preferred_date = "Preferred date is required";
    }

    if (!formData.preferred_time?.trim()) {
      newErrors.preferred_time = "Preferred time is required";
    }

    serviceFields.forEach((field) => {
      if (field.is_required && !formData[field.field_name]?.toString().trim()) {
        newErrors[field.field_name] = `${field.field_label} is required`;
      }

      // Validate number fields with rules
      if (field.validation_rules && formData[field.field_name]) {
        try {
          const rules = JSON.parse(field.validation_rules);
          const value = Number(formData[field.field_name]);

          if (rules.min !== undefined && value < rules.min) {
            newErrors[
              field.field_name
            ] = `${field.field_label} must be at least ${rules.min}`;
          }
          if (rules.max !== undefined && value > rules.max) {
            newErrors[
              field.field_name
            ] = `${field.field_label} must be at most ${rules.max}`;
          }
        } catch (e) {
          console.error("Error parsing validation rules:", e);
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setLoading(true);

    try {
      const isValid = validateForm();
      if (isValid) {
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: ServiceField) => {
    const commonProps = {
      id: field.field_name,
      name: field.field_name,
      placeholder: field.field_placeholder || `Enter ${field.field_label}`,
      required: field.is_required,
      className:
        "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent",
      value: formData[field.field_name] || "",
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => handleInputChange(field.field_name, e.target.value),
    };

    switch (field.field_type) {
      case "textarea":
        return <textarea {...commonProps} rows={4} />;

      case "select":
        let options: string[] = [];
        try {
          if (field.field_options) {
            const parsed = JSON.parse(field.field_options);
            options = Array.isArray(parsed) ? parsed : [];
          }
        } catch (e) {
          console.error("Error parsing field options:", e);
        }

        return (
          <select {...commonProps}>
            <option value="">Select {field.field_label}</option>
            {options.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "number":
        const validationRules = field.validation_rules
          ? JSON.parse(field.validation_rules)
          : {};
        return (
          <input
            {...commonProps}
            type="number"
            min={validationRules.min}
            max={validationRules.max}
          />
        );

      case "date":
        return (
          <input
            {...commonProps}
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
        );

      case "time":
        return <input {...commonProps} type="time" />;

      case "email":
        return <input {...commonProps} type="email" />;

      case "tel":
        return <input {...commonProps} type="tel" />;

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  if (!selectedService) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-8 text-gray-500">
          <span className="material-icons text-4xl mb-2">touch_app</span>
          <h3 className="text-lg font-medium mb-2">Select a Service</h3>
          <p className="text-sm">
            Choose a service from the sidebar to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-6">
          Request {selectedService.name}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <div>Loading service fields...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {serviceFields
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.field_label}
                    {field.is_required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderField(field)}
                  {errors[field.field_name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.field_name]}
                    </p>
                  )}
                </div>
              ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <AddressAutocomplete
                value={formData.delivery_address}
                onChange={(address, coordinates) => {
                  const updatedFormData: any = {
                    ...formData,
                    delivery_address: address,
                  };

                  if (coordinates) {
                    updatedFormData.coordinates = coordinates;
                  }

                  onFormDataChange(updatedFormData);

                  if (errors.delivery_address) {
                    setErrors((prev) => ({
                      ...prev,
                      delivery_address: "",
                    }));
                  }

                  if (onFormDataChange) {
                    onFormDataChange(updatedFormData);
                  }
                }}
                placeholder="Start typing your  address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              {errors.delivery_address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.delivery_address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Phone number for contact during delivery"
                value={formData.contact_phone}
                onChange={(e) =>
                  handleInputChange("contact_phone", e.target.value)
                }
                required
              />
              {errors.contact_phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contact_phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Delivery Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    value={formData.preferred_date}
                    onChange={(e) =>
                      handleInputChange("preferred_date", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {errors.preferred_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.preferred_date}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    value={formData.preferred_time}
                    onChange={(e) =>
                      handleInputChange("preferred_time", e.target.value)
                    }
                    required
                  />
                  {errors.preferred_time && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.preferred_time}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions & Notes
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Any specific requirements, preferences, or additional notes..."
                rows={4}
                value={formData.special_instructions}
                onChange={(e) =>
                  handleInputChange("special_instructions", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "standard", label: "Standard", time: "24-48 hours" },
                  { value: "urgent", label: "Urgent", time: "Same day" },
                  { value: "flexible", label: "Flexible", time: "Next week" },
                ].map((priority) => (
                  <label
                    key={priority.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData.priority === priority.value
                        ? "border-black bg-gray-50 ring-2 ring-black"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      className="mr-2"
                      checked={formData.priority === priority.value}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                    />
                    <div>
                      <div className="font-medium text-sm">
                        {priority.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {priority.time}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pricingBreakdown}
              className="w-full bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Validating..."
                : pricingBreakdown
                ? `Continue to Payment - $${pricingBreakdown.total.toFixed(
                    2
                  )} ${pricingBreakdown.currency}`
                : "Loading pricing..."}
            </button>
          </form>
        )}
      </div>

      {showPaymentModal && selectedService && pricingBreakdown && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          service={selectedService}
          formData={formData}
          pricingBreakdown={pricingBreakdown}
        />
      )}
    </>
  );
};

export default ServiceRequestForm;
