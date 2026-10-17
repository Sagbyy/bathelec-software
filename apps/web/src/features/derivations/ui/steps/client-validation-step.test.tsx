import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  DEFAULT_FORM_VALUES,
  useDerivationStatusStore,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { ClientValidationStep } from './client-validation-step';

vi.mock('react-signature-canvas', () => ({
  default: React.forwardRef(function SignatureCanvasMock(
    _props: unknown,
    _ref: React.Ref<unknown>
  ) {
    return React.createElement('canvas', { 'data-testid': 'signature' });
  }),
}));

function Harness() {
  const form = useForm<CreateCompletedDerivation>({
    defaultValues: DEFAULT_FORM_VALUES as unknown as CreateCompletedDerivation,
  });
  return (
    <FormProvider {...form}>
      <ClientValidationStep form={form} />
    </FormProvider>
  );
}

describe('ClientValidationStep — validation électricien (DTA-60)', () => {
  beforeEach(() => {
    useDerivationStatusStore.setState({ isNotEditable: false });
  });

  it('affiche le commentaire de l’électricien tant que « RAS » n’est pas coché', () => {
    render(<Harness />);

    expect(
      screen.getByPlaceholderText("Commentaires de l'électricien...")
    ).toBeInTheDocument();
  });

  it('masque le commentaire quand « RAS » est coché', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByLabelText(/RAS — rien à signaler/));

    expect(
      screen.queryByPlaceholderText("Commentaires de l'électricien...")
    ).not.toBeInTheDocument();
  });

  it('demande la signature du technicien en plus de celle du client', () => {
    render(<Harness />);

    expect(screen.getByText(/Signature du technicien/)).toBeInTheDocument();
    expect(
      screen.getByText('Signature du client ou du représentant')
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('signature')).toHaveLength(2);
  });
});
