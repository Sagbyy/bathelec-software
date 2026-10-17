import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { derivationService } from './derivation.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('derivationService', () => {
  afterEach(() => server.resetHandlers());

  describe('getDerivations', () => {
    it('returns list of derivations', async () => {
      const data = await derivationService.getDerivations();

      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({ id: 1, chantierId: 1 });
    });

    it('throws when the server returns an error', async () => {
      server.use(
        http.get(`${BASE}/derivations`, () =>
          HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        )
      );

      await expect(derivationService.getDerivations()).rejects.toThrow();
    });
  });

  describe('getDerivationById', () => {
    it('returns the derivation matching the id', async () => {
      const data = await derivationService.getDerivationById(1);

      expect(data).toMatchObject({ id: 1 });
    });

    it('resolves with the requested id', async () => {
      server.use(
        http.get(`${BASE}/derivations/by-id/42`, () =>
          HttpResponse.json({
            id: 42,
            userId: 1,
            chantierId: 2,
            chantier: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            status: 'Pending',
            correctionComment: null,
          })
        )
      );

      const data = await derivationService.getDerivationById(42);
      expect(data.id).toBe(42);
      expect(data.chantierId).toBe(2);
    });
  });

  describe('getDerivationsByUser', () => {
    it('returns derivations for a given user', async () => {
      const data = await derivationService.getDerivationsByUser(1);

      expect(Array.isArray(data)).toBe(true);
      expect(data[0]?.userId).toBe(1);
    });
  });

  describe('assignment workflow', () => {
    it('creates a derivation for a team', async () => {
      let body: unknown;
      server.use(
        http.post(`${BASE}/derivations`, async ({ request }) => {
          body = await request.json();
          return HttpResponse.json({ id: 9, teamId: 1 }, { status: 201 });
        })
      );

      const data = await derivationService.createDerivation({
        teamId: 1,
        chantierId: 2,
      });

      expect(body).toEqual({ teamId: 1, chantierId: 2 });
      expect(data).toMatchObject({ id: 9, teamId: 1 });
    });

    it('fetches the derivations of the current user', async () => {
      server.use(
        http.get(`${BASE}/derivations/me`, () =>
          HttpResponse.json([{ id: 4, userId: null, teamId: 1 }])
        )
      );

      await expect(derivationService.getMyDerivations()).resolves.toEqual([
        { id: 4, userId: null, teamId: 1 },
      ]);
    });

    it('assigns a derivation to a team', async () => {
      let body: unknown;
      server.use(
        http.patch(
          `${BASE}/derivations/:id/team`,
          async ({ request, params }) => {
            body = await request.json();
            return HttpResponse.json({ id: Number(params.id), teamId: 5 });
          }
        )
      );

      const data = await derivationService.assignTeam(3, 5);

      expect(body).toEqual({ teamId: 5 });
      expect(data).toMatchObject({ id: 3, teamId: 5 });
    });

    it('assigns or unassigns a technician', async () => {
      const bodies: unknown[] = [];
      server.use(
        http.patch(`${BASE}/derivations/:id/assignee`, async ({ request }) => {
          bodies.push(await request.json());
          return HttpResponse.json({ id: 3 });
        })
      );

      await derivationService.assignUser(3, 42);
      await derivationService.assignUser(3, null);

      expect(bodies).toEqual([{ userId: 42 }, { userId: null }]);
    });

    it('claims a derivation and surfaces conflicts', async () => {
      server.use(
        http.post(`${BASE}/derivations/:id/claim`, ({ params }) =>
          Number(params.id) === 1
            ? HttpResponse.json({ id: 1, userId: 42 })
            : HttpResponse.json({ message: 'Conflict' }, { status: 409 })
        )
      );

      await expect(derivationService.claimDerivation(1)).resolves.toEqual({
        id: 1,
        userId: 42,
      });
      await expect(derivationService.claimDerivation(2)).rejects.toThrow();
    });
  });

  it('récupère les statistiques de revue (DTA-54)', async () => {
    const stats = {
      completedCount: 4,
      firstTimeValidatedCount: 3,
      firstTimeValidationRate: 75,
      reviewedCount: 5,
      returnedCount: 2,
      returnRate: 40,
      totalReturns: 3,
    };
    server.use(
      http.get(`${BASE}/derivations/stats/review`, () =>
        HttpResponse.json(stats)
      )
    );

    await expect(derivationService.getReviewStats()).resolves.toEqual(stats);
  });
});
