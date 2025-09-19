import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, AuthContextType, SignupData } from "../types";
import { authService } from "../services/authService";
import { getAdminData } from "../utils/sessionUtils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(getAdminData());
  const [isLoading, setIsLoading] = useState(true);

  // Token management utilities
  const getStoredToken = useCallback(() => {
    // Check sessionStorage first (temporary session)
    const sessionToken = sessionStorage.getItem("auth_token");
    if (sessionToken) return sessionToken;

    // Check localStorage for "remember me" tokens
    return localStorage.getItem("auth_token");
  }, []);

  const storeToken = useCallback((token: string, remember: boolean = false) => {
    if (remember) {
      // Store in localStorage for persistent login
      localStorage.setItem("auth_token", token);
      sessionStorage.removeItem("auth_token"); // Clean session storage
    } else {
      // Store in sessionStorage for session-only login
      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token"); // Clean localStorage
    }
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }, []);

  const login = async (
    email: string,
    password: string,
    remember: boolean = false
  ) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.user && response.token) {
        setUser(response.user);
        storeToken(response.token, remember);
      }

      return response;
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(data);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    try {
      authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      clearTokens();
    }
  }, [clearTokens]);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return currentUser;
      } else {
        // Token is invalid, clear everything
        clearTokens();
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      clearTokens();
      setUser(null);
      return null;
    }
  }, [getStoredToken, clearTokens]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        // No token found, user is not authenticated
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Token exists, verify it's still valid
      await refreshUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, [getStoredToken, refreshUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional: Clear session storage on component unmount
      // sessionStorage.removeItem("auth_token");
    };
  }, []);

  const value = {
    user,
    login,
    logout,
    signup,
    refreshUser,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
