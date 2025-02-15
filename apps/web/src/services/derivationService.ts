import { Derivation } from '@repo/types';
import apiClient from './apiClient';

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
};
