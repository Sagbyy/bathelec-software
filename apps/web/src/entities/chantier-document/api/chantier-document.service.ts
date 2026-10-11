import {
  ChantierDocument,
  ChantierDocumentType,
  ChantierDocumentWithFile,
} from '@repo/types';
import { apiClient } from '@/shared/api';

export interface CreateChantierDocumentInput {
  name: string;
  type: ChantierDocumentType;
  file: string;
}

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

  create: async (chantierId: number, input: CreateChantierDocumentInput) => {
    const { data } = await apiClient.post<ChantierDocument>(
      `/chantier-documents/by-chantier/${chantierId}`,
      input
    );
    return data;
  },

  remove: async (id: string) => {
    await apiClient.delete(`/chantier-documents/${id}`);
  },
};
