import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@iconify/react/dist/iconify.js', () => ({ Icon: () => null }));
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

const mockUseChantierDocuments = vi.fn();
vi.mock('../model/use-chantier-documents', () => ({
  useChantierDocuments: (chantierId: number) =>
    mockUseChantierDocuments(chantierId),
}));
vi.mock('../api/chantier-document.service', () => ({
  chantierDocumentService: { getOne: vi.fn() },
}));

import { ChantierDocumentsSection } from './chantier-documents-section';

describe('ChantierDocumentsSection', () => {
  it('shows the empty state when there is no document', () => {
    mockUseChantierDocuments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ChantierDocumentsSection chantierId={1} />);

    expect(screen.getByText('Aucun document disponible.')).toBeInTheDocument();
  });

  it('renders documents with their French type label and a download action', () => {
    mockUseChantierDocuments.mockReturnValue({
      data: [
        {
          id: 'a',
          name: 'Étude 2026',
          type: 'market_study',
          size: 2048,
          chantierId: 1,
          mimeType: 'application/pdf',
          uploadedById: 1,
          createdAt: '',
          updatedAt: '',
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<ChantierDocumentsSection chantierId={1} />);

    expect(screen.getByText('Étude 2026')).toBeInTheDocument();
    expect(screen.getByText('Étude de marché')).toBeInTheDocument();
    expect(screen.getByTitle('Télécharger')).toBeInTheDocument();
  });
});
