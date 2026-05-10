import { Derivation } from '@repo/types';
import { apiClient } from '@/shared/api';
import { UpdateDerivation } from '../model/update-derivation.types';

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
};
