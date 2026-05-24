import { Chantier } from '@repo/types';
import { apiClient } from '@/shared/api';

export interface CreateChantierDto {
  address: string;
  enedisAffaireNumber: string;
  internalAffaireNumber: string;
  marketId: number;
}

export const chantierService = {
  getAll: async () => {
    const { data } = await apiClient.get<Chantier[]>('/chantiers');
    return data;
  },

  getOngoing: async () => {
    const { data } = await apiClient.get<Chantier[]>('/chantiers/ongoing');
    return data;
  },

  getFinished: async () => {
    const { data } = await apiClient.get<Chantier[]>('/chantiers/finished');
    return data;
  },

  create: async (dto: CreateChantierDto) => {
    const { data } = await apiClient.post<Chantier>('/chantiers', dto);
    return data;
  },
};
