import {
  ChantierDocument,
  ChantierDocumentType,
  ChantierDocumentWithFile,
} from '@repo/types';
import { apiClient } from '@/shared/api';

export interface UploadChantierDocumentDto {
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

  upload: async (chantierId: number, dto: UploadChantierDocumentDto) => {
    const { data } = await apiClient.post<ChantierDocument>(
      `/chantier-documents/by-chantier/${chantierId}`,
      dto
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete(`/chantier-documents/${id}`);
    return data;
  },
};
