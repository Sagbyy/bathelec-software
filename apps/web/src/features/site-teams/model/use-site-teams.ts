import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  siteTeamsService,
  CreateSiteTeamDto,
  UpdateSiteTeamDto,
  SiteTeam,
  SiteTeamWithUsers,
} from './site-teams-service';

export const useSiteTeams = () => {
  const { data, isLoading, error } = useQuery<SiteTeam[]>({
    queryKey: ['site-teams'],
    queryFn: () => siteTeamsService.getAllTeams(),
  });

  return { data, isLoading, error };
};

export const useSiteTeamsWithUsers = () => {
  const { data, isLoading, error } = useQuery<SiteTeamWithUsers[]>({
    queryKey: ['site-teams', 'with-users'],
    queryFn: () => siteTeamsService.getAllTeamsWithUsers(),
  });

  return { data, isLoading, error };
};

export const useSiteTeamById = (teamId: number) => {
  const { data, isLoading, error } = useQuery<SiteTeam>({
    queryKey: ['site-teams', teamId],
    queryFn: () => siteTeamsService.getTeamById(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading, error };
};

export const useSiteTeamWithUsers = (teamId: number) => {
  const { data, isLoading, error } = useQuery<SiteTeamWithUsers>({
    queryKey: ['site-teams', teamId, 'with-users'],
    queryFn: () => siteTeamsService.getTeamWithUsers(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading, error };
};

export const useUsersInTeam = (teamId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['site-teams', teamId, 'users'],
    queryFn: () => siteTeamsService.getUsersInTeam(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading, error };
};

export const useCreateSiteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createDto: CreateSiteTeamDto) =>
      siteTeamsService.createTeam(createDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-teams'] });
      queryClient.invalidateQueries({ queryKey: ['site-teams', 'with-users'] });
    },
  });
};

export const useUpdateSiteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      updateDto,
    }: {
      teamId: number;
      updateDto: UpdateSiteTeamDto;
    }) => siteTeamsService.updateTeam(teamId, updateDto),
    onSuccess: (updatedTeam, variables) => {
      queryClient.setQueryData(['site-teams', variables.teamId], updatedTeam);
      queryClient.invalidateQueries({ queryKey: ['site-teams'] });
      queryClient.invalidateQueries({ queryKey: ['site-teams', 'with-users'] });
      queryClient.invalidateQueries({
        queryKey: ['site-teams', variables.teamId, 'with-users'],
      });
    },
  });
};

export const useDeleteSiteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: number) => siteTeamsService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-teams'] });
      queryClient.invalidateQueries({ queryKey: ['site-teams', 'with-users'] });
    },
  });
};

export const useAddUserToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      siteTeamsService.addUserToTeam(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['site-teams', 'with-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['site-teams', variables.teamId, 'with-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['site-teams', variables.teamId, 'users'],
      });
    },
  });
};

export const useRemoveUserFromTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      siteTeamsService.removeUserFromTeam(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['site-teams', 'with-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['site-teams', variables.teamId, 'with-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['site-teams', variables.teamId, 'users'],
      });
    },
  });
};
