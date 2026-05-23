import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { officialDocumentService } from './official-document.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('officialDocumentService', () => {
  afterEach(() => server.resetHandlers());

  describe('getByUserId', () => {
    it('retourne les documents officiels pour un userId', async () => {
      const data = await officialDocumentService.getByUserId(1);

      expect(data).toMatchObject({ userId: 1 });
      expect(data.idCard).toBe('data:image/jpeg;base64,pieceBase64');
      expect(data.btpCard).toBe('data:image/jpeg;base64,btpBase64');
      expect(data.mutualCard).toBe('data:image/jpeg;base64,mutuelleBase64');
    });

    it('propage le userId dans la requête', async () => {
      const data = await officialDocumentService.getByUserId(42);
      expect(data.userId).toBe(42);
    });

    it('lève une erreur si le serveur répond 404', async () => {
      server.use(
        http.get(`${BASE}/official-documents/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Not found' }, { status: 404 })
        )
      );
      await expect(officialDocumentService.getByUserId(999)).rejects.toThrow();
    });

    it('lève une erreur si le serveur répond 500', async () => {
      server.use(
        http.get(`${BASE}/official-documents/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
        )
      );
      await expect(officialDocumentService.getByUserId(1)).rejects.toThrow();
    });
  });

  describe('createOrUpdate', () => {
    it('envoie un POST et retourne le document créé', async () => {
      const dto = {
        idCard: 'data:image/jpeg;base64,nouvellePiece',
        btpCard: null,
        mutualCard: null,
      };
      const data = await officialDocumentService.createOrUpdate(dto);

      expect(data.idCard).toBe('data:image/jpeg;base64,nouvellePiece');
      expect(data.btpCard).toBeNull();
    });

    it('envoie un POST avec les trois champs', async () => {
      server.use(
        http.post(`${BASE}/official-documents`, async ({ request }) => {
          const body = await request.json() as Record<string, unknown>;
          return HttpResponse.json({
            _id: 'doc2', userId: 1,
            idCard: body.idCard,
            btpCard: body.btpCard,
            mutualCard: body.mutualCard,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          });
        })
      );

      const dto = {
        idCard: 'data:image/jpeg;base64,piece',
        btpCard: 'data:image/jpeg;base64,btp',
        mutualCard: 'data:image/jpeg;base64,mutuelle',
      };
      const data = await officialDocumentService.createOrUpdate(dto);

      expect(data.idCard).toBe('data:image/jpeg;base64,piece');
      expect(data.btpCard).toBe('data:image/jpeg;base64,btp');
      expect(data.mutualCard).toBe('data:image/jpeg;base64,mutuelle');
    });

    it('lève une erreur si le serveur répond 400', async () => {
      server.use(
        http.post(`${BASE}/official-documents`, () =>
          HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
        )
      );
      await expect(
        officialDocumentService.createOrUpdate({ idCard: 'invalid' })
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('envoie un DELETE et retourne le document supprimé', async () => {
      const data = await officialDocumentService.remove(1);

      expect(data.userId).toBe(1);
      expect(data.idCard).toBeNull();
      expect(data.btpCard).toBeNull();
      expect(data.mutualCard).toBeNull();
    });

    it('propage le userId dans la requête DELETE', async () => {
      const data = await officialDocumentService.remove(42);
      expect(data.userId).toBe(42);
    });

    it('lève une erreur si le serveur répond 500', async () => {
      server.use(
        http.delete(`${BASE}/official-documents/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
        )
      );
      await expect(officialDocumentService.remove(1)).rejects.toThrow();
    });
  });
});
