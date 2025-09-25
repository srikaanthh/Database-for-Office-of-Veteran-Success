
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated || userType !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
