import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MultiStepForm } from './multi-step-form';
import { DerivationStatus } from '@repo/types';
import type { Derivation } from '@repo/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/hooks/queries/use-completed-derivations', () => ({
  useCompletedDerivations: () => ({
    mutate: vi.fn(),
    status: 'idle' as const,
    error: null,
  }),
  useCompletedDerivationsById: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

type PhoneInputMockProps = {
  onChange?: (value: string) => void;
  value?: string;
  name?: string;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: string;
};

vi.mock('@/components/ui/phone-input', () => ({
  PhoneInput: React.forwardRef<HTMLInputElement, PhoneInputMockProps>(
    ({ onChange, value, name, onBlur, disabled, placeholder }, ref) => (
      <input
        ref={ref}
        data-testid="phone-input"
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
      />
    )
  ),
}));

const mockDerivation: Derivation = {
  id: 1,
  userId: 1,
  chantierId: null,
  chantier: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  status: DerivationStatus.PENDING,
  correctionComment: null,
};

function renderForm(
  derivation = mockDerivation,
  options: { readOnly?: boolean } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MultiStepForm derivation={derivation} readOnly={options.readOnly} />
    </QueryClientProvider>
  );
}

describe('MultiStepForm — intégration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche l'étape 1 au chargement", () => {
    renderForm();

    expect(screen.getByText('1. Informations client')).toBeInTheDocument();
    expect(screen.getByText(/Étape 1 sur/)).toBeInTheDocument();
  });

  it('affiche le téléphone avec un exemple au format international (DTA-53)', () => {
    renderForm();

    expect(
      screen.getByPlaceholderText('Ex: +33 6 12 34 56 78')
    ).toBeInTheDocument();
  });

  it("le bouton Précédent est désactivé à l'étape 1", () => {
    renderForm();

    const prevButtons = screen.getAllByRole('button', { name: /Précédent/i });
    expect(prevButtons[0]).toBeDisabled();
  });

  it("navigue vers l'étape 2 après validation de l'étape 1", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText('Ex: M. Dupont'), 'M. DUPONT');

    await user.type(screen.getByTestId('phone-input'), '+33612345678');

    await user.type(screen.getByPlaceholderText(/SGX001/), 'SGX001');

    await user.click(screen.getAllByRole('button', { name: /Suivant/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText(/Étape 2 sur/)).toBeInTheDocument();
    });
  });

  it("reste à l'étape 1 si les champs requis sont vides", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getAllByRole('button', { name: /Suivant/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText(/Étape 1 sur/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Étape 2 sur/)).not.toBeInTheDocument();
  });

  it('affiche le formulaire en lecture seule pour un dérivation COMPLETED', () => {
    renderForm({
      ...mockDerivation,
      status: DerivationStatus.COMPLETED,
    });

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it.each([
    DerivationStatus.COMPLETED,
    DerivationStatus.REVIEWING,
    DerivationStatus.INCORRECT,
  ])(
    'navigue sans validation Zod quand la dérivation est désactivée avec le statut %s',
    async (status) => {
      const user = userEvent.setup();

      renderForm({
        ...mockDerivation,
        status,
      });

      await user.click(
        screen.getAllByRole('button', { name: /Suivant/i })[0]!
      );

      await waitFor(() => {
        expect(screen.getByText(/Étape 2 sur/)).toBeInTheDocument();
      });
    }
  );

  it('navigue sans validation Zod quand le formulaire est en readOnly', async () => {
    const user = userEvent.setup();

    renderForm(mockDerivation, { readOnly: true });

    await user.click(screen.getAllByRole('button', { name: /Suivant/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText(/Étape 2 sur/)).toBeInTheDocument();
    });
  });

  it('garde la validation Zod active pour une dérivation à corriger', async () => {
    const user = userEvent.setup();

    renderForm({
      ...mockDerivation,
      status: DerivationStatus.REVISING,
    });

    await user.click(screen.getAllByRole('button', { name: /Suivant/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText(/Étape 1 sur/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Étape 2 sur/)).not.toBeInTheDocument();
  });
});
