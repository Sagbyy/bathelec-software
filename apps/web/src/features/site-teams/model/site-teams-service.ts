import { apiClient } from '@/shared/api';

export interface SiteTeam {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface SiteTeamWithUsers extends SiteTeam {
  teamMemberships: Array<{ user: TeamMember }>;
}

export interface CreateSiteTeamDto {
  name: string;
  description: string;
}

export interface UpdateSiteTeamDto {
  name?: string;
  description?: string;
}

export const siteTeamsService = {
  getAllTeams: async () => {
    const { data } = await apiClient.get<SiteTeam[]>(`/site-teams`);
    return data;
  },

  getAllTeamsWithUsers: async () => {
    const { data } = await apiClient.get<SiteTeamWithUsers[]>(
      `/site-teams/with-users`
    );
    return data;
  },

  getTeamById: async (teamId: number) => {
    const { data } = await apiClient.get<SiteTeam>(`/site-teams/${teamId}`);
    return data;
  },

  getTeamWithUsers: async (teamId: number) => {
    const { data } = await apiClient.get<SiteTeamWithUsers>(
      `/site-teams/${teamId}/with-users`
    );
    return data;
  },

  getUsersInTeam: async (teamId: number) => {
    const { data } = await apiClient.get<TeamMember[]>(
      `/site-teams/${teamId}/users`
    );
    return data;
  },

  createTeam: async (createDto: CreateSiteTeamDto) => {
    const { data } = await apiClient.post<SiteTeam>(
      `/site-teams`,
      createDto
    );
    return data;
  },

  updateTeam: async (teamId: number, updateDto: UpdateSiteTeamDto) => {
    const { data } = await apiClient.patch<SiteTeam>(
      `/site-teams/${teamId}`,
      updateDto
    );
    return data;
  },

  deleteTeam: async (teamId: number) => {
    const { data } = await apiClient.delete(`/site-teams/${teamId}`);
    return data;
  },

  addUserToTeam: async (teamId: number, userId: number) => {
    const { data } = await apiClient.post(
      `/site-teams/${teamId}/users/${userId}`
    );
    return data;
  },

  removeUserFromTeam: async (teamId: number, userId: number) => {
    const { data } = await apiClient.delete(
      `/site-teams/${teamId}/users/${userId}`
    );
    return data;
  },

  getTeamsForUser: async (userId: number) => {
    const { data } = await apiClient.get<SiteTeam[]>(
      `/site-teams/user/${userId}/teams`
    );
    return data;
  },
};
