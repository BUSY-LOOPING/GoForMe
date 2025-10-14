import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRunnerRouteProps {
  children: React.ReactNode;
}

const ProtectedRunnerRoute: React.FC<ProtectedRunnerRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.roles?.includes("admin")) {
    return <Navigate to="/admin" replace />;
  }

  const isRunner = user?.roles?.some((role) => role === "runner");
  if (!isRunner) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRunnerRoute;
