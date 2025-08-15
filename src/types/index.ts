export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // e.g., "tande modson"
  username?: string; // optional if your system uses it
  email: string;
  company?: {
    id: string;
    name: string;
  };
  company_name?: string; // legacy field if needed
  country?: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  roles: 'super_admin' | 'viewer' | string[]; // actual object has ['super_admin']
  permissions?: string[]; // e.g., ['*:*']
  is_verified?: boolean;
  created_at?: string;
}


export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  comment: string;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'pdf' | 'text';
  content?: string;
  file_url?: string;
  upload_date: string;
  keywords: string[];
}

export interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  expirationDate: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
  isLoading: boolean;
}

export interface SignupData {
  firstName:string;
  lastName:string;
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
  type: 'income' | 'expense';
  comment: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
