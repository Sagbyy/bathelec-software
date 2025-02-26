import { ChangePassword } from '@/types/changePassword';
import apiClient from './apiClient';

export const changePasswordService = {
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    userId: number
  ) => {
    const { data } = await apiClient.post<ChangePassword>(
      `/user/change-password/${userId}`,
      { currentPassword, newPassword }
    );
    return data;
  },
};
