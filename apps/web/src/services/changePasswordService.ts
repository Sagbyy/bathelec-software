import { ChangePassword } from '@/types/change-password.types';
import apiClient from './apiClient';

export const changePasswordService = {
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await apiClient.post<ChangePassword>(
      '/users/change-password/',
      { currentPassword, newPassword }
    );
    return data;
  },
};
