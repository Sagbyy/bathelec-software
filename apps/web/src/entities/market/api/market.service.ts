import { Market } from '@repo/types';
import { apiClient } from '@/shared/api';

export interface CreateMarketDto {
  name: string;
}

export const marketService = {
  getAll: async () => {
    const { data } = await apiClient.get<Market[]>('/markets');
    return data;
  },

  create: async (dto: CreateMarketDto) => {
    const { data } = await apiClient.post<Market>('/markets', dto);
    return data;
  },
};
