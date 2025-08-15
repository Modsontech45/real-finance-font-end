import React from "react";
import { Navigate } from "react-router-dom";
import { getAdminData } from "../utils/sessionUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const user = getAdminData();

  if (!user) {
    console.log(user);
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.roles?.includes("super_admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
