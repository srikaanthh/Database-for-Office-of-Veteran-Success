// src/Components/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage to persist across refresh/incognito
  const initialAuth = localStorage.getItem("adminAuthenticated") === "true";
  const initialUserType = initialAuth ? "admin" : "";

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [userType, setUserType] = useState(initialUserType);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userType, setUserType }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
