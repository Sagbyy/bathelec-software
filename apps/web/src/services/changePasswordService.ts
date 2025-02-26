import { ChangePassword } from '@/types/changePassword';
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
