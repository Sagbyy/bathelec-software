import { queryOptions } from '@tanstack/react-query';
import { Role } from '@repo/types';
import { apiClient } from '@/shared/api';
import { SiteTeamWithMembers } from '../model/site-team.types';

const MANAGEMENT_ROLES: Role[] = [Role.ADMIN, Role.SUPERVISOR];

export const siteTeamApi = {
  getAllWithMembers: async () => {
    const { data } = await apiClient.get<SiteTeamWithMembers[]>(
      '/site-teams/with-users'
    );
    return data;
  },

  getMine: async () => {
    const { data } =
      await apiClient.get<SiteTeamWithMembers[]>('/site-teams/mine');
    return data;
  },
};

export const siteTeamQueries = {
  allWithMembers: () =>
    queryOptions({
      queryKey: ['site-teams', 'with-users'],
      queryFn: siteTeamApi.getAllWithMembers,
    }),

  mine: () =>
    queryOptions({
      queryKey: ['site-teams', 'mine'],
      queryFn: siteTeamApi.getMine,
    }),

  visibleTo: (role: Role | undefined) =>
    role !== undefined && MANAGEMENT_ROLES.includes(role)
      ? siteTeamQueries.allWithMembers()
      : siteTeamQueries.mine(),
};
