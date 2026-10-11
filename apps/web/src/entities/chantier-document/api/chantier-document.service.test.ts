import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { ChantierDocumentType } from '@repo/types';
import { server } from '@/test/msw/server';
import { chantierDocumentService } from './chantier-document.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('chantierDocumentService', () => {
  afterEach(() => server.resetHandlers());

  describe('create', () => {
    it('envoie un POST by-chantier et retourne le document créé', async () => {
      server.use(
        http.post(
          `${BASE}/chantier-documents/by-chantier/:chantierId`,
          async ({ params, request }) => {
            const body = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json({
              _id: 'doc-1',
              chantierId: Number(params.chantierId),
              name: body.name,
              type: body.type,
              mimeType: 'application/pdf',
              size: 1024,
              uploadedById: 1,
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
            });
          }
        )
      );

      const data = await chantierDocumentService.create(5, {
        name: 'Étude',
        type: ChantierDocumentType.MARKET_STUDY,
        file: 'data:application/pdf;base64,JVBERi0=',
      });

      expect(data.chantierId).toBe(5);
      expect(data.name).toBe('Étude');
      expect(data.type).toBe(ChantierDocumentType.MARKET_STUDY);
    });

    it('lève une erreur si le serveur répond 403', async () => {
      server.use(
        http.post(`${BASE}/chantier-documents/by-chantier/:chantierId`, () =>
          HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
        )
      );

      await expect(
        chantierDocumentService.create(5, {
          name: 'x',
          type: ChantierDocumentType.OTHER,
          file: 'data:application/pdf;base64,JVBERi0=',
        })
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('envoie un DELETE sur le document', async () => {
      let called = false;
      server.use(
        http.delete(`${BASE}/chantier-documents/:id`, () => {
          called = true;
          return new HttpResponse(null, { status: 200 });
        })
      );

      await chantierDocumentService.remove('doc-1');
      expect(called).toBe(true);
    });

    it('lève une erreur si le serveur répond 404', async () => {
      server.use(
        http.delete(`${BASE}/chantier-documents/:id`, () =>
          HttpResponse.json({ message: 'Not found' }, { status: 404 })
        )
      );

      await expect(chantierDocumentService.remove('missing')).rejects.toThrow();
    });
  });
});
