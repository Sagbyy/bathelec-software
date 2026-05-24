import { http, HttpResponse } from 'msw';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type JsonBody = { [key: string]: unknown };

export const handlers = [
  http.get(`${BASE}/derivations`, () =>
    HttpResponse.json([
      {
        id: 1,
        userId: 1,
        chantierId: 1,
        chantier: {
          id: 1,
          address: '1 rue de la Paix',
          enedisAffaireNumber: 'AFF-001',
          internalAffaireNumber: 'INT-001',
          marketId: 1,
          market: { id: 1, name: 'Marché Test', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        status: 'Pending',
        correctionComment: null,
      },
    ])
  ),

  http.get(`${BASE}/derivations/by-id/:id`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      userId: 1,
      chantierId: 1,
      chantier: {
        id: 1,
        address: '1 rue de la Paix',
        enedisAffaireNumber: 'AFF-001',
        internalAffaireNumber: 'INT-001',
        marketId: 1,
        market: { id: 1, name: 'Marché Test', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      status: 'Pending',
      correctionComment: null,
    })
  ),

  http.get(`${BASE}/derivations/by-user/:userId`, ({ params }) =>
    HttpResponse.json([
      {
        id: 1,
        userId: Number(params.userId),
        chantierId: 1,
        chantier: {
          id: 1,
          address: '1 rue de la Paix',
          enedisAffaireNumber: 'AFF-001',
          internalAffaireNumber: 'INT-001',
          marketId: 1,
          market: { id: 1, name: 'Marché Test', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        status: 'Pending',
        correctionComment: null,
      },
    ])
  ),

  http.get(`${BASE}/chantiers`, () =>
    HttpResponse.json([
      {
        id: 1,
        address: '1 rue de la Paix',
        enedisAffaireNumber: 'AFF-001',
        internalAffaireNumber: 'INT-001',
        marketId: 1,
        market: { id: 1, name: 'Marché Test', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ])
  ),

  http.get(`${BASE}/markets`, () =>
    HttpResponse.json([
      { id: 1, name: 'Marché Test', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    ])
  ),

  http.post(`${BASE}/markets`, async ({ request }) => {
    const body = (await request.json()) as JsonBody;
    return HttpResponse.json(
      {
        id: 2,
        name: body.name,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      { status: 201 }
    );
  }),

  http.post(`${BASE}/chantiers`, async ({ request }) => {
    const body = (await request.json()) as JsonBody;
    return HttpResponse.json(
      {
        id: 2,
        address: body.address,
        enedisAffaireNumber: body.enedisAffaireNumber,
        internalAffaireNumber: body.internalAffaireNumber,
        marketId: body.marketId,
        market: {
          id: body.marketId,
          name: 'Marché Test',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      { status: 201 }
    );
  }),

  http.get(`${BASE}/users/technicians`, () => HttpResponse.json([])),

  http.post(`${BASE}/auth/login`, () =>
    HttpResponse.json({ message: 'Login successful' })
  ),

  http.post(`${BASE}/auth/logout`, () =>
    HttpResponse.json({ message: 'Logout successful' })
  ),

  http.get(`${BASE}/vehicle-documents/by-user/:userId`, ({ params }) =>
    HttpResponse.json({
      _id: 'doc1',
      userId: Number(params.userId),
      vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
      drivingLicense: 'data:image/jpeg;base64,permisBase64',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),

  http.post(`${BASE}/vehicle-documents`, async ({ request }) => {
    const body = (await request.json()) as JsonBody;
    return HttpResponse.json({
      _id: 'doc1',
      userId: 1,
      vehicleRegistration: body.vehicleRegistration ?? null,
      drivingLicense: body.drivingLicense ?? null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  }),

  http.delete(`${BASE}/vehicle-documents/by-user/:userId`, ({ params }) =>
    HttpResponse.json({
      _id: 'doc1',
      userId: Number(params.userId),
      vehicleRegistration: null,
      drivingLicense: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),

  http.get(`${BASE}/official-documents/by-user/:userId`, ({ params }) =>
    HttpResponse.json({
      _id: 'doc2',
      userId: Number(params.userId),
      idCard: 'data:image/jpeg;base64,pieceBase64',
      btpCard: 'data:image/jpeg;base64,btpBase64',
      mutualCard: 'data:image/jpeg;base64,mutuelleBase64',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),

  http.post(`${BASE}/official-documents`, async ({ request }) => {
    const body = (await request.json()) as JsonBody;
    return HttpResponse.json({
      _id: 'doc2',
      userId: 1,
      idCard: body.idCard ?? null,
      btpCard: body.btpCard ?? null,
      mutualCard: body.mutualCard ?? null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  }),

  http.delete(`${BASE}/official-documents/by-user/:userId`, ({ params }) =>
    HttpResponse.json({
      _id: 'doc2',
      userId: Number(params.userId),
      idCard: null,
      btpCard: null,
      mutualCard: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),

  http.get(`${BASE}/special-habilitations/by-user/:userId`, ({ params }) =>
    HttpResponse.json({
      _id: 'hab1',
      userId: Number(params.userId),
      electricalTitle: true,
      electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
      ss4Title: false,
      ss4TitleDoc: null,
      leadTitle: false,
      leadTitleDoc: null,
      sstCertificate: true,
      sstCertificateDoc: 'data:image/jpeg;base64,sstBase64',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),

  http.put(
    `${BASE}/special-habilitations/by-user/:userId`,
    async ({ params, request }) => {
      const body = (await request.json()) as JsonBody;
      return HttpResponse.json({
        _id: 'hab1',
        userId: Number(params.userId),
        electricalTitle: body.electricalTitle ?? false,
        electricalTitleDoc: body.electricalTitleDoc ?? null,
        ss4Title: body.ss4Title ?? false,
        ss4TitleDoc: body.ss4TitleDoc ?? null,
        leadTitle: body.leadTitle ?? false,
        leadTitleDoc: body.leadTitleDoc ?? null,
        sstCertificate: body.sstCertificate ?? false,
        sstCertificateDoc: body.sstCertificateDoc ?? null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    }
  ),
];
