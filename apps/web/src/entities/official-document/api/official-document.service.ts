import { apiClient } from '@/shared/api';
import {
  CreateOfficialDocumentDto,
  OfficialDocument,
} from '../model/official-document.types';

export const officialDocumentService = {
  getByUserId: async (userId: number) => {
    const { data } = await apiClient.get<OfficialDocument>(
      `/official-documents/by-user/${userId}`
    );
    return data;
  },

  createOrUpdate: async (dto: CreateOfficialDocumentDto) => {
    const { data } = await apiClient.post<OfficialDocument>(
      '/official-documents',
      dto
    );
    return data;
  },

  remove: async (userId: number) => {
    const { data } = await apiClient.delete<OfficialDocument>(
      `/official-documents/by-user/${userId}`
    );
    return data;
  },
};
