import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ExpiryNotification } from '@repo/types';

const formatDay = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return format(new Date(year!, month! - 1, day!), 'd MMMM yyyy', {
    locale: fr,
  });
};

export const describeExpiryNotification = (
  notification: Pick<
    ExpiryNotification,
    'documentLabel' | 'technicianName' | 'expiresAt' | 'threshold'
  >
) =>
  `${notification.documentLabel} de ${notification.technicianName} expire le ${formatDay(notification.expiresAt)} (J-${notification.threshold}).`;

export const pendingNotifications = (notifications: ExpiryNotification[]) =>
  notifications.filter((notification) => !notification.acknowledged);
