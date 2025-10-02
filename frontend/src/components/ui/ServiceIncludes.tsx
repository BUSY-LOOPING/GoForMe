import React from 'react';

interface ServiceIncluded {
  id: number;
  service_id: number;
  feature_name: string;
  feature_description: string;
  icon_class?: string;
  sort_order: number;
}

interface ServiceIncludesProps {
  includes: ServiceIncluded[];
}

const ServiceIncludes: React.FC<ServiceIncludesProps> = ({ includes }) => {
  if (includes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h4 className="font-semibold text-lg mb-4">What's Included</h4>
        <div className="text-center py-4 text-gray-500">
          <span className="material-icons text-2xl mb-2">info</span>
          <div className="text-sm">Service details loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h4 className="font-semibold text-lg mb-4">What's Included</h4>
      <ul className="space-y-3">
        {includes
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((include) => (
            <li key={include.id} className="flex items-start">
              {include.icon_class ? (
                <i className={`${include.icon_class} text-green-500 mr-3 text-sm mt-0.5`}></i>
              ) : (
                <span className="material-icons text-green-500 mr-2 text-sm mt-0.5">check_circle</span>
              )}
              <div>
                <span className="text-sm font-medium">{include.feature_name}</span>
                {include.feature_description && (
                  <div className="text-xs text-gray-500 mt-1">{include.feature_description}</div>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ServiceIncludes;
