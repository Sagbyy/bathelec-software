import { Technician } from '@repo/types';
import apiClient from './apiClient';

export const technicianService = {
  getTechnicians: async () => {
    const { data } = await apiClient.get<Technician[]>(`/users/technicians`);
    return data;
  },
};
