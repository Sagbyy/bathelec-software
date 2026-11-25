import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { DerivationStatus, Role, type Derivation, type User } from '@repo/types';
import {
  DEFAULT_FORM_VALUES,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { useUserStore } from '@/entities/user';
import { server } from '@/test/msw/server';
import { MultiStepForm } from './multi-step-form';
import { reportDrafts, reportOutbox } from '../model/report-offline-store';
import { REPORT_QUEUED_MESSAGE } from '../model/use-derivation-submit';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('react-signature-canvas', () => ({
  default: React.forwardRef(function SignatureCanvasMock(
    _props: unknown,
    _ref: React.Ref<unknown>
  ) {
    return React.createElement('canvas', { 'data-testid': 'signature' });
  }),
}));

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const OWNER_ID = 5;
const DERIVATION_ID = 31;
const PHOTO = 'data:image/jpeg;base64,abc123';

const derivation: Derivation = {
  id: DERIVATION_ID,
  userId: OWNER_ID,
  chantierId: null,
  chantier: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  status: DerivationStatus.ONGOING,
  correctionComment: null,
  teamId: null,
};

const completeReport = {
  ...DEFAULT_FORM_VALUES,
  clientInfo: {
    name: 'M. MARTIN',
    phone: '+33612345678',
    folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
  },
  generalInfo: {
    dateTime: '2026-01-01T08:00:00.000Z',
    derivationBy: 'Technicien A',
    address: { street: '1 rue de la Paix', postalCode: '75001', city: 'Paris' },
    building: 'Bâtiment A',
    cmIdentification: 'CM001',
    floor: '1er',
    situation: 'Gauche',
    comment: '',
  },
  photoBeforeWork: { photo: PHOTO },
  oldMeter: {
    type: 'standard',
    generation: '',
    preserved: false,
    linkyRefusal: false,
    serialNumber: '123',
    key: 'A',
    dayIndex: '1000',
    nightIndex: '',
    indexPhoto: PHOTO,
  },
  newDerivation: { section: '6mm²', cableType: 'Cuivre', length: 10 },
  newMeter: {
    generation: '1ère',
    serialNumber: '123456789012',
    key: '34',
    dayIndex: '0',
    nightIndex: '',
    indexPhoto: PHOTO,
  },
  circuitBreaker: {
    preserved: false,
    voltage: 'mono',
    brand: 'Schneider',
    type: 'differentiel',
    power: '60',
    calibrationPower: '45A',
    commissioningDone: true,
    sealed: true,
    testButton: null,
    replacementExplanation: '',
  },
  photoAfterWork: { photo: PHOTO, secondPhoto: null, thirdPhoto: null },
  clientValidation: {
    ...DEFAULT_FORM_VALUES.clientValidation,
    present: false,
    technicianComment: 'Câble remplacé',
    technicianNothingToReport: false,
    technicianSignature: 'data:image/png;base64,signature',
  },
} as unknown as CreateCompletedDerivation;

const renderForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MultiStepForm derivation={derivation} />
    </QueryClientProvider>
  );
};

describe('MultiStepForm — local-first (ENF-08)', () => {
  beforeEach(async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
    useUserStore.setState({
      user: { id: OWNER_ID, role: Role.TECHNICIAN } as User,
    });
    server.use(
      http.get(`${BASE}/completed-derivations/:id`, () => HttpResponse.json(null)),
      http.post(`${BASE}/derivations/:id/start`, () => HttpResponse.json({}))
    );
    await reportDrafts.clear(OWNER_ID, DERIVATION_ID);
    await reportOutbox.remove(OWNER_ID, DERIVATION_ID);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    useUserStore.setState({ user: undefined });
  });

  it('restores the draft saved on the device, step included', async () => {
    await reportDrafts.save(OWNER_ID, DERIVATION_ID, {
      values: completeReport,
      step: 2,
    });

    renderForm();

    expect(await screen.findByText(/Étape 2 sur/)).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: /Précédent/i })[0]!);
    expect(screen.getByPlaceholderText('Ex: M. Dupont')).toHaveValue('M. MARTIN');
  });

  it('saves every change locally so a reload loses nothing', async () => {
    const user = userEvent.setup();
    renderForm();
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Ex: M. Dupont')).toBeEnabled()
    );

    await user.type(screen.getByPlaceholderText('Ex: M. Dupont'), 'M. DURAND');

    await waitFor(async () => {
      const draft = await reportDrafts.load(OWNER_ID, DERIVATION_ID);
      expect(draft?.values.clientInfo.name).toBe('M. DURAND');
    });
  });

  it('queues the submission locally when offline and tells the technician', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    await reportDrafts.save(OWNER_ID, DERIVATION_ID, {
      values: completeReport,
      step: 9,
    });
    renderForm();
    expect(await screen.findByText(/Étape 9 sur 9/)).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: /Soumettre/i })[0]!);

    expect(await screen.findByRole('status')).toHaveTextContent(
      REPORT_QUEUED_MESSAGE
    );
    expect(await reportOutbox.find(OWNER_ID, DERIVATION_ID)).toMatchObject({
      status: 'pending',
      payload: expect.objectContaining({ requestedDerivationId: DERIVATION_ID }),
    });
    expect(await reportDrafts.load(OWNER_ID, DERIVATION_ID)).toBeDefined();
  });
});
