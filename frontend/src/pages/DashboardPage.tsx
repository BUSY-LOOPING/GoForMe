import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import ServiceRequestForm from "../components/ui/ServiceRequestForm";
import ServiceIncludes from "../components/ui/ServiceIncludes";
import MapView from "../components/ui/MapView";
import { serviceService } from "../services/serviceService";
import { paymentService } from "../services/paymentService";
import type { Service } from "../types";

interface ServiceIncluded {
  id: number;
  service_id: number;
  feature_name: string;
  feature_description: string;
  icon_class?: string;
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

const DashboardPage: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({
    delivery_address: "",
    contact_phone: "",
    preferred_date: "",
    preferred_time: "",
    special_instructions: "",
    priority: "standard",
  });

  const { selectedService, isLoading } = useSelector(
    (state: RootState) => state.services
  );
  const [serviceIncludes, setServiceIncludes] = useState<ServiceIncluded[]>([]);
  const [pricingBreakdown, setPricingBreakdown] =
    useState<PricingBreakdown | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [mapAddress, setMapAddress] = useState<string>("");
  const [mapCoordinates, setMapCoordinates] = useState<
    [number, number] | undefined
  >(undefined);

  useEffect(() => {
    if (selectedService && formData.delivery_address && formData.priority) {
      updatePricing(selectedService, formData);
    }
  }, [selectedService, formData.delivery_address, formData.priority]);

  const fetchServiceIncludes = async () => {
    if (!selectedService) return;

    try {
      setLoadingPricing(true);
      const pricing = await paymentService.getPricingPreview({
        service_id: currentService.id,
        priority: currentFormData.priority || "standard",
        delivery_address: currentFormData.delivery_address,
        form_data: currentFormData,
      });
      setPricingBreakdown(pricing);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoadingPricing(false);
    }
  };

  const calculatePricing = async (formData: any) => {
    if (!selectedService) return;

    try {
      setLoadingPricing(true);
      const response = await serviceService.calculatePrice(
        selectedService.id,
        formData
      );
      setPricingBreakdown(response.data?.pricing || null);
    } catch (error) {
      console.error("Error calculating pricing:", error);
      const basePrice = parseFloat(selectedService.base_price);
      const platformFee = 3;
      const tax = (basePrice + platformFee) * 0.13;
      setPricingBreakdown({
        base_price: basePrice,
        platform_fee: platformFee,
        tax: tax,
        priority_adjustment: 0,
        distance_fee: 0,
        subtotal: basePrice + platformFee,
        total: basePrice + platformFee + tax,
        currency: "CAD",
        tax_rate: 0.13,
        breakdown_details: {
          priority_level: "standard",
          priority_description: "Standard 24-48 hour service",
          tax_description: "HST (13%)",
          includes_distance_fee: false,
        },
      });
    } finally {
      setLoadingPricing(false);
    }
  };

  const updatePricing = async (currentService: Service, currentFormData: Record<string, any>) => {
    if (!currentService || !currentFormData.delivery_address) {
      return;
    }

    try {
      setLoadingPricing(true);
      const pricing = await paymentService.getPricingPreview({
        service_id: currentService.id,
        priority: currentFormData.priority || 'standard',
        delivery_address: currentFormData.delivery_address,
        form_data: currentFormData
      });
      setPricingBreakdown(pricing);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoadingPricing(false);
    }
  };

  const handleFormDataChange = (formData: any) => {
    setFormData(formData);
    
    if (formData.delivery_address !== mapAddress) {
      setMapAddress(formData.delivery_address);
    }
    if (formData.coordinates) {
      setMapCoordinates(formData.coordinates);
    }
    calculatePricing(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-gray-600">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <MapView address={mapAddress} coordinates={mapCoordinates} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ServiceRequestForm
          formData={formData}
            onFormDataChange={handleFormDataChange}
            pricingBreakdown={pricingBreakdown}
          />
        </div>

        <div className="space-y-6">
          <ServiceIncludes includes={serviceIncludes} />

          {selectedService && pricingBreakdown && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-lg mb-4">Pricing Breakdown</h4>

              {loadingPricing ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Service</span>
                    <span className="font-medium">
                      ${pricingBreakdown.base_price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">
                      ${pricingBreakdown.platform_fee.toFixed(2)}
                    </span>
                  </div>

                  {pricingBreakdown.priority_adjustment !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Priority Adjustment</span>
                      <span className="font-medium">
                        {pricingBreakdown.priority_adjustment > 0 ? "+" : ""}$
                        {pricingBreakdown.priority_adjustment.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {pricingBreakdown.distance_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance Fee</span>
                      <span className="font-medium">
                        ${pricingBreakdown.distance_fee.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tax ({(pricingBreakdown.tax_rate * 100).toFixed(0)}%)
                    </span>
                    <span className="font-medium">
                      ${pricingBreakdown.tax.toFixed(2)}
                    </span>
                  </div>

                  <hr className="my-3 border-gray-300" />

                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-lg">
                      ${pricingBreakdown.total.toFixed(2)}{" "}
                      {pricingBreakdown.currency}
                    </span>
                  </div>

                  {pricingBreakdown.breakdown_details && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
                      <div className="flex items-start space-x-2">
                        <span className="material-icons text-gray-700 text-sm mt-0.5">
                          info
                        </span>
                        <p className="text-xs text-gray-700">
                          {
                            pricingBreakdown.breakdown_details
                              .priority_description
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
