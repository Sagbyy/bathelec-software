import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { chantierService } from './chantier.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const chantier = {
  id: 7,
  address: '12 rue de la Paix',
  enedisAffaireNumber: 'ENEDIS-001',
  internalAffaireNumber: 'INT-001',
  marketId: 1,
  startDate: '2026-11-03T00:00:00.000Z',
  endDate: '2026-11-07T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('chantierService', () => {
  afterEach(() => server.resetHandlers());

  it('récupère les chantiers programmés de l’utilisateur', async () => {
    server.use(
      http.get(`${BASE}/chantiers/scheduled`, () =>
        HttpResponse.json([chantier])
      )
    );

    await expect(chantierService.getScheduled()).resolves.toEqual([chantier]);
  });

  it('envoie uniquement les dates lors de la mise à jour du planning', async () => {
    let body: unknown;
    server.use(
      http.patch(`${BASE}/chantiers/:id`, async ({ request, params }) => {
        body = await request.json();
        return HttpResponse.json({ ...chantier, id: Number(params.id) });
      })
    );

    const result = await chantierService.updateSchedule(7, {
      startDate: '2026-11-03',
      endDate: null,
    });

    expect(body).toEqual({ startDate: '2026-11-03', endDate: null });
    expect(result.id).toBe(7);
  });
});
