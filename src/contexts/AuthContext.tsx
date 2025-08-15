import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType, SignupData } from "../types";
import { authService } from "../services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // start with true until we check user
  const [isInitialized, setIsInitialized] = useState(false); // ensures we don't redirect too early

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      // optionally store token in localStorage or cookie if needed
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      await authService.signup(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("token"); // optional: clear token if stored
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        // Only set user if token/session is valid
        if (currentUser && currentUser.token) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true); // prevent early redirects
      }
    };
    loadUser();
  }, []);

  const value = { user, login, logout, signup, isLoading, isInitialized };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
