// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const payload = { email, password };
      const response = await axios.post(
        "https://short-url-eight-beta.vercel.app/api/login",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        const { token: newToken, user: userData } = response.data;

        setToken(newToken);
        setUser(userData);

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true };
      }
    } catch (error) {
      let errorMessage = "An error occurred during login. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.response.status === 404) {
          errorMessage = "User not found. Please check your email.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      return { success: false, error: errorMessage };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const payload = { name, email, password };
      const response = await axios.post(
        "https://short-url-eight-beta.vercel.app/api/signup",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message:
            response.data.msg ||
            "Your account has been created. You can now sign in.",
        };
      }
    } catch (error) {
      let errorMessage = "An error occurred during signup. Please try again.";

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { success: true, message: "You have been logged out successfully." };
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
