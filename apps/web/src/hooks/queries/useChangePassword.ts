import { changePasswordService } from '@/services/changePasswordService';
import { ChangePassword } from '@/types/changePassword';
import { useMutation } from '@tanstack/react-query';

export const useChangePassword = (
  currentPassword: string,
  newPassword: string,
  userId: number
) => {
  return useMutation<ChangePassword, Error, ChangePassword>({
    mutationFn: () =>
      changePasswordService.changePassword(
        currentPassword,
        newPassword,
        userId
      ),
    onSuccess: (data) => {
      console.log('Password changed successfully with data:', data);
    },
    onError: (error) => {
      console.error('Error changing password', error);
    },
  });
};
