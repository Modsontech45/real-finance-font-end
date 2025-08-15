import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';
import { getAdminData } from '../utils/sessionUtils';
import toast from 'react-hot-toast';

export const useMembers = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Get current admin user data
  const userData = getAdminData();
  // console.log('[useMembers] Admin Data:', userData);

  // Fetch all members
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getMembers();
      console.log('[useMembers] Fetched members:', data);
      setMembers(data);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast.error(error.message || 'Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Invite a new member
  const inviteMember = useCallback(async (email: string) => {
    setIsInviting(true);
    try {
      await userService.inviteMember(email);
      toast.success(`Invitation sent to ${email}`);
      await fetchMembers(); // refresh members after invite
    } catch (error: any) {
      console.error('Error inviting member:', error);
      toast.error(error.message || 'Failed to send invitation');
      throw error;
    } finally {
      setIsInviting(false);
    }
  }, [fetchMembers]);

  // Remove a member by ID
  const removeMember = useCallback(async (id: string) => {
    try {
      await userService.removeMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Member removed successfully');
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.message || 'Failed to remove member');
    }
  }, []);

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    isLoading,
    isInviting,
    inviteMember,
    removeMember,
    refetch: fetchMembers,
    currentUser: userData,
  };
};
