import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BASE_RETRY_DELAY_MS } from './backoff';
import { createOutbox, type OutboxEntry } from './outbox';

const httpError = (status: number, message?: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: '',
    data: { message },
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

const networkError = () => new AxiosError('Network Error', 'ERR_NETWORK');

let storeIndex = 0;

const setup = () => {
  let clock = 1_000;
  let idIndex = 0;
  const send = vi.fn<(entry: OutboxEntry<{ value: string }>) => Promise<void>>();
  send.mockResolvedValue(undefined);
  storeIndex += 1;
  const outbox = createOutbox<{ value: string }>({
    name: `outbox-test-${storeIndex}`,
    send,
    now: () => clock,
    generateId: () => `id-${++idIndex}`,
  });
  return {
    outbox,
    send,
    advance: (ms: number) => {
      clock += ms;
    },
  };
};

describe('createOutbox', () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  it('persists enqueued entries per owner', async () => {
    const { outbox } = context;

    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });
    await outbox.enqueue({ ownerId: 2, targetId: 11, payload: { value: 'b' } });

    const entries = await outbox.list(1);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      id: 'id-1',
      ownerId: 1,
      targetId: 10,
      status: 'pending',
      attempts: 0,
    });
  });

  it('keeps a single entry per target, the latest submission winning', async () => {
    const { outbox } = context;

    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'b' } });

    const entries = await outbox.list(1);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.payload).toEqual({ value: 'b' });
  });

  it('removes the entry once the server accepted it', async () => {
    const { outbox, send } = context;
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });

    const outcome = await outbox.flushEntry(1, 10);

    expect(outcome).toEqual({ status: 'sent' });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'id-1', payload: { value: 'a' } })
    );
    expect(await outbox.list(1)).toEqual([]);
  });

  it.each([
    ['a network failure', networkError()],
    ['a server error', httpError(503)],
    ['an expired session', httpError(401)],
    ['a rate limit', httpError(429)],
  ])('keeps the entry and schedules a retry after %s', async (_, error) => {
    const { outbox, send } = context;
    send.mockRejectedValueOnce(error);
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });

    const outcome = await outbox.flushEntry(1, 10);

    expect(outcome).toEqual({ status: 'queued' });
    expect(await outbox.find(1, 10)).toMatchObject({
      status: 'pending',
      attempts: 1,
      nextAttemptAt: 1_000 + BASE_RETRY_DELAY_MS,
    });
  });

  it('backs off exponentially between failed attempts', async () => {
    const { outbox, send, advance } = context;
    send.mockRejectedValue(networkError());
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });

    await outbox.flush(1);
    advance(BASE_RETRY_DELAY_MS);
    await outbox.flush(1);

    expect(send).toHaveBeenCalledTimes(2);
    expect(await outbox.find(1, 10)).toMatchObject({
      attempts: 2,
      nextAttemptAt: 1_000 + BASE_RETRY_DELAY_MS + 2 * BASE_RETRY_DELAY_MS,
    });
  });

  it('does not replay an entry before its retry delay unless forced', async () => {
    const { outbox, send } = context;
    send.mockRejectedValueOnce(networkError());
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });
    await outbox.flush(1);

    await outbox.flush(1);
    expect(send).toHaveBeenCalledTimes(1);

    const report = await outbox.flush(1, { force: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(report.sent).toHaveLength(1);
  });

  it('marks a 4xx rejection with the server message and stops replaying it', async () => {
    const { outbox, send } = context;
    send.mockRejectedValueOnce(
      httpError(409, 'Ce folio est déjà utilisé par la dérivation n°7')
    );
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });

    const report = await outbox.flush(1, { force: true });
    await outbox.flush(1, { force: true });

    expect(send).toHaveBeenCalledTimes(1);
    expect(report.rejected[0]).toMatchObject({
      targetId: 10,
      status: 'rejected',
      lastError: 'Ce folio est déjà utilisé par la dérivation n°7',
    });
    expect(await outbox.find(1, 10)).toMatchObject({ status: 'rejected' });
    expect(await outbox.flushEntry(1, 10)).toEqual({
      status: 'rejected',
      message: 'Ce folio est déjà utilisé par la dérivation n°7',
    });
  });

  it('stops the replay at the first entry still unreachable', async () => {
    const { outbox, send } = context;
    send.mockRejectedValueOnce(networkError());
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });
    await outbox.enqueue({ ownerId: 1, targetId: 11, payload: { value: 'b' } });

    await outbox.flush(1, { force: true });

    expect(send).toHaveBeenCalledTimes(1);
    expect(await outbox.list(1)).toHaveLength(2);
  });

  it('never sends the same entry twice concurrently', async () => {
    const { outbox, send } = context;
    let release: () => void = () => undefined;
    send.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        })
    );
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });

    const first = outbox.flushEntry(1, 10);
    const second = outbox.flush(1, { force: true });
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    release();

    expect(await first).toEqual({ status: 'sent' });
    await second;
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('keeps a newer submission enqueued while an older one was being sent', async () => {
    const { outbox, send } = context;
    let release: () => void = () => undefined;
    send.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        })
    );
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });

    const sending = outbox.flushEntry(1, 10);
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'b' } });
    release();
    await sending;

    expect(await outbox.find(1, 10)).toMatchObject({
      id: 'id-2',
      payload: { value: 'b' },
    });
  });

  it('notifies subscribers on every change', async () => {
    const { outbox } = context;
    const listener = vi.fn();
    const unsubscribe = outbox.subscribe(listener);

    await outbox.enqueue({ ownerId: 1, targetId: 10, payload: { value: 'a' } });
    await outbox.flushEntry(1, 10);
    unsubscribe();
    await outbox.enqueue({ ownerId: 1, targetId: 11, payload: { value: 'b' } });

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
