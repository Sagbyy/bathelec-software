import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { specialHabilitationService } from './special-habilitation.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('specialHabilitationService', () => {
  afterEach(() => server.resetHandlers());

  describe('getByUserId', () => {
    it('retourne les habilitations spéciales pour un userId', async () => {
      const data = await specialHabilitationService.getByUserId(1);

      expect(data).toMatchObject({ userId: 1 });
      expect(data.electricalTitle).toBe(true);
      expect(data.electricalTitleDoc).toBe('data:image/jpeg;base64,elecBase64');
      expect(data.sstCertificate).toBe(true);
    });

    it('propage le userId dans la requête', async () => {
      const data = await specialHabilitationService.getByUserId(42);
      expect(data.userId).toBe(42);
    });

    it('lève une erreur si le serveur répond 404', async () => {
      server.use(
        http.get(`${BASE}/special-habilitations/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Not found' }, { status: 404 })
        )
      );
      await expect(
        specialHabilitationService.getByUserId(999)
      ).rejects.toThrow();
    });

    it('lève une erreur si le serveur répond 500', async () => {
      server.use(
        http.get(`${BASE}/special-habilitations/by-user/:userId`, () =>
          HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        )
      );
      await expect(
        specialHabilitationService.getByUserId(1)
      ).rejects.toThrow();
    });
  });

  describe('upsert', () => {
    it('envoie un PUT et retourne le document mis à jour', async () => {
      const dto = { electricalTitle: true };
      const data = await specialHabilitationService.upsert(1, dto);

      expect(data.electricalTitle).toBe(true);
      expect(data.userId).toBe(1);
    });

    it('peut activer plusieurs habilitations en même temps', async () => {
      server.use(
        http.put(
          `${BASE}/special-habilitations/by-user/:userId`,
          async ({ params, request }) => {
            const body = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json({
              _id: 'hab1',
              userId: Number(params.userId),
              electricalTitle: body.electricalTitle ?? false,
              electricalTitleDoc: body.electricalTitleDoc ?? null,
              ss4Title: body.ss4Title ?? false,
              ss4TitleDoc: null,
              leadTitle: false,
              leadTitleDoc: null,
              sstCertificate: false,
              sstCertificateDoc: null,
            });
          }
        )
      );

      const dto = {
        electricalTitle: true,
        electricalTitleDoc: 'data:image/pdf;base64,newDoc',
        ss4Title: true,
      };
      const data = await specialHabilitationService.upsert(1, dto);

      expect(data.electricalTitle).toBe(true);
      expect(data.electricalTitleDoc).toBe('data:image/pdf;base64,newDoc');
      expect(data.ss4Title).toBe(true);
    });

    it('lève une erreur si le serveur répond 403', async () => {
      server.use(
        http.put(`${BASE}/special-habilitations/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
        )
      );
      await expect(
        specialHabilitationService.upsert(2, { electricalTitle: true })
      ).rejects.toThrow();
    });
  });
});
