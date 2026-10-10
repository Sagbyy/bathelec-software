import { ChantierDocument, ChantierDocumentWithFile } from '@repo/types';
import { apiClient } from '@/shared/api';

export const chantierDocumentService = {
  getByChantier: async (chantierId: number) => {
    const { data } = await apiClient.get<ChantierDocument[]>(
      `/chantier-documents/by-chantier/${chantierId}`
    );
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await apiClient.get<ChantierDocumentWithFile>(
      `/chantier-documents/${id}`
    );
    return data;
  },
};
