import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ChantierDocumentType } from '@repo/types';

vi.mock('@iconify/react/dist/iconify.js', () => ({ Icon: () => null }));

const mockMutate = vi.fn();
vi.mock('@/entities/chantier-document', () => ({
  useDeleteChantierDocument: () => ({ mutate: mockMutate, isPending: false }),
}));

import { ChantierDocumentDeleteButton } from './chantier-document-delete-button';

const documentItem = {
  _id: 'doc-1',
  chantierId: 1,
  name: 'Étude 2026',
  type: ChantierDocumentType.MARKET_STUDY,
  mimeType: 'application/pdf',
  size: 2048,
  uploadedById: 1,
  createdAt: '',
  updatedAt: '',
};

describe('ChantierDocumentDeleteButton', () => {
  beforeEach(() => vi.clearAllMocks());

  it('opens a confirmation dialog and deletes on confirm', async () => {
    render(
      <ChantierDocumentDeleteButton chantierId={1} documentItem={documentItem} />
    );

    fireEvent.click(screen.getByTitle('Supprimer'));

    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText(/supprimer ce document/i)
    ).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate.mock.calls[0]?.[0]).toBe('doc-1');
  });
});
