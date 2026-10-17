import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { ExportEnedisButton } from './export-enedis-button';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const { saveFile, toastError } = vi.hoisted(() => ({
  saveFile: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('../lib/save-file', () => ({ saveFile }));
vi.mock('sonner', () => ({ toast: { error: toastError } }));

const renderButton = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ExportEnedisButton scope="chantiers" id={5} />
    </QueryClientProvider>
  );
};

describe('ExportEnedisButton', () => {
  beforeEach(() => vi.clearAllMocks());

  it('enregistre le fichier Excel exporté', async () => {
    server.use(
      http.get(
        `${BASE}/derivation-exports/chantiers/5`,
        () =>
          new HttpResponse('xlsx', {
            headers: {
              'Content-Disposition':
                'attachment; filename="export-enedis-chantier-5.xlsx"',
            },
          })
      )
    );
    const user = userEvent.setup();
    renderButton();

    await user.click(
      screen.getByRole('button', { name: /Exporter \(Excel Enedis\)/ })
    );

    await waitFor(() =>
      expect(saveFile).toHaveBeenCalledWith(
        expect.anything(),
        'export-enedis-chantier-5.xlsx'
      )
    );
  });

  it('prévient quand aucun relevé complété n’est exportable', async () => {
    server.use(
      http.get(
        `${BASE}/derivation-exports/chantiers/5`,
        () => new HttpResponse(null, { status: 404 })
      )
    );
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        'Aucun relevé complété à exporter.'
      )
    );
    expect(saveFile).not.toHaveBeenCalled();
  });

  it('signale un échec générique', async () => {
    server.use(
      http.get(
        `${BASE}/derivation-exports/chantiers/5`,
        () => new HttpResponse(null, { status: 500 })
      )
    );
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("L'export Enedis a échoué.")
    );
  });
});
