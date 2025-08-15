import { apiClient } from './api';
import { User } from '../types';
import { getAdminData } from '../utils/sessionUtils';

export interface UserResponse {
  success: boolean;
  data: {
    users?: User[];
    user?: User;
  };
  message: string;
}

// Initialize current user and role
const currentUser = getAdminData();
const userRole = currentUser?.roles?.[0] || '';
console.log('UserService initialized', { user: currentUser, userRole });

class UserService {
  // Fetch all members
async getMembers(): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users');
  console.log('[UserService] /users raw:', response.data);
  return response.data || [];
}




// Invite a new member
async inviteMember(email: string, roles: string[] = ['viewer']): Promise<{ success: boolean }> {
  const response = await apiClient.post<{ success: boolean }>('/users', { email, roles });
  return response.data;
}

  // Remove a member by ID
  async removeMember(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

// Update a member's role
async updateMemberRole(id: string, roles: ('super_admin' | 'viewer')[]): Promise<User> {
  const response = await apiClient.put<UserResponse>(`/users/${id}`, { roles });
  if (!response.data.user) throw new Error('User not found');
  return response.data.user;
}

// Update a member's role
async updateProfile( data: Partial<User>): Promise<User> {
  const response = await apiClient.put<UserResponse>(`/users/me`, data);
  if (!response.data) throw new Error('User not found');
  return response.data;
}
}

// Export a singleton instance
export const userService = new UserService();
