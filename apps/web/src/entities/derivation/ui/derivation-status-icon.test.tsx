import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DerivationStatus } from '@repo/types';
import DerivationStatusIcon from './derivation-status-icon';
import { derivationStatusConfig } from '../model/derivation-status.config';

describe('DerivationStatusIcon', () => {
  it.each(Object.values(DerivationStatus))(
    'shows the label of the %s status',
    (status) => {
      render(<DerivationStatusIcon derivationStatus={status} />);
      expect(
        screen.getByText(derivationStatusConfig[status].text)
      ).toBeInTheDocument();
    }
  );

  it('uses the success tone for completed derivations', () => {
    render(
      <DerivationStatusIcon derivationStatus={DerivationStatus.COMPLETED} />
    );
    expect(screen.getByText('Terminé')).toHaveClass('bg-success-soft');
  });

  it('uses the brand tone for derivations awaiting correction', () => {
    render(<DerivationStatusIcon derivationStatus={DerivationStatus.REVISING} />);
    expect(screen.getByText('En attente de correction')).toHaveClass(
      'bg-primary-soft'
    );
  });
});
