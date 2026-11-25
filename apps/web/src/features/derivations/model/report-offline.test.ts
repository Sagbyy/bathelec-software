import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { setAuthToken } from '@/shared/api';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import { reportDrafts, reportOutbox } from './report-offline-store';
import { submitReport } from './use-derivation-submit';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const OWNER_ID = 7;
const DERIVATION_ID = 42;
const values = {
  clientInfo: { name: 'M. DUPONT' },
} as unknown as CreateCompletedDerivation;

const captureSubmissions = (
  respond: () => Response = () => HttpResponse.json({}, { status: 201 })
) => {
  const bodies: Record<string, unknown>[] = [];
  server.use(
    http.post(`${BASE}/completed-derivations/`, async ({ request }) => {
      bodies.push((await request.json()) as Record<string, unknown>);
      return respond();
    })
  );
  return bodies;
};

const goOffline = () => vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

describe('report offline submission (ENF-08)', () => {
  beforeEach(async () => {
    setAuthToken('token');
    await reportOutbox.remove(OWNER_ID, DERIVATION_ID);
    await reportDrafts.save(OWNER_ID, DERIVATION_ID, { values, step: 9 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setAuthToken(null);
  });

  it('sends the report with a client submission id and clears the draft', async () => {
    const bodies = captureSubmissions();

    const outcome = await submitReport({
      ownerId: OWNER_ID,
      derivationId: DERIVATION_ID,
      values,
    });

    expect(outcome).toEqual({ status: 'sent' });
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({
      requestedDerivationId: DERIVATION_ID,
      clientSubmissionId: expect.stringMatching(/^[0-9a-f-]{36}$/),
      clientInfo: { name: 'M. DUPONT' },
    });
    expect(await reportOutbox.list(OWNER_ID)).toEqual([]);
    expect(await reportDrafts.load(OWNER_ID, DERIVATION_ID)).toBeUndefined();
  });

  it('queues the report locally without calling the server while offline', async () => {
    const bodies = captureSubmissions();
    goOffline();

    const outcome = await submitReport({
      ownerId: OWNER_ID,
      derivationId: DERIVATION_ID,
      values,
    });

    expect(outcome).toEqual({ status: 'queued' });
    expect(bodies).toHaveLength(0);
    expect(await reportOutbox.find(OWNER_ID, DERIVATION_ID)).toMatchObject({
      status: 'pending',
    });
    expect(await reportDrafts.load(OWNER_ID, DERIVATION_ID)).toBeDefined();
  });

  it('queues the report when the network drops during the request', async () => {
    server.use(
      http.post(`${BASE}/completed-derivations/`, () => HttpResponse.error())
    );

    const outcome = await submitReport({
      ownerId: OWNER_ID,
      derivationId: DERIVATION_ID,
      values,
    });

    expect(outcome).toEqual({ status: 'queued' });
    expect(await reportOutbox.find(OWNER_ID, DERIVATION_ID)).toMatchObject({
      status: 'pending',
      attempts: 1,
    });
  });

  it('surfaces a server rejection, keeps the draft and drops the queued copy', async () => {
    captureSubmissions(() =>
      HttpResponse.json(
        { message: 'Ce folio est déjà utilisé par la dérivation n°7' },
        { status: 409 }
      )
    );

    const outcome = await submitReport({
      ownerId: OWNER_ID,
      derivationId: DERIVATION_ID,
      values,
    });

    expect(outcome).toEqual({
      status: 'rejected',
      message: 'Ce folio est déjà utilisé par la dérivation n°7',
    });
    expect(await reportOutbox.find(OWNER_ID, DERIVATION_ID)).toBeUndefined();
    expect(await reportDrafts.load(OWNER_ID, DERIVATION_ID)).toBeDefined();
  });

  it('replays a queued report with the same submission id', async () => {
    goOffline();
    await submitReport({ ownerId: OWNER_ID, derivationId: DERIVATION_ID, values });
    const queued = await reportOutbox.find(OWNER_ID, DERIVATION_ID);
    vi.restoreAllMocks();
    const bodies = captureSubmissions();

    const report = await reportOutbox.flush(OWNER_ID, { force: true });

    expect(report.sent).toHaveLength(1);
    expect(bodies[0]?.clientSubmissionId).toBe(queued?.id);
    expect(await reportDrafts.load(OWNER_ID, DERIVATION_ID)).toBeUndefined();
  });
});
