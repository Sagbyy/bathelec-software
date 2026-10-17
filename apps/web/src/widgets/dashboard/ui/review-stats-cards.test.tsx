import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { ReviewStatsCards } from './review-stats-cards';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const renderCards = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReviewStatsCards />
    </QueryClientProvider>
  );
};

describe('ReviewStatsCards', () => {
  it('affiche les taux de validation au premier coup et de retour', async () => {
    server.use(
      http.get(`${BASE}/derivations/stats/review`, () =>
        HttpResponse.json({
          completedCount: 8,
          firstTimeValidatedCount: 6,
          firstTimeValidationRate: 75,
          reviewedCount: 12,
          returnedCount: 6,
          returnRate: 33.3,
          totalReturns: 9,
        })
      )
    );

    renderCards();

    expect(await screen.findByText('75 %')).toBeInTheDocument();
    expect(screen.getByText('33,3 %')).toBeInTheDocument();
    expect(
      screen.getByText(/6 sur 8 dérivation\(s\) terminée/)
    ).toBeInTheDocument();
    expect(screen.getByText(/9 renvoi\(s\) au total/)).toBeInTheDocument();
  });

  it('affiche un tiret quand aucun taux ne peut être calculé', async () => {
    server.use(
      http.get(`${BASE}/derivations/stats/review`, () =>
        HttpResponse.json({
          completedCount: 0,
          firstTimeValidatedCount: 0,
          firstTimeValidationRate: null,
          reviewedCount: 0,
          returnedCount: 0,
          returnRate: null,
          totalReturns: 0,
        })
      )
    );

    renderCards();

    expect(await screen.findAllByText('—')).toHaveLength(2);
  });

  it('signale une erreur de chargement', async () => {
    server.use(
      http.get(
        `${BASE}/derivations/stats/review`,
        () => new HttpResponse(null, { status: 500 })
      )
    );

    renderCards();

    expect(
      await screen.findByText(
        'Impossible de charger les statistiques de revue.'
      )
    ).toBeInTheDocument();
  });
});
