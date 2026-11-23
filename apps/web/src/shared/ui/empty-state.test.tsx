import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the title, description and action', () => {
    render(
      <EmptyState
        title="Aucun chantier"
        description="Créez votre premier chantier"
        action={<button>Créer</button>}
      />
    );
    expect(screen.getByRole('heading', { name: 'Aucun chantier' })).toBeVisible();
    expect(screen.getByText('Créez votre premier chantier')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Créer' })).toBeVisible();
  });

  it('renders without description nor action', () => {
    render(<EmptyState title="Vide" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
