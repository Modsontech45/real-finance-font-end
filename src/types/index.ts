import { AuthResponse } from "../services/authService";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  company?: {
    id: string;
    name: string;
    departments: Department[]; // 👈 add this
  };
  country?: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  roles: UserRole[];
  permissions?: string[];
  isEmailVerified?: boolean;
  created_at?: string;
}

export interface Transaction {
  id: string;
  transactionDate: string;
  department: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  comment: string;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  type: "pdf" | "text";
  content?: string;
  file_url?: string;
  upload_date: string;
  keywords: string[];
}

export interface Subscription {
  id: string;
  plan: "free" | "pro" | "enterprise";
  expirationDate: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  signup: (data: SignupData) => Promise<AuthResponse>;
  refreshUser: () => Promise<User | null>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TransactionFormData {
  date: string;
  name: string;
  amount: number;
  type:  "income" | "expense";
  comment: string;
  department: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
