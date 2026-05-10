import { technicianService } from '@/services/technician.service';
import { Technician } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

export const useTechnicians = () => {
  const { data, isLoading, error } = useQuery<Technician[]>({
    queryKey: ['technicians'],
    queryFn: () => technicianService.getTechnicians(),
  });

  return { data, isLoading, error };
};
