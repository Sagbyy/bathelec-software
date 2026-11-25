import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '@/test/msw/server';
import { TechnicianDocumentsView } from './technician-documents-view';

vi.mock('react-medium-image-zoom', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function renderView() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <TechnicianDocumentsView technicianId={7} />
    </QueryClientProvider>
  );
}

describe('TechnicianDocumentsView', () => {
  afterEach(() => server.resetHandlers());

  it('affiche les documents officiels et véhicule en lecture seule avec leur statut', async () => {
    server.use(
      http.get(`${BASE}/vehicle-documents/by-user/:userId`, () =>
        HttpResponse.json({
          _id: 'v1',
          userId: 7,
          vehicleRegistration: 'data:image/png;base64,carteGrise',
          vehicleRegistrationExpiresAt: '2020-01-01T00:00:00.000Z',
          drivingLicense: null,
          drivingLicenseExpiresAt: null,
        })
      )
    );

    renderView();

    const vehicleSection = await screen.findByRole('region', {
      name: 'Documents véhicule',
    });
    expect(
      await within(vehicleSection).findByRole('img', {
        name: 'Aperçu Carte grise',
      })
    ).toBeInTheDocument();
    expect(
      within(vehicleSection).getByText(/Expiré depuis le 1 janvier 2020/)
    ).toBeInTheDocument();
    expect(within(vehicleSection).getByText('Aucun document')).toBeInTheDocument();

    const officialSection = screen.getByRole('region', {
      name: 'Documents officiels',
    });
    expect(
      await within(officialSection).findByRole('img', {
        name: "Aperçu Pièce d'identité ou titre de séjour",
      })
    ).toBeInTheDocument();
    expect(
      within(officialSection).getAllByText('Date de validité manquante')
    ).toHaveLength(3);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.querySelector('input')).toBeNull();
  });

  it("signale une erreur de chargement sans masquer l'autre section", async () => {
    server.use(
      http.get(`${BASE}/vehicle-documents/by-user/:userId`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
      )
    );

    renderView();

    expect(
      await screen.findByText('Impossible de charger ces documents.')
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('img', { name: 'Aperçu Carte mutuelle' })
    ).toBeInTheDocument();
  });
});
