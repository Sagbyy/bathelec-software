import { apiClient } from '@/shared/api';
import {
  HabilitationDocument,
  UpdateHabilitationDto,
} from '../model/habilitation.types';

export const habilitationService = {
  getByUserId: async (userId: number): Promise<HabilitationDocument> => {
    const { data } = await apiClient.get<HabilitationDocument>(
      `/habilitations/by-user/${userId}`
    );
    return data;
  },

  upsert: async (
    userId: number,
    dto: UpdateHabilitationDto
  ): Promise<HabilitationDocument> => {
    const { data } = await apiClient.put<HabilitationDocument>(
      `/habilitations/by-user/${userId}`,
      dto
    );
    return data;
  },
};
