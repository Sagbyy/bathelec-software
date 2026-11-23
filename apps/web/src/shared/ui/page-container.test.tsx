import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageContainer } from './page-container';

describe('PageContainer', () => {
  it('uses the wide width by default', () => {
    render(<PageContainer>Contenu</PageContainer>);
    expect(screen.getByText('Contenu')).toHaveClass('max-w-7xl');
  });

  it('applies the requested width', () => {
    render(<PageContainer width="narrow">Contenu</PageContainer>);
    expect(screen.getByText('Contenu')).toHaveClass('max-w-2xl');
  });
});
