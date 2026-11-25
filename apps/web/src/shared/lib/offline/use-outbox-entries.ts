import { useEffect, useState } from 'react';
import type { Outbox, OutboxEntry } from './outbox';

export const useOutboxEntries = <P>(
  outbox: Outbox<P>,
  ownerId: number | undefined
) => {
  const [entries, setEntries] = useState<OutboxEntry<P>[]>([]);

  useEffect(() => {
    if (ownerId === undefined) {
      setEntries([]);
      return;
    }

    let active = true;
    const refresh = () => {
      outbox
        .list(ownerId)
        .then((next) => {
          if (active) setEntries(next);
        })
        .catch(() => undefined);
    };

    refresh();
    const unsubscribe = outbox.subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [outbox, ownerId]);

  return entries;
};
