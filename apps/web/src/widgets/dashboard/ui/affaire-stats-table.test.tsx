import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { AffaireStatsTable } from './affaire-stats-table';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const derivation = (
  id: number,
  status: string,
  internalAffaireNumber: string,
  address: string
) => ({
  id,
  status,
  userId: null,
  teamId: null,
  chantierId: id,
  chantier: {
    id,
    address,
    enedisAffaireNumber: 'ENEDIS',
    internalAffaireNumber,
    marketId: 1,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  correctionComment: null,
});

const renderTable = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AffaireStatsTable />
    </QueryClientProvider>
  );
};

describe('AffaireStatsTable', () => {
  const useDerivations = () =>
    server.use(
      http.get(`${BASE}/derivations`, () =>
        HttpResponse.json([
          derivation(1, 'Completed', 'BA570035', '12 rue de la Paix'),
          derivation(2, 'Reviewing', 'BA570035', '12 rue de la Paix'),
          derivation(3, 'Pending', 'BA570042', '8 avenue Foch'),
        ])
      )
    );

  it('affiche une ligne par affaire avec son avancement', async () => {
    useDerivations();
    renderTable();

    const row = (await screen.findByText('BA570035')).closest('tr')!;
    expect(within(row).getByText('50 %')).toBeInTheDocument();
    expect(within(row).getByText('2')).toBeInTheDocument();

    const other = screen.getByText('BA570042').closest('tr')!;
    expect(within(other).getByText('0 %')).toBeInTheDocument();
  });

  it('filtre les affaires par numéro, sans tenir compte de la casse', async () => {
    useDerivations();
    const user = userEvent.setup();
    renderTable();

    await screen.findByText('BA570035');
    await user.type(
      screen.getByPlaceholderText('Rechercher une affaire...'),
      'ba570042'
    );

    expect(screen.queryByText('BA570035')).not.toBeInTheDocument();
    expect(screen.getByText('BA570042')).toBeInTheDocument();
  });

  it('indique quand aucune affaire ne correspond', async () => {
    server.use(http.get(`${BASE}/derivations`, () => HttpResponse.json([])));
    renderTable();

    expect(
      await screen.findByText('Aucune affaire à afficher.')
    ).toBeInTheDocument();
  });
});
