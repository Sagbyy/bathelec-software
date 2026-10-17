import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { ScheduledChantiersList } from './scheduled-chantiers-list';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const renderList = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ScheduledChantiersList />
    </QueryClientProvider>
  );
};

describe('ScheduledChantiersList', () => {
  it('affiche les chantiers programmés avec leurs dates', async () => {
    server.use(
      http.get(`${BASE}/chantiers/scheduled`, () =>
        HttpResponse.json([
          {
            id: 1,
            address: '12 rue de la Paix',
            enedisAffaireNumber: 'ENEDIS-001',
            internalAffaireNumber: 'INT-001',
            marketId: 1,
            market: { id: 1, name: 'DR Paris' },
            startDate: '2026-11-03T00:00:00.000Z',
            endDate: '2026-11-07T00:00:00.000Z',
          },
          {
            id: 2,
            address: '8 avenue Foch',
            enedisAffaireNumber: 'ENEDIS-002',
            internalAffaireNumber: 'INT-002',
            marketId: 1,
            market: { id: 1, name: 'DR Paris' },
            startDate: '2026-12-01T00:00:00.000Z',
            endDate: null,
          },
        ])
      )
    );

    renderList();

    expect(
      await screen.findByText('Du 3 novembre 2026 au 7 novembre 2026')
    ).toBeInTheDocument();
    expect(screen.getByText('12 rue de la Paix')).toBeInTheDocument();
    expect(screen.getByText('Le 1 décembre 2026')).toBeInTheDocument();
    expect(screen.getByText('8 avenue Foch')).toBeInTheDocument();
  });

  it('indique quand aucun chantier n’est programmé', async () => {
    server.use(
      http.get(`${BASE}/chantiers/scheduled`, () => HttpResponse.json([]))
    );

    renderList();

    expect(
      await screen.findByText('Aucun chantier programmé pour le moment.')
    ).toBeInTheDocument();
  });

  it('signale une erreur de chargement', async () => {
    server.use(
      http.get(
        `${BASE}/chantiers/scheduled`,
        () => new HttpResponse(null, { status: 500 })
      )
    );

    renderList();

    expect(
      await screen.findByText('Impossible de charger les chantiers programmés.')
    ).toBeInTheDocument();
  });
});
