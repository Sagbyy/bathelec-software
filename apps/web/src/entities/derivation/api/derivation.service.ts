import { queryOptions } from '@tanstack/react-query';
import { Derivation } from '@repo/types';
import { apiClient } from '@/shared/api';
import { UpdateDerivation } from '../model/update-derivation.types';
import { CreateDerivation } from '../model/create-derivation.schema';

export const derivationService = {
  getDerivationsByUser: async (userId: number) => {
    const { data } = await apiClient.get<Derivation[]>(
      `/derivations/by-user/${userId}`
    );
    return data;
  },

  getDerivationById: async (derivationId: number) => {
    const { data } = await apiClient.get<Derivation>(
      `/derivations/by-id/${derivationId}`
    );
    return data;
  },

  getDerivations: async () => {
    const { data } = await apiClient.get<Derivation[]>(`/derivations`);
    return data;
  },

  updateCommentDerivation: async (
    derivationId: number,
    updateDerivation: UpdateDerivation
  ) => {
    const { data } = await apiClient.patch<Derivation>(
      `/derivations/${derivationId}`,
      updateDerivation
    );
    return data;
  },

  createDerivation: async (createDerivation: CreateDerivation) => {
    const { data } = await apiClient.post<Derivation>(
      '/derivations',
      createDerivation
    );
    return data;
  },

  getMyDerivations: async () => {
    const { data } = await apiClient.get<Derivation[]>('/derivations/me');
    return data;
  },

  assignTeam: async (derivationId: number, teamId: number) => {
    const { data } = await apiClient.patch<Derivation>(
      `/derivations/${derivationId}/team`,
      { teamId }
    );
    return data;
  },

  assignUser: async (derivationId: number, userId: number | null) => {
    const { data } = await apiClient.patch<Derivation>(
      `/derivations/${derivationId}/assignee`,
      { userId }
    );
    return data;
  },

  claimDerivation: async (derivationId: number) => {
    const { data } = await apiClient.post<Derivation>(
      `/derivations/${derivationId}/claim`
    );
    return data;
  },
};

export const derivationQueries = {
  mine: () =>
    queryOptions({
      queryKey: ['derivations', 'me'],
      queryFn: derivationService.getMyDerivations,
    }),
};
