import { Chantier } from '@repo/types';
import { apiClient } from '@/shared/api';

export const chantierService = {
  getOngoing: async () => {
    const { data } = await apiClient.get<Chantier[]>('/chantiers/ongoing');
    return data;
  },

  getFinished: async () => {
    const { data } = await apiClient.get<Chantier[]>('/chantiers/finished');
    return data;
  },
};
