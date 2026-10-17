'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BellRing, X } from 'lucide-react';
import {
  describeExpiryNotification,
  expiryNotificationQueries,
  pendingNotifications,
} from '@/entities/expiry-notification';
import { Button } from '@/shared/ui/button';
import { useAcknowledgeNotification } from '../model/use-acknowledge-notification';

export const ACKNOWLEDGEMENT_LABEL =
  "Je confirme avoir bien pris connaissance de l'information.";

export function ExpiryNotificationsBubble() {
  const [isOpen, setIsOpen] = useState(true);
  const { data: notifications = [] } = useQuery(
    expiryNotificationQueries.mine()
  );
  const acknowledge = useAcknowledgeNotification();
  const pending = pendingNotifications(notifications);

  if (pending.length === 0) return null;

  if (!isOpen) {
    return (
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 gap-2 rounded-full bg-orange-500 shadow-lg hover:bg-orange-600"
        aria-label={`${pending.length} alerte(s) d'expiration`}
      >
        <BellRing className="h-4 w-4" />
        {pending.length}
      </Button>
    );
  }

  return (
    <section
      aria-label="Alertes d'expiration"
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-orange-200 bg-white p-4 shadow-xl"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-semibold text-orange-700">
          <BellRing className="h-4 w-4" />
          Documents bientôt expirés
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsOpen(false)}
          aria-label="Réduire les alertes"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ul className="max-h-80 space-y-3 overflow-y-auto">
        {pending.map((notification) => (
          <li
            key={notification.id}
            className="rounded-lg bg-orange-50 p-3 text-sm text-gray-800"
          >
            <p>{describeExpiryNotification(notification)}</p>
            <label className="mt-2 flex items-start gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-orange-500"
                disabled={acknowledge.isPending}
                onChange={() => acknowledge.mutate(notification.id)}
              />
              {ACKNOWLEDGEMENT_LABEL}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
