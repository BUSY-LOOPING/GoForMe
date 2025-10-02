import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { selectService } from '../../store/slices/servicesSlice';
import type { Service } from '../../types';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { services, categories, selectedService, isLoading } = useSelector(
    (state: RootState) => state.services
  );

  const handleServiceSelect = (service: Service) => {
    dispatch(selectService(service));
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const groupedServices = categories.reduce((acc, category) => {
    acc[category.id] = services.filter(service => service.category_id === category.id);
    return acc;
  }, {} as Record<number, Service[]>);

  return (
    <nav className="w-80 bg-white shadow-lg flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <a href='/dashboard' className="flex items-center space-x-2">
          <span className="material-icons text-3xl" style={{ color: '#0d572d' }}>
            directions_run
          </span>
          <div>
            <h1 className="text-2xl font-bold text-black">GoForMe</h1>
            <p className="text-sm text-gray-600 mt-1">Your Personal Errand Runner</p>
          </div>
        </a>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Available Services
          </h3>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <span className="material-icons text-4xl mb-2">hourglass_empty</span>
              <div>Loading services...</div>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id}>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-3">
                    {category.name}
                  </h4>
                  <div className="space-y-1">
                    {groupedServices[category.id]?.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                          selectedService?.id === service.id
                            ? 'text-white font-medium'
                            : 'text-black hover:bg-gray-100'
                        }`}
                        style={
                          selectedService?.id === service.id
                            ? { backgroundColor: '#0d572d' }
                            : {}
                        }
                      >
                        <i className={`${category.icon} text-lg mr-3`}></i>
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="material-icons text-4xl mb-2">error_outline</span>
              <div>No services available</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">account_circle</span>
            Profile
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">history</span>
            Order History
          </button>
          <button
            onClick={() => navigate('/support')}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">help</span>
            Support
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
