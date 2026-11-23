import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders the label, value and hint', () => {
    render(<StatCard label="Terminé" value={12} hint="Ce mois-ci" />);
    expect(screen.getByText('Terminé')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Ce mois-ci')).toBeInTheDocument();
  });

  it('tints the icon with the requested tone', () => {
    render(
      <StatCard label="Taux" value="75 %" tone="success" icon={<svg data-testid="icon" />} />
    );
    expect(screen.getByTestId('icon').parentElement).toHaveClass(
      'bg-success-soft'
    );
  });
});
