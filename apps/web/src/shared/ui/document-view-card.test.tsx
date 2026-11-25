import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DocumentViewCard } from './document-view-card';

vi.mock('react-medium-image-zoom', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'zoom' }, children),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

describe('DocumentViewCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 17));
  });

  afterEach(() => vi.useRealTimers());

  it('affiche le document avec son statut de validité sans action de modification', () => {
    render(
      <DocumentViewCard
        label="Permis de conduire"
        value="data:image/png;base64,AAA"
        expiresAt="2026-11-01"
      />
    );

    expect(
      screen.getByRole('img', { name: 'Aperçu Permis de conduire' })
    ).toHaveAttribute('src', 'data:image/png;base64,AAA');
    expect(
      screen.getByText('Expire bientôt (1 novembre 2026)')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/date de fin/i)).not.toBeInTheDocument();
  });

  it("signale l'absence de document", () => {
    render(<DocumentViewCard label="Carte grise" value={null} />);

    expect(screen.getByText('Aucun document')).toBeInTheDocument();
    expect(
      screen.getByText('Document non fourni par le technicien')
    ).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
