import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { OfficialDocumentsForm } from './official-documents-form';

vi.mock('react-medium-image-zoom', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

const mockMutate = vi.fn();

vi.mock('@/entities/official-document', () => ({
  useOfficialDocument: vi.fn(),
  useUpsertOfficialDocument: vi.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

vi.mock('@/entities/user', () => ({
  useUserStore: vi.fn((selector: (s: { user: { id: number } }) => unknown) =>
    selector({ user: { id: 1 } })
  ),
}));

import {
  useOfficialDocument,
  useUpsertOfficialDocument,
} from '@/entities/official-document';

const mockUseOfficialDocument = vi.mocked(useOfficialDocument);
const mockUseUpsertOfficialDocument = vi.mocked(useUpsertOfficialDocument);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asHook = (v: unknown) => v as any;

const fullData = {
  _id: 'doc1',
  userId: 1,
  idCard: 'data:image/jpeg;base64,pieceBase64',
  btpCard: 'data:image/jpeg;base64,btpBase64',
  mutualCard: 'data:image/jpeg;base64,mutuelleBase64',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('OfficialDocumentsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUpsertOfficialDocument.mockReturnValue(
      asHook({ mutate: mockMutate, isPending: false })
    );
  });

  describe('état de chargement', () => {
    it('affiche le spinner pendant le chargement', () => {
      mockUseOfficialDocument.mockReturnValue(
        asHook({ data: undefined, isLoading: true })
      );

      const { container } = render(<OfficialDocumentsForm />);
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('rendu avec données', () => {
    beforeEach(() => {
      mockUseOfficialDocument.mockReturnValue(asHook({ data: fullData, isLoading: false }));
    });

    it("affiche le label pièce d'identité", () => {
      render(<OfficialDocumentsForm />);
      expect(screen.getByText("Pièce d'identité")).toBeInTheDocument();
    });

    it('affiche le label carte BTP', () => {
      render(<OfficialDocumentsForm />);
      expect(screen.getByText('Carte professionnelle BTP')).toBeInTheDocument();
    });

    it('affiche le label carte mutuelle', () => {
      render(<OfficialDocumentsForm />);
      expect(screen.getByText('Carte mutuelle')).toBeInTheDocument();
    });

    it('affiche les 3 previews quand tous les documents existent', () => {
      render(<OfficialDocumentsForm />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', 'data:image/jpeg;base64,pieceBase64');
      expect(images[1]).toHaveAttribute('src', 'data:image/jpeg;base64,btpBase64');
      expect(images[2]).toHaveAttribute('src', 'data:image/jpeg;base64,mutuelleBase64');
    });
  });

  describe('rendu sans données', () => {
    beforeEach(() => {
      mockUseOfficialDocument.mockReturnValue(
        asHook({ data: undefined, isLoading: false })
      );
    });

    it('affiche 3 zones de dépôt si aucun document', () => {
      render(<OfficialDocumentsForm />);
      const buttons = screen.getAllByRole('button', { name: /sélectionner un fichier/i });
      expect(buttons).toHaveLength(3);
    });
  });

  describe('upload automatique', () => {
    beforeEach(() => {
      mockUseOfficialDocument.mockReturnValue(
        asHook({ data: undefined, isLoading: false })
      );
    });

    it("appelle mutate après upload de la pièce d'identité", () => {
      const base64 = 'data:image/jpeg;base64,nouvellePiece';
      class MockFileReader {
        result = base64;
        onloadend: (() => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
      vi.stubGlobal('FileReader', MockFileReader);

      const { container } = render(<OfficialDocumentsForm />);
      const inputs = container.querySelectorAll('input[type="file"]');
      fireEvent.change(inputs[0]!, { target: { files: [new File(['img'], 'piece.jpg', { type: 'image/jpeg' })] } });

      expect(mockMutate).toHaveBeenCalledWith({
        idCard: base64,
        btpCard: null,
        mutualCard: null,
      });
      vi.unstubAllGlobals();
    });

    it('appelle mutate après upload de la carte BTP', () => {
      const base64 = 'data:image/jpeg;base64,nouvelleBtp';
      class MockFileReader {
        result = base64;
        onloadend: (() => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
      vi.stubGlobal('FileReader', MockFileReader);

      const { container } = render(<OfficialDocumentsForm />);
      const inputs = container.querySelectorAll('input[type="file"]');
      fireEvent.change(inputs[1]!, { target: { files: [new File(['img'], 'btp.jpg', { type: 'image/jpeg' })] } });

      expect(mockMutate).toHaveBeenCalledWith({
        idCard: null,
        btpCard: base64,
        mutualCard: null,
      });
      vi.unstubAllGlobals();
    });

    it('appelle mutate après upload de la carte mutuelle', () => {
      const base64 = 'data:image/jpeg;base64,nouvelleMutuelle';
      class MockFileReader {
        result = base64;
        onloadend: (() => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
      vi.stubGlobal('FileReader', MockFileReader);

      const { container } = render(<OfficialDocumentsForm />);
      const inputs = container.querySelectorAll('input[type="file"]');
      fireEvent.change(inputs[2]!, { target: { files: [new File(['img'], 'mutuelle.jpg', { type: 'image/jpeg' })] } });

      expect(mockMutate).toHaveBeenCalledWith({
        idCard: null,
        btpCard: null,
        mutualCard: base64,
      });
      vi.unstubAllGlobals();
    });
  });

  describe('suppression automatique', () => {
    beforeEach(() => {
      mockUseOfficialDocument.mockReturnValue(asHook({ data: fullData, isLoading: false }));
    });

    it("appelle mutate avec idCard=null quand on supprime la pièce d'identité", async () => {
      render(<OfficialDocumentsForm />);
      fireEvent.click(screen.getAllByRole('button')[0]!);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          idCard: null,
          btpCard: 'data:image/jpeg;base64,btpBase64',
          mutualCard: 'data:image/jpeg;base64,mutuelleBase64',
        });
      });
    });

    it('appelle mutate avec btpCard=null quand on supprime la carte BTP', async () => {
      render(<OfficialDocumentsForm />);
      fireEvent.click(screen.getAllByRole('button')[1]!);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          idCard: 'data:image/jpeg;base64,pieceBase64',
          btpCard: null,
          mutualCard: 'data:image/jpeg;base64,mutuelleBase64',
        });
      });
    });

    it('appelle mutate avec mutualCard=null quand on supprime la carte mutuelle', async () => {
      render(<OfficialDocumentsForm />);
      fireEvent.click(screen.getAllByRole('button')[2]!);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          idCard: 'data:image/jpeg;base64,pieceBase64',
          btpCard: 'data:image/jpeg;base64,btpBase64',
          mutualCard: null,
        });
      });
    });
  });

  describe('état pending', () => {
    it('désactive les 3 boutons quand isPending=true', () => {
      mockUseOfficialDocument.mockReturnValue(
        asHook({ data: undefined, isLoading: false })
      );
      mockUseUpsertOfficialDocument.mockReturnValue(
        asHook({ mutate: mockMutate, isPending: true })
      );

      render(<OfficialDocumentsForm />);
      screen.getAllByRole('button').forEach((btn) => expect(btn).toBeDisabled());
    });
  });
});
