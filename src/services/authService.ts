import { apiClient } from './api';
import { User, SignupData, LoginData } from '../types';
import { getAdminData, setAdminData } from '../utils/sessionUtils';

export interface AuthResponse {
  message: string;
  redirect: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        country: data.country,
        phone: data.phone,
        role: 'admin',
      };

      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
      console.log('[SIGNUP]', response);
      return response;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

async login(data: LoginData): Promise<LoginResponse> {
  try {
    const rawResponse = await apiClient.post<{
      status: string;
      message: string;
      data: {
        user: User;
        accessToken: string;
        refreshToken?: string;
      };
    }>('/auth/login', {
      email: data.email,
      password: data.password,
    });

    const { user, accessToken } = rawResponse.data;

    if (accessToken && user) {
      apiClient.setToken(accessToken);
      setAdminData(user); // Now storing the correct user
    }

    return { token: accessToken, user };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}


  async logout(): Promise<void> {
    try {
      await apiClient.delete('/sessions/current');
    } catch (error: any) {
      console.warn('Logout failed:', error?.response?.data?.error || error.message);
    } finally {
      apiClient.clearToken();
      // Optionally clear session data here
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const cachedUser = getAdminData();
      if (cachedUser) return cachedUser;

      const { data } = await apiClient.get<{ data: User }>('/users/me');
      setAdminData(data);
      return data;
    } catch {
      apiClient.clearToken();
      return null;
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const { data: response } = await apiClient.put<{ user: User }>(`/users/${userId}`, data);
      setAdminData(response.user);
      return response.user;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || error.message);
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const { data: response } = await apiClient.get<{ message: string }>(`/auth/verify-email/${token}`);
      return response;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || error.message);
    }
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    try {
      const { data: response } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
      return response;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || error.message);
    }
  }
}

export const authService = new AuthService();
