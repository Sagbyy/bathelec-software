import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('renders the title as the page heading', () => {
    render(<PageHeader title="Chantiers" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Chantiers' })
    ).toBeInTheDocument();
  });

  it('renders the optional eyebrow, description and actions', () => {
    render(
      <PageHeader
        eyebrow="Gestion"
        title="Chantiers"
        description="Tous vos chantiers"
        actions={<button>Créer</button>}
      />
    );
    expect(screen.getByText('Gestion')).toBeInTheDocument();
    expect(screen.getByText('Tous vos chantiers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
  });

  it('omits the actions area when there are no actions', () => {
    const { container } = render(<PageHeader title="Chantiers" />);
    expect(container.querySelectorAll('header > div')).toHaveLength(1);
  });
});
