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
];
