import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log('protected', user);
  if (user?.roles?.includes("admin")) {
    console.log('here');
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
