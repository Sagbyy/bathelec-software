import apiClient from './apiClient';
import { User } from '@repo/types';

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const userService = {
  getAllUsers: async () => {
    const { data } = await apiClient.get<User[]>(`/users`);
    return data;
  },

  getUserById: async (userId: number) => {
    const { data } = await apiClient.get<User>(`/users/${userId}`);
    return data;
  },

  updateUser: async (userId: number, updateData: UpdateUserData) => {
    const { data } = await apiClient.put<User>(`/users/${userId}`, updateData);
    return data;
  },
};
