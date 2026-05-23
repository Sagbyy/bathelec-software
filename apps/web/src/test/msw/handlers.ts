import { http, HttpResponse } from 'msw';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const handlers = [
  http.get(`${BASE}/derivations`, () =>
    HttpResponse.json([
      {
        id: 1,
        userId: 1,
        address: '1 rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
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
      address: '1 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
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
        address: '1 rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        createdAt: '2024-01-01T00:00:00.000Z',
        status: 'Pending',
        correctionComment: null,
      },
    ])
  ),

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
    const body = await request.json() as Record<string, unknown>;
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
      pieceIdentite: 'data:image/jpeg;base64,pieceBase64',
      carteProBtp: 'data:image/jpeg;base64,btpBase64',
      carteMutuelle: 'data:image/jpeg;base64,mutuelleBase64',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),

  http.post(`${BASE}/official-documents`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      _id: 'doc2',
      userId: 1,
      pieceIdentite: body.pieceIdentite ?? null,
      carteProBtp: body.carteProBtp ?? null,
      carteMutuelle: body.carteMutuelle ?? null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  }),

  http.delete(`${BASE}/official-documents/by-user/:userId`, ({ params }) =>
    HttpResponse.json({
      _id: 'doc2',
      userId: Number(params.userId),
      pieceIdentite: null,
      carteProBtp: null,
      carteMutuelle: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),
];
