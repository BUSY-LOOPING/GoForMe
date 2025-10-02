import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import NotificationDropdown from '../ui/NotificationDropdown';
import ProfileDropdown from '../ui/ProfileDropdown';
import type { AppDispatch, RootState } from '../../store';
import { fetchServices, fetchServiceCategories } from '../../store/slices/servicesSlice';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedService } = useSelector((state: RootState) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchServiceCategories());
  }, [dispatch]);

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: selectedService?.name || 'Select a Service',
          subtitle: selectedService?.description || 'Choose a service from the sidebar to get started'
        };
      case '/profile':
        return {
          title: 'Profile',
          subtitle: 'Manage your account information'
        };
      case '/orders':
        return {
          title: 'Order History',
          subtitle: 'View all your past orders'
        };
      case '/support':
        return {
          title: 'Support',
          subtitle: 'Get help with your account'
        };
      case '/notifications':
        return {
          title: 'Notifications',
          subtitle: 'View all your notifications'
        };
      case '/settings':
        return {
          title: 'Settings',
          subtitle: 'Manage your preferences'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome back'
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">{subtitle}</p>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
