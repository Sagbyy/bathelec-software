import { queryOptions } from '@tanstack/react-query';
import { ExpiryNotification } from '@repo/types';
import { apiClient } from '@/shared/api';

export const expiryNotificationService = {
  getMine: async () => {
    const { data } = await apiClient.get<ExpiryNotification[]>(
      '/expiry-notifications'
    );
    return data;
  },

  acknowledge: async (notificationId: number) => {
    await apiClient.post(`/expiry-notifications/${notificationId}/acknowledge`);
  },
};

export const expiryNotificationQueries = {
  mine: () =>
    queryOptions({
      queryKey: ['expiry-notifications'],
      queryFn: expiryNotificationService.getMine,
    }),
};
