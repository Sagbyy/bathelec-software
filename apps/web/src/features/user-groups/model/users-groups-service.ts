import { apiClient } from '@/shared/api';

export interface UserGroup {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface UserGroupWithUsers extends UserGroup {
  groupMemberships: Array<{ user: GroupMember }>;
}

export interface CreateUserGroupDto {
  name: string;
  description: string;
}

export interface UpdateUserGroupDto {
  name?: string;
  description?: string;
}

export const usersGroupsService = {
  getAllGroups: async () => {
    const { data } = await apiClient.get<UserGroup[]>(`/users-groups`);
    return data;
  },

  getAllGroupsWithUsers: async () => {
    const { data } = await apiClient.get<UserGroupWithUsers[]>(
      `/users-groups/with-users`
    );
    return data;
  },

  getGroupById: async (groupId: number) => {
    const { data } = await apiClient.get<UserGroup>(`/users-groups/${groupId}`);
    return data;
  },

  getGroupWithUsers: async (groupId: number) => {
    const { data } = await apiClient.get<UserGroupWithUsers>(
      `/users-groups/${groupId}/with-users`
    );
    return data;
  },

  getUsersInGroup: async (groupId: number) => {
    const { data } = await apiClient.get<GroupMember[]>(
      `/users-groups/${groupId}/users`
    );
    return data;
  },

  createGroup: async (createDto: CreateUserGroupDto) => {
    const { data } = await apiClient.post<UserGroup>(
      `/users-groups`,
      createDto
    );
    return data;
  },

  updateGroup: async (groupId: number, updateDto: UpdateUserGroupDto) => {
    const { data } = await apiClient.patch<UserGroup>(
      `/users-groups/${groupId}`,
      updateDto
    );
    return data;
  },

  deleteGroup: async (groupId: number) => {
    const { data } = await apiClient.delete(`/users-groups/${groupId}`);
    return data;
  },

  addUserToGroup: async (groupId: number, userId: number) => {
    const { data } = await apiClient.post(
      `/users-groups/${groupId}/users/${userId}`
    );
    return data;
  },

  removeUserFromGroup: async (groupId: number, userId: number) => {
    const { data } = await apiClient.delete(
      `/users-groups/${groupId}/users/${userId}`
    );
    return data;
  },

  getGroupsForUser: async (userId: number) => {
    const { data } = await apiClient.get<UserGroup[]>(
      `/users-groups/user/${userId}/groups`
    );
    return data;
  },
};
