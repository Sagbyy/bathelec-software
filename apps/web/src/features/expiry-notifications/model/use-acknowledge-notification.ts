'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  expiryNotificationQueries,
  expiryNotificationService,
} from '@/entities/expiry-notification';

export const useAcknowledgeNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expiryNotificationService.acknowledge,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: expiryNotificationQueries.mine().queryKey,
      }),
    onError: () =>
      toast.error("La confirmation de lecture n'a pas pu être enregistrée."),
  });
};
