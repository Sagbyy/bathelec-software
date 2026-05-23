import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { vehicleDocumentService } from './vehicle-document.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const mockDocument = {
  _id: 'doc1',
  userId: 1,
  vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
  drivingLicense: 'data:image/jpeg;base64,permisBase64',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('vehicleDocumentService', () => {
  afterEach(() => server.resetHandlers());

  describe('getByUserId', () => {
    it('retourne le document du véhicule pour un userId', async () => {
      const data = await vehicleDocumentService.getByUserId(1);

      expect(data).toMatchObject({ userId: 1 });
      expect(data.vehicleRegistration).toBe('data:image/jpeg;base64,vehicleRegistrationBase64');
      expect(data.drivingLicense).toBe('data:image/jpeg;base64,permisBase64');
    });

    it('propage le userId dans la requête', async () => {
      const data = await vehicleDocumentService.getByUserId(42);

      expect(data.userId).toBe(42);
    });

    it('lève une erreur si le serveur répond 404', async () => {
      server.use(
        http.get(`${BASE}/vehicle-documents/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Not found' }, { status: 404 })
        )
      );

      await expect(vehicleDocumentService.getByUserId(999)).rejects.toThrow();
    });

    it('lève une erreur si le serveur répond 500', async () => {
      server.use(
        http.get(`${BASE}/vehicle-documents/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
        )
      );

      await expect(vehicleDocumentService.getByUserId(1)).rejects.toThrow();
    });
  });

  describe('createOrUpdate', () => {
    it('envoie un POST et retourne le document créé', async () => {
      const dto = {
        vehicleRegistration: 'data:image/jpeg;base64,nouveau',
        drivingLicense: null,
      };

      const data = await vehicleDocumentService.createOrUpdate(dto);

      expect(data.vehicleRegistration).toBe('data:image/jpeg;base64,nouveau');
      expect(data.drivingLicense).toBeNull();
    });

    it('envoie un POST avec les deux champs', async () => {
      server.use(
        http.post(`${BASE}/vehicle-documents`, async ({ request }) => {
          const body = await request.json() as Record<string, unknown>;
          return HttpResponse.json({ ...mockDocument, ...body });
        })
      );

      const dto = {
        vehicleRegistration: 'data:image/jpeg;base64,carte',
        drivingLicense: 'data:image/jpeg;base64,permis',
      };

      const data = await vehicleDocumentService.createOrUpdate(dto);

      expect(data.vehicleRegistration).toBe('data:image/jpeg;base64,carte');
      expect(data.drivingLicense).toBe('data:image/jpeg;base64,permis');
    });

    it('lève une erreur si le serveur répond 400', async () => {
      server.use(
        http.post(`${BASE}/vehicle-documents`, () =>
          HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
        )
      );

      await expect(
        vehicleDocumentService.createOrUpdate({ vehicleRegistration: 'invalid' })
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('envoie un DELETE et retourne le document supprimé', async () => {
      const data = await vehicleDocumentService.remove(1);

      expect(data.userId).toBe(1);
      expect(data.vehicleRegistration).toBeNull();
      expect(data.drivingLicense).toBeNull();
    });

    it('propage le userId dans la requête DELETE', async () => {
      const data = await vehicleDocumentService.remove(42);

      expect(data.userId).toBe(42);
    });

    it('lève une erreur si le serveur répond 500', async () => {
      server.use(
        http.delete(`${BASE}/vehicle-documents/by-user/:userId`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
        )
      );

      await expect(vehicleDocumentService.remove(1)).rejects.toThrow();
    });
  });
});
