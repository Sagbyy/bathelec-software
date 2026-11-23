import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chantier, DerivationStatus } from '@repo/types';
import {
  ChantierStatusBadge,
  getChantierStatus,
} from './chantier-status-badge';

const chantierWith = (statuses: DerivationStatus[]) =>
  ({
    id: 1,
    derivations: statuses.map((status, index) => ({ id: index, status })),
  }) as unknown as Chantier;

describe('getChantierStatus', () => {
  it('is not started without derivations', () => {
    expect(getChantierStatus(chantierWith([]))).toBe('not-started');
  });

  it('is finished when every derivation is completed', () => {
    expect(
      getChantierStatus(
        chantierWith([DerivationStatus.COMPLETED, DerivationStatus.COMPLETED])
      )
    ).toBe('finished');
  });

  it('is ongoing while a derivation is not completed', () => {
    expect(
      getChantierStatus(
        chantierWith([DerivationStatus.COMPLETED, DerivationStatus.PENDING])
      )
    ).toBe('ongoing');
  });
});

describe('ChantierStatusBadge', () => {
  it('renders a neutral badge for a chantier to start', () => {
    render(<ChantierStatusBadge chantier={chantierWith([])} />);
    expect(screen.getByText('À démarrer')).toHaveClass('bg-muted');
  });

  it('renders an info badge for an ongoing chantier', () => {
    render(
      <ChantierStatusBadge
        chantier={chantierWith([DerivationStatus.PENDING])}
      />
    );
    expect(screen.getByText('En cours')).toHaveClass('bg-info-soft');
  });

  it('renders a success badge for a finished chantier', () => {
    render(
      <ChantierStatusBadge
        chantier={chantierWith([DerivationStatus.COMPLETED])}
      />
    );
    expect(screen.getByText('Terminé')).toHaveClass('bg-success-soft');
  });
});
