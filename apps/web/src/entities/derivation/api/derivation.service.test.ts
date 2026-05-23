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
});
