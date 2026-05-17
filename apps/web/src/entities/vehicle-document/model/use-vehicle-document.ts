'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehicleDocumentService } from '../api/vehicle-document.service';
import { CreateVehicleDocumentDto } from './vehicle-document.types';

export const VEHICLE_DOCUMENT_QUERY_KEY = 'vehicle-document';

export const useVehicleDocument = (userId: number) => {
  return useQuery({
    queryKey: [VEHICLE_DOCUMENT_QUERY_KEY, userId],
    queryFn: () => vehicleDocumentService.getByUserId(userId),
    enabled: !!userId,
    retry: false,
  });
};

export const useUpsertVehicleDocument = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateVehicleDocumentDto) =>
      vehicleDocumentService.createOrUpdate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_DOCUMENT_QUERY_KEY, userId],
      });
    },
  });
};
