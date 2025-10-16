import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import api from "../../services/api";

interface RunnerSidebarProps {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
}

const RunnerSidebar: React.FC<RunnerSidebarProps> = ({
  isOnline,
  setIsOnline,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const todayEarnings = 127;
  const jobsCompleted = 8;
  const rating = 4.9;

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

  const navItems = [
    { icon: "work", label: "Available Jobs", path: "/runner/jobs" },
    { icon: "assignment", label: "My Jobs", path: "/runner/my-jobs" },
    { icon: "history", label: "Job History", path: "/runner/history" },
    {
      icon: "account_balance_wallet",
      label: "Earnings",
      path: "/runner/earnings",
    },
    { icon: "star", label: "Reviews", path: "/runner/reviews" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-80 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-3xl text-blue-600">
            directions_run
          </span>
          <div>
            <h1 className="text-2xl font-bold">GoForMe Runner</h1>
            <p className="text-sm text-gray-600">Earn while you help</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="material-icons text-blue-600">person</span>
            </div>
            <div>
              <h3 className="font-medium">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm text-gray-500">{rating} ★ Rating</p>
            </div>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                ${todayEarnings}
              </div>
              <div className="text-xs text-green-700">Today's Earnings</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {jobsCompleted}
              </div>
              <div className="text-xs text-blue-700">Jobs Completed</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isOnline
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <span className="material-icons text-sm mr-2">
                    {isOnline ? "pause" : "play_arrow"}
                  </span>
                  {isOnline ? "Go Offline" : "Go Online"}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="material-icons text-lg mr-3">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">dashboard</span>
            Customer Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">account_circle</span>
            Profile Settings
          </button>
          <button
            onClick={() => navigate("/support")}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons text-lg mr-3">help</span>
            Support
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
          >
            <span className="material-icons text-lg mr-3">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default RunnerSidebar;
