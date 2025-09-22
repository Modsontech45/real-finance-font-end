import { apiClient } from "./api";
import { User, UserRole } from "../types";

export interface UserResponse {
  success: boolean;
  data: {
    users?: User[];
    user?: User;
  };
  message: string;
}

class UserService {
  // Fetch all members
  async getMembers(): Promise<User[]> {
    const response = await apiClient.get<{ data: User[] }>("/users");
    console.log("[UserService] /users raw:", response);
    return response.data || [];
  }

  // Invite a new member
  async inviteMember(
    email: string,
    roles: UserRole[] = [UserRole.MEMBER],
  ): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>("/users", {
      email,
      roles,
    });
    return response;
  }

  // Remove a member by ID
  async removeMember(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Update a member's role
  async updateMemberRole(id: string, roles: UserRole[]): Promise<User> {
    const response = await apiClient.put<UserResponse>(`/users/${id}`, {
      roles,
    });
    if (!response.data.user) throw new Error("User not found");
    return response.data.user;
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/users/me`, data);
    return response;
  }
}

// Export a singleton instance
export const userService = new UserService();
