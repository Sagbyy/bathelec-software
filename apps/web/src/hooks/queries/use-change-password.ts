import { changePasswordService } from '@/services/change-password.service';
import { ChangePassword } from '@/types/change-password.types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export const useChangePassword = (): UseMutationResult<
  ChangePassword,
  Error,
  ChangePassword
> => {
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
