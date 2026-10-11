import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { Role, User } from '@repo/types';
import { server } from '@/test/msw/server';
import { useUserStore } from '@/entities/user';
import { TeamDerivationsList } from './team-derivations-list';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const team = {
  id: 3,
  name: 'Équipe Nord',
  teamMemberships: [
    {
      user: {
        id: 7,
        firstName: 'Paul',
        lastName: 'Chef',
        role: Role.SITE_MANAGER,
      },
    },
    {
      user: {
        id: 42,
        firstName: 'Alice',
        lastName: 'Tech',
        role: Role.TECHNICIAN,
      },
    },
  ],
};

const derivation = (overrides: Record<string, unknown>) => ({
  id: 1,
  userId: null,
  teamId: 3,
  team: { id: 3, name: 'Équipe Nord' },
  chantierId: null,
  chantier: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  status: 'Pending',
  correctionComment: null,
  ...overrides,
});

const loginAs = (id: number, role: Role) =>
  useUserStore.setState({
    user: { id, role, firstName: 'X', lastName: 'Y' } as User,
  });

const renderList = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <TeamDerivationsList />
    </QueryClientProvider>
  );
};

describe('TeamDerivationsList', () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE}/site-teams/mine`, () => HttpResponse.json([team]))
    );
  });

  it('lets a technician claim an unassigned derivation and open their own', async () => {
    loginAs(42, Role.TECHNICIAN);
    let claimedId: string | undefined;
    server.use(
      http.get(`${BASE}/derivations/me`, () =>
        HttpResponse.json([
          derivation({ id: 1, userId: null }),
          derivation({ id: 2, userId: 42 }),
        ])
      ),
      http.post(`${BASE}/derivations/:id/claim`, ({ params }) => {
        claimedId = params.id as string;
        return HttpResponse.json(derivation({ id: 1, userId: 42 }));
      })
    );

    renderList();

    const claimButton = await screen.findByRole('button', {
      name: "M'attribuer",
    });
    expect(screen.getByRole('link', { name: 'Ouvrir' })).toHaveAttribute(
      'href',
      '/dashboard/technician/derivations/complete/2'
    );

    await userEvent.click(claimButton);

    await waitFor(() => expect(claimedId).toBe('1'));
  });

  it('lets a site manager assign a derivation to a team member', async () => {
    loginAs(7, Role.SITE_MANAGER);
    let body: unknown;
    server.use(
      http.get(`${BASE}/derivations/me`, () =>
        HttpResponse.json([derivation({ id: 5, userId: null })])
      ),
      http.patch(`${BASE}/derivations/:id/assignee`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(derivation({ id: 5, userId: 42 }));
      })
    );

    renderList();

    const select = await screen.findByRole('combobox', {
      name: 'Attribuer la dérivation 5',
    });
    await screen.findByRole('option', { name: 'Paul Chef (moi)' });

    await userEvent.selectOptions(select, '42');

    await waitFor(() => expect(body).toEqual({ userId: 42 }));
    expect(
      screen.queryByRole('button', { name: "M'attribuer" })
    ).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing is assigned or available', async () => {
    loginAs(42, Role.TECHNICIAN);
    server.use(http.get(`${BASE}/derivations/me`, () => HttpResponse.json([])));

    renderList();

    expect(
      await screen.findByText('Aucune dérivation à traiter.')
    ).toBeInTheDocument();
  });

  it('shows an error when the derivations cannot be loaded', async () => {
    loginAs(42, Role.TECHNICIAN);
    server.use(
      http.get(`${BASE}/derivations/me`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 })
      )
    );

    renderList();

    expect(
      await screen.findByText('Une erreur est survenue')
    ).toBeInTheDocument();
  });
});
