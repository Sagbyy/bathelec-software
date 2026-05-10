import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UpdateUserData } from '@/entities/user';
import { User } from '@repo/types';

export const useUsers = () => {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });

  return { data, isLoading, error };
};

export const useUserById = (userId: number) => {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });

  return { data, isLoading, error };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserData }) =>
      userService.updateUser(userId, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(['user', variables.userId], updatedUser);

      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      if (variables.data.role) {
        queryClient.invalidateQueries({ queryKey: ['technicians'] });
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
