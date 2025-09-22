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

  const login = async (
    email: string,
    password: string,
    remember: boolean = false,
  ) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.user && response.token) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
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
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return currentUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      return null;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      await refreshUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshUser]);

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
