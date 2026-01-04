import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  usersGroupsService,
  CreateUserGroupDto,
  UpdateUserGroupDto,
  UserGroup,
  UserGroupWithUsers,
} from '@/services/usersGroupsService';

export const useUsersGroups = () => {
  const { data, isLoading, error } = useQuery<UserGroup[]>({
    queryKey: ['users-groups'],
    queryFn: () => usersGroupsService.getAllGroups(),
  });

  return { data, isLoading, error };
};

export const useUsersGroupsWithUsers = () => {
  const { data, isLoading, error } = useQuery<UserGroupWithUsers[]>({
    queryKey: ['users-groups-with-users'],
    queryFn: () => usersGroupsService.getAllGroupsWithUsers(),
  });

  return { data, isLoading, error };
};

export const useUserGroupById = (groupId: number) => {
  const { data, isLoading, error } = useQuery<UserGroup>({
    queryKey: ['user-group', groupId],
    queryFn: () => usersGroupsService.getGroupById(groupId),
    enabled: !!groupId,
  });

  return { data, isLoading, error };
};

export const useUserGroupWithUsers = (groupId: number) => {
  const { data, isLoading, error } = useQuery<UserGroupWithUsers>({
    queryKey: ['user-group-with-users', groupId],
    queryFn: () => usersGroupsService.getGroupWithUsers(groupId),
    enabled: !!groupId,
  });

  return { data, isLoading, error };
};

export const useUsersInGroup = (groupId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users-in-group', groupId],
    queryFn: () => usersGroupsService.getUsersInGroup(groupId),
    enabled: !!groupId,
  });

  return { data, isLoading, error };
};

export const useCreateUserGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createDto: CreateUserGroupDto) =>
      usersGroupsService.createGroup(createDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-groups'] });
      queryClient.invalidateQueries({ queryKey: ['users-groups-with-users'] });
    },
  });
};

export const useUpdateUserGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      updateDto,
    }: {
      groupId: number;
      updateDto: UpdateUserGroupDto;
    }) => usersGroupsService.updateGroup(groupId, updateDto),
    onSuccess: (updatedGroup, variables) => {
      queryClient.setQueryData(['user-group', variables.groupId], updatedGroup);
      queryClient.invalidateQueries({ queryKey: ['users-groups'] });
      queryClient.invalidateQueries({ queryKey: ['users-groups-with-users'] });
      queryClient.invalidateQueries({
        queryKey: ['user-group-with-users', variables.groupId],
      });
    },
  });
};

export const useDeleteUserGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => usersGroupsService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-groups'] });
      queryClient.invalidateQueries({ queryKey: ['users-groups-with-users'] });
    },
  });
};

export const useAddUserToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: number;
      userId: number;
    }) => usersGroupsService.addUserToGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users-groups-with-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-group-with-users', variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ['users-in-group', variables.groupId],
      });
    },
  });
};

export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: number;
      userId: number;
    }) => usersGroupsService.removeUserFromGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users-groups-with-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-group-with-users', variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ['users-in-group', variables.groupId],
      });
    },
  });
};

