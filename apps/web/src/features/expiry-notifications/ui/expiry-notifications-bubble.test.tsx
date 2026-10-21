import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import {
  ACKNOWLEDGEMENT_LABEL,
  ExpiryNotificationsBubble,
} from './expiry-notifications-bubble';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const notification = (id: number, acknowledged = false) => ({
  id,
  technicianId: 4,
  technicianName: 'Jean Tech',
  documentKey: 'drivingLicense',
  documentLabel: 'Permis de conduire',
  expiresAt: '2026-11-16T00:00:00.000Z',
  threshold: 30,
  createdAt: '2026-10-17T07:00:00.000Z',
  acknowledged,
});

const renderBubble = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ExpiryNotificationsBubble />
    </QueryClientProvider>
  );
};

describe('ExpiryNotificationsBubble', () => {
  it('affiche les alertes non confirmées avec la case de prise de connaissance', async () => {
    server.use(
      http.get(`${BASE}/expiry-notifications`, () =>
        HttpResponse.json([notification(1), notification(2, true)])
      )
    );

    renderBubble();

    expect(
      await screen.findByText(
        'Permis de conduire de Jean Tech expire le 16 novembre 2026 (J-30).'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText(ACKNOWLEDGEMENT_LABEL)).toHaveLength(1);
  });

  it('enregistre la prise de connaissance et retire l’alerte', async () => {
    let acknowledged = false;
    server.use(
      http.get(`${BASE}/expiry-notifications`, () =>
        HttpResponse.json([notification(1, acknowledged)])
      ),
      http.post(`${BASE}/expiry-notifications/1/acknowledge`, () => {
        acknowledged = true;
        return HttpResponse.json({});
      })
    );
    const user = userEvent.setup();
    renderBubble();

    await user.click(await screen.findByLabelText(ACKNOWLEDGEMENT_LABEL));

    await waitFor(() =>
      expect(
        screen.queryByLabelText(ACKNOWLEDGEMENT_LABEL)
      ).not.toBeInTheDocument()
    );
    expect(acknowledged).toBe(true);
  });

  it("n'affiche rien sans alerte en attente", async () => {
    server.use(
      http.get(`${BASE}/expiry-notifications`, () =>
        HttpResponse.json([notification(1, true)])
      )
    );

    const { container } = renderBubble();

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it('peut être réduite en pastille', async () => {
    server.use(
      http.get(`${BASE}/expiry-notifications`, () =>
        HttpResponse.json([notification(1)])
      )
    );
    const user = userEvent.setup();
    renderBubble();

    await user.click(
      await screen.findByRole('button', { name: 'Réduire les alertes' })
    );

    expect(
      screen.getByRole('button', { name: "1 alerte(s) d'expiration" })
    ).toBeInTheDocument();
  });
});
