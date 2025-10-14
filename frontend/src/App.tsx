import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import GoogleCallback from "./pages/AuthCallback";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import SupportPage from "./pages/SupportPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import OrderDetailsPage from "./pages/OrderDetailsPage";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProtectedAdminRoute from "./components/layout/ProtectedAdminRoute";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserCreatePage from "./pages/admin/AdminUserCreatePage";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage";
import AdminUserEditPage from "./pages/admin/AdminUserEditPage";
import ProtectedRunnerRoute from "./components/layout/ProtectedRunnerRoute";
import RunnerLayout from "./components/runner/RunnerLayout";
import AvailableJobsPage from "./pages/runner/AvailableJobsPage";
// import './clash-display.css';

const App: React.FC = () => {
  useEffect(() => {
    const materialIconsLink = document.createElement("link");
    materialIconsLink.href =
      "https://fonts.googleapis.com/icon?family=Material+Icons";
    materialIconsLink.rel = "stylesheet";
    document.head.appendChild(materialIconsLink);

    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    fontAwesomeLink.rel = "stylesheet";
    document.head.appendChild(fontAwesomeLink);

    return () => {
      document.head.removeChild(materialIconsLink);
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
          </Route>
          <Route
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboardPage />} />

            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route
              path="/admin/users/create"
              element={<AdminUserCreatePage />}
            />
            <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
            <Route
              path="/admin/users/:id/edit"
              element={<AdminUserEditPage />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/runner"
            element={
              <ProtectedRunnerRoute>
                <RunnerLayout />
              </ProtectedRunnerRoute>
            }
          >
            <Route index element={<Navigate to="/runner/jobs" replace />} />
            <Route path="jobs" element={<AvailableJobsPage />} />
            <Route
              path="my-jobs"
              element={<div className="p-6">My Jobs - Coming Soon</div>}
            />
            <Route
              path="history"
              element={<div className="p-6">Job History - Coming Soon</div>}
            />
            <Route
              path="earnings"
              element={<div className="p-6">Earnings - Coming Soon</div>}
            />
            <Route
              path="reviews"
              element={<div className="p-6">Reviews - Coming Soon</div>}
            />
          </Route>
          ;
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
