import { CompletedDerivation } from '@repo/types';
import { apiClient } from '@/shared/api';
import { CreateCompletedDerivation } from '../model/completed-derivation.types';

export const completedDerivationsService = {
  createCompletedDerivation: async (
    completedDerivation: CreateCompletedDerivation
  ) => {
    const { data } = await apiClient.post<CreateCompletedDerivation>(
      '/completed-derivations/',
      completedDerivation
    );
    return data;
  },
  getCompletedDerivationsById: async (derivationId: number) => {
    const { data } = await apiClient.get<CompletedDerivation>(
      `/completed-derivations/${derivationId}`
    );
    return data;
  },
};
