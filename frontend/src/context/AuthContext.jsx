import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authenticated user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("filmvora_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem("filmvora_token");
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem("filmvora_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    if (response.data.success) {
      localStorage.setItem("filmvora_token", response.data.token);
      setUser(response.data.user);
      return response.data;
    }
  };

  // Register
  const register = async (name, email, password) => {
    const response = await API.post("/auth/register", { name, email, password });
    if (response.data.success) {
      localStorage.setItem("filmvora_token", response.data.token);
      setUser(response.data.user);
      return response.data;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("filmvora_token");
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (userData) => {
    const response = await API.put("/auth/profile", userData);
    if (response.data.success) {
      setUser((prev) => ({ ...prev, ...response.data.user }));
      return response.data;
    }
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
