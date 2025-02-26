import { changePasswordService } from '@/services/changePasswordService';
import { ChangePassword } from '@/types/changePassword';
import { useMutation } from '@tanstack/react-query';

export const useChangePassword = () => {
  return useMutation<ChangePassword, Error, ChangePassword>({
    mutationFn: ({ currentPassword, newPassword }: ChangePassword) =>
      changePasswordService.changePassword(currentPassword, newPassword),
    onSuccess: (data) => {
      console.log('Password changed successfully with data:', data);
    },
    onError: (error) => {
      console.error('Error changing password', error);
    },
  });
};
