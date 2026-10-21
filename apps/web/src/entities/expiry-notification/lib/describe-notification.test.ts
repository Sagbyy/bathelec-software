import { describe, expect, it } from 'vitest';
import { ExpiryNotification } from '@repo/types';
import {
  describeExpiryNotification,
  pendingNotifications,
} from './describe-notification';

const notification: ExpiryNotification = {
  id: 1,
  technicianId: 4,
  technicianName: 'Jean Tech',
  documentKey: 'drivingLicense',
  documentLabel: 'Permis de conduire',
  expiresAt: '2026-11-16T00:00:00.000Z',
  threshold: 30,
  createdAt: '2026-10-17T07:00:00.000Z',
  acknowledged: false,
};

describe('describeExpiryNotification', () => {
  it('décrit le document, son titulaire, sa date et le palier', () => {
    expect(describeExpiryNotification(notification)).toBe(
      'Permis de conduire de Jean Tech expire le 16 novembre 2026 (J-30).'
    );
  });
});

describe('pendingNotifications', () => {
  it('ne garde que les notifications non confirmées', () => {
    expect(
      pendingNotifications([
        notification,
        { ...notification, id: 2, acknowledged: true },
      ]).map(({ id }) => id)
    ).toEqual([1]);
  });
});
