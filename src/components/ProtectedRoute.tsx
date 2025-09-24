import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // restrict to admin/managers
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    console.log("[ProtectedRoute] User not authenticated:", user);
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const userRoles = user.roles?.map((r) => r.toLowerCase()) || [];
    if (
      !userRoles.includes(UserRole.SUPER_ADMIN) &&
      !userRoles.includes(UserRole.ADMIN) 
    
    ) {
      console.log("[ProtectedRoute] Access denied for roles:", userRoles);
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
