import React from "react";
import { Navigate } from "react-router-dom";
import { getAdminData } from "../utils/sessionUtils";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    console.log(user);
    return <Navigate to="/app/login" replace />;
  }

  if (adminOnly && !user.roles?.includes("super_admin")) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
