import { computeRetryDelay } from './backoff';
import { createLocalStore } from './local-store';
import { classifySyncError, getSyncErrorMessage } from './sync-error';

export type OutboxEntryStatus = 'pending' | 'rejected';

export interface OutboxEntry<P> {
  id: string;
  ownerId: number;
  targetId: number;
  payload: P;
  status: OutboxEntryStatus;
  attempts: number;
  createdAt: number;
  nextAttemptAt: number;
  lastError?: string;
}

export type FlushOutcome =
  | { status: 'sent' }
  | { status: 'queued' }
  | { status: 'rejected'; message: string };

export interface FlushReport<P> {
  sent: OutboxEntry<P>[];
  rejected: OutboxEntry<P>[];
}

export interface EnqueueInput<P> {
  ownerId: number;
  targetId: number;
  payload: P;
}

interface OutboxOptions<P> {
  name: string;
  send: (entry: OutboxEntry<P>) => Promise<void>;
  now?: () => number;
  generateId?: () => string;
}

export interface Outbox<P> {
  enqueue: (input: EnqueueInput<P>) => Promise<OutboxEntry<P>>;
  list: (ownerId: number) => Promise<OutboxEntry<P>[]>;
  find: (ownerId: number, targetId: number) => Promise<OutboxEntry<P> | undefined>;
  remove: (ownerId: number, targetId: number) => Promise<void>;
  flushEntry: (ownerId: number, targetId: number) => Promise<FlushOutcome>;
  flush: (
    ownerId: number,
    options?: { force?: boolean }
  ) => Promise<FlushReport<P>>;
  subscribe: (listener: () => void) => () => void;
}

const entryKey = (ownerId: number, targetId: number) =>
  `${ownerId}:${targetId}`;

const isDue = <P>(entry: OutboxEntry<P>, now: number, force: boolean) =>
  entry.status === 'pending' && (force || entry.nextAttemptAt <= now);

export const createOutbox = <P>({
  name,
  send,
  now = Date.now,
  generateId = () => crypto.randomUUID(),
}: OutboxOptions<P>): Outbox<P> => {
  const store = createLocalStore<OutboxEntry<P>>(name);
  const listeners = new Set<() => void>();
  const inFlight = new Map<string, Promise<FlushOutcome>>();

  const notify = () => listeners.forEach((listener) => listener());

  const replaceIfCurrent = async (
    entry: OutboxEntry<P>,
    next: OutboxEntry<P> | null
  ) => {
    const key = entryKey(entry.ownerId, entry.targetId);
    const stored = await store.get(key);
    if (stored?.id !== entry.id) {
      return;
    }
    if (next) {
      await store.set(key, next);
    } else {
      await store.delete(key);
    }
    notify();
  };

  const attempt = async (entry: OutboxEntry<P>): Promise<FlushOutcome> => {
    try {
      await send(entry);
      await replaceIfCurrent(entry, null);
      return { status: 'sent' };
    } catch (error) {
      if (classifySyncError(error) === 'rejected') {
        const message = getSyncErrorMessage(error);
        await replaceIfCurrent(entry, {
          ...entry,
          status: 'rejected',
          lastError: message,
        });
        return { status: 'rejected', message };
      }

      const attempts = entry.attempts + 1;
      await replaceIfCurrent(entry, {
        ...entry,
        attempts,
        nextAttemptAt: now() + computeRetryDelay(attempts),
      });
      return { status: 'queued' };
    }
  };

  const attemptOnce = (entry: OutboxEntry<P>) => {
    const key = entryKey(entry.ownerId, entry.targetId);
    const running = inFlight.get(key);
    if (running) {
      return running;
    }
    const pending = attempt(entry).finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
    return pending;
  };

  const list = async (ownerId: number) =>
    (await store.entries())
      .map(([, entry]) => entry)
      .filter((entry) => entry.ownerId === ownerId)
      .sort((a, b) => a.createdAt - b.createdAt);

  return {
    enqueue: async ({ ownerId, targetId, payload }) => {
      const timestamp = now();
      const entry: OutboxEntry<P> = {
        id: generateId(),
        ownerId,
        targetId,
        payload,
        status: 'pending',
        attempts: 0,
        createdAt: timestamp,
        nextAttemptAt: timestamp,
      };
      await store.set(entryKey(ownerId, targetId), entry);
      notify();
      return entry;
    },

    list,

    find: (ownerId, targetId) => store.get(entryKey(ownerId, targetId)),

    remove: async (ownerId, targetId) => {
      await store.delete(entryKey(ownerId, targetId));
      notify();
    },

    flushEntry: async (ownerId, targetId) => {
      const entry = await store.get(entryKey(ownerId, targetId));
      if (!entry) {
        return { status: 'sent' };
      }
      if (entry.status === 'rejected') {
        return {
          status: 'rejected',
          message: entry.lastError ?? getSyncErrorMessage(null),
        };
      }
      return attemptOnce(entry);
    },

    flush: async (ownerId, { force = false } = {}) => {
      const report: FlushReport<P> = { sent: [], rejected: [] };
      const due = (await list(ownerId)).filter((entry) =>
        isDue(entry, now(), force)
      );

      for (const entry of due) {
        const outcome = await attemptOnce(entry);
        if (outcome.status === 'queued') {
          break;
        }
        if (outcome.status === 'sent') {
          report.sent.push(entry);
        } else {
          report.rejected.push({
            ...entry,
            status: 'rejected',
            lastError: outcome.message,
          });
        }
      }

      return report;
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
