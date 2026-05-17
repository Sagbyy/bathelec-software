import { apiClient } from '@/shared/api';
import {
  CreateVehicleDocumentDto,
  VehicleDocument,
} from '../model/vehicle-document.types';

export const vehicleDocumentService = {
  getByUserId: async (userId: number) => {
    const { data } = await apiClient.get<VehicleDocument>(
      `/vehicle-documents/by-user/${userId}`
    );
    return data;
  },

  createOrUpdate: async (dto: CreateVehicleDocumentDto) => {
    const { data } = await apiClient.post<VehicleDocument>(
      '/vehicle-documents',
      dto
    );
    return data;
  },

  remove: async (userId: number) => {
    const { data } = await apiClient.delete<VehicleDocument>(
      `/vehicle-documents/by-user/${userId}`
    );
    return data;
  },
};
