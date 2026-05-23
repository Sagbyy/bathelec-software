import { apiClient } from '@/shared/api';
import {
  SpecialHabilitationDocument,
  UpdateSpecialHabilitationDto,
} from '../model/special-habilitation.types';

export const specialHabilitationService = {
  getByUserId: async (userId: number): Promise<SpecialHabilitationDocument> => {
    const { data } = await apiClient.get<SpecialHabilitationDocument>(
      `/special-habilitations/by-user/${userId}`
    );
    return data;
  },

  upsert: async (
    userId: number,
    dto: UpdateSpecialHabilitationDto
  ): Promise<SpecialHabilitationDocument> => {
    const { data } = await apiClient.put<SpecialHabilitationDocument>(
      `/special-habilitations/by-user/${userId}`,
      dto
    );
    return data;
  },
};
