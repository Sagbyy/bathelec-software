import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DerivationStatus } from '@repo/types';
import { FormStatusCards } from './form-status-cards';

const derivations = vi.hoisted(() => ({
  data: [] as { status: string }[] | undefined,
}));

vi.mock('@/features/derivations', () => ({
  useDerivation: () => ({ data: derivations.data }),
}));

describe('FormStatusCards', () => {
  it('counts derivations per status', () => {
    derivations.data = [
      { status: DerivationStatus.COMPLETED },
      { status: DerivationStatus.COMPLETED },
      { status: DerivationStatus.PENDING },
    ];
    render(<FormStatusCards />);

    const completed = screen.getByText('Terminé').closest('div.rounded-xl');
    const pending = screen.getByText('À compléter').closest('div.rounded-xl');
    expect(completed).toHaveTextContent('2');
    expect(pending).toHaveTextContent('1');
  });

  it('shows zero for every status when there is no data', () => {
    derivations.data = undefined;
    render(<FormStatusCards />);

    expect(screen.getAllByText('0')).toHaveLength(
      Object.values(DerivationStatus).length
    );
  });
});
