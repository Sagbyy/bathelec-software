import apiClient from './api-client';
import { User } from '@repo/types';

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const userService = {
  getCurrentUser: async () => {
    const { data } = await apiClient.get<User>('/users/informations');
    return data;
  },

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

  deleteUser: async (userId: number) => {
    const { data } = await apiClient.delete<User>(`/users/${userId}`);
    return data;
  },
};
