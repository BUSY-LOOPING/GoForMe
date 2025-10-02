import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import api from "../../services/api";

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.first_name) return "U";
    return user.first_name.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await api.post("api/auth/logout").catch(() => {});
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  const menuItems = [
    { icon: "person", label: "Profile", path: "/profile" },
    { icon: "shopping_bag", label: "Order History", path: "/orders" },
    { icon: "support_agent", label: "Support", path: "/support" },
    { icon: "settings", label: "Settings", path: "/settings" },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
          {getInitials()}
        </div>
        <span className="text-sm font-medium text-gray-900">
          {user?.first_name} {user?.last_name}
        </span>
        <span className="material-icons text-gray-600 text-sm">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border-2 border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="material-icons text-gray-600">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
            >
              <span className="material-icons">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
