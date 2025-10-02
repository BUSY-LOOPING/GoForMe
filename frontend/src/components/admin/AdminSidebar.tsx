import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
        { icon: 'analytics', label: 'Analytics', path: '/admin/analytics' },
        { icon: 'trending_up', label: 'Reports', path: '/admin/reports' },
      ],
    },
    {
      title: 'User Management',
      items: [
        { icon: 'people', label: 'All Users', path: '/admin/users' },
        { icon: 'person_add', label: 'Add User', path: '/admin/users/add' },
        { icon: 'directions_run', label: 'Manage Runners', path: '/admin/runners' },
        { icon: 'block', label: 'Suspended Users', path: '/admin/users/suspended' },
      ],
    },
    {
      title: 'Order Management',
      items: [
        { icon: 'shopping_cart', label: 'All Orders', path: '/admin/orders' },
        { icon: 'pending_actions', label: 'Pending Orders', path: '/admin/orders/pending' },
        { icon: 'report_problem', label: 'Problem Orders', path: '/admin/orders/problems' },
        { icon: 'undo', label: 'Refunds', path: '/admin/refunds' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'support_agent', label: 'Support Tickets', path: '/admin/support' },
        { icon: 'live_help', label: 'Live Chat', path: '/admin/chat' },
        { icon: 'feedback', label: 'User Feedback', path: '/admin/feedback' },
      ],
    },
    {
      title: 'Financial',
      items: [
        { icon: 'account_balance_wallet', label: 'Payouts', path: '/admin/payouts' },
        { icon: 'payment', label: 'Transactions', path: '/admin/transactions' },
        { icon: 'receipt_long', label: 'Revenue Reports', path: '/admin/revenue' },
      ],
    },
    {
      title: 'System',
      items: [
        { icon: 'settings', label: 'System Settings', path: '/admin/settings' },
        { icon: 'security', label: 'Security Logs', path: '/admin/security' },
        { icon: 'backup', label: 'Backups', path: '/admin/backups' },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <nav className="w-80 bg-white shadow-lg flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-3xl" style={{ color: '#0d572d' }}>
            admin_panel_settings
          </span>
          <div>
            <h1 className="text-2xl font-bold text-black">GoForMe Admin</h1>
            <p className="text-sm text-gray-600">System Management</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#0d572d' }}>
              {user?.first_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-black">{user?.first_name} {user?.last_name}</h3>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                        location.pathname === item.path
                          ? 'text-white font-medium'
                          : 'text-black hover:bg-gray-100'
                      }`}
                      style={
                        location.pathname === item.path
                          ? { backgroundColor: '#0d572d' }
                          : {}
                      }
                    >
                      <span className="material-icons text-lg mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100">
            <span className="material-icons text-lg mr-3">help</span>
            Help & Documentation
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;
