import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { Role, User } from '@repo/types';
import { server } from '@/test/msw/server';
import { useUserStore } from '@/entities/user';
import { CreateDerivationForm } from './create-derivation-form';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const teams = [
  {
    id: 3,
    name: 'Équipe Nord',
    teamMemberships: [
      {
        user: {
          id: 42,
          firstName: 'Alice',
          lastName: 'Tech',
          role: Role.TECHNICIAN,
        },
      },
    ],
  },
];

const renderForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateDerivationForm />
    </QueryClientProvider>
  );
};

describe('CreateDerivationForm', () => {
  let createBody: unknown;

  beforeEach(() => {
    createBody = undefined;
    useUserStore.setState({
      user: { id: 1, role: Role.ADMIN, firstName: 'A', lastName: 'B' } as User,
    });
    server.use(
      http.get(`${BASE}/site-teams/with-users`, () => HttpResponse.json(teams)),
      http.get(`${BASE}/chantiers`, () => HttpResponse.json([])),
      http.post(`${BASE}/derivations`, async ({ request }) => {
        createBody = await request.json();
        return HttpResponse.json({ id: 1 }, { status: 201 });
      })
    );
  });

  it('requires a team before submitting', async () => {
    renderForm();

    await userEvent.click(
      screen.getByRole('button', { name: 'Créer la dérivation' })
    );

    expect(
      await screen.findByText('Veuillez sélectionner une équipe chantier')
    ).toBeInTheDocument();
    expect(createBody).toBeUndefined();
  });

  it('only lists the members of the selected team as technicians', async () => {
    renderForm();

    const [teamSelect, technicianSelect] = screen.getAllByRole(
      'combobox'
    ) as HTMLSelectElement[];
    expect(technicianSelect).toBeDisabled();

    await screen.findByRole('option', { name: 'Équipe Nord' });
    await userEvent.selectOptions(teamSelect!, '3');

    expect(technicianSelect).toBeEnabled();
    expect(
      screen.getByRole('option', { name: 'Alice Tech' })
    ).toBeInTheDocument();
  });

  it('loads only the teams of a technician and hides the technician picker', async () => {
    useUserStore.setState({
      user: {
        id: 42,
        role: Role.TECHNICIAN,
        firstName: 'A',
        lastName: 'T',
      } as User,
    });
    server.use(
      http.get(`${BASE}/site-teams/mine`, () => HttpResponse.json(teams))
    );

    renderForm();

    expect(
      await screen.findByRole('option', { name: 'Équipe Nord' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Technicien (optionnel)')
    ).not.toBeInTheDocument();
  });
});
