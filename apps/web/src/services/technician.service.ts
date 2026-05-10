import { Technician } from '@repo/types';
import apiClient from './api-client';

export const technicianService = {
  getTechnicians: async () => {
    const { data } = await apiClient.get<Technician[]>(`/users/technicians`);
    return data;
  },
};
