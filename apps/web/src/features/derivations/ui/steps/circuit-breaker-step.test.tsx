import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import {
  DEFAULT_FORM_VALUES,
  useDerivationStatusStore,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { CircuitBreakerStep } from './circuit-breaker-step';

function Harness() {
  const form = useForm<CreateCompletedDerivation>({
    defaultValues: DEFAULT_FORM_VALUES as unknown as CreateCompletedDerivation,
  });
  return (
    <FormProvider {...form}>
      <CircuitBreakerStep form={form} />
    </FormProvider>
  );
}

const preservedSwitch = () =>
  screen.getAllByRole('switch')[0] as HTMLButtonElement;

describe('CircuitBreakerStep — test du bouton (DTA-49)', () => {
  beforeEach(() => {
    useDerivationStatusStore.setState({ isNotEditable: false });
  });

  it("ne demande pas le test quand le disjoncteur n'est pas conservé", () => {
    render(<Harness />);

    expect(
      screen.queryByText(/Test du bouton « TEST »/)
    ).not.toBeInTheDocument();
  });

  it('demande le test quand le disjoncteur est conservé', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(preservedSwitch());

    expect(screen.getByText(/Test du bouton « TEST »/)).toBeInTheDocument();
    expect(
      screen.queryByText('Bouton test HS : le disjoncteur est à remplacer.')
    ).toBeNull();
  });

  it('signale le remplacement et demande une explication si le bouton est HS', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(preservedSwitch());
    await user.click(screen.getByLabelText('HS'));

    expect(
      screen.getByText('Bouton test HS : le disjoncteur est à remplacer.')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Explication du remplacement/)
    ).toBeInTheDocument();
  });
});
