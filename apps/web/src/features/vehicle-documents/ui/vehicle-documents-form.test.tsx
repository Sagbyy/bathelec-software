import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { VehicleDocumentsForm } from './vehicle-documents-form';

vi.mock('react-medium-image-zoom', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

const mockMutate = vi.fn();

vi.mock('@/entities/vehicle-document', () => ({
  useVehicleDocument: vi.fn(),
  useUpsertVehicleDocument: vi.fn(() => ({
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
  useVehicleDocument,
  useUpsertVehicleDocument,
} from '@/entities/vehicle-document';

const mockUseVehicleDocument = vi.mocked(useVehicleDocument);
const mockUseUpsertVehicleDocument = vi.mocked(useUpsertVehicleDocument);

describe('VehicleDocumentsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUpsertVehicleDocument.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as ReturnType<typeof useUpsertVehicleDocument>);
  });

  describe('état de chargement', () => {
    it('affiche le spinner pendant le chargement', () => {
      mockUseVehicleDocument.mockReturnValue({
        data: undefined,
        isLoading: true,
      } as ReturnType<typeof useVehicleDocument>);

      const { container } = render(<VehicleDocumentsForm />);
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('rendu avec données', () => {
    beforeEach(() => {
      mockUseVehicleDocument.mockReturnValue({
        data: {
          _id: 'doc1',
          userId: 1,
          carteGrise: 'data:image/jpeg;base64,carte',
          permisDeConduire: 'data:image/jpeg;base64,permis',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        isLoading: false,
      } as ReturnType<typeof useVehicleDocument>);
    });

    it('affiche le label carte grise', () => {
      render(<VehicleDocumentsForm />);
      expect(screen.getByText('Carte grise')).toBeInTheDocument();
    });

    it('affiche le label permis de conduire', () => {
      render(<VehicleDocumentsForm />);
      expect(screen.getByText('Permis de conduire')).toBeInTheDocument();
    });

    it('affiche les previews si les documents existent', () => {
      render(<VehicleDocumentsForm />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'data:image/jpeg;base64,carte');
      expect(images[1]).toHaveAttribute('src', 'data:image/jpeg;base64,permis');
    });
  });

  describe('rendu sans données', () => {
    beforeEach(() => {
      mockUseVehicleDocument.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as ReturnType<typeof useVehicleDocument>);
    });

    it('affiche les zones de dépôt si aucun document', () => {
      render(<VehicleDocumentsForm />);
      const buttons = screen.getAllByRole('button', {
        name: /sélectionner un fichier/i,
      });
      expect(buttons).toHaveLength(2);
    });
  });

  describe('upload automatique', () => {
    beforeEach(() => {
      mockUseVehicleDocument.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as ReturnType<typeof useVehicleDocument>);
    });

    it('appelle mutate immédiatement après upload de la carte grise', () => {
      const base64 = 'data:image/jpeg;base64,nouvelleCarte';

      class MockFileReader {
        result = base64;
        onloadend: (() => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
      vi.stubGlobal('FileReader', MockFileReader);

      const { container } = render(<VehicleDocumentsForm />);
      const inputs = container.querySelectorAll('input[type="file"]');
      const file = new File(['img'], 'carte.jpg', { type: 'image/jpeg' });

      fireEvent.change(inputs[0], { target: { files: [file] } });

      expect(mockMutate).toHaveBeenCalledWith({
        carteGrise: base64,
        permisDeConduire: null,
      });
      vi.unstubAllGlobals();
    });

    it('appelle mutate immédiatement après upload du permis', () => {
      const base64 = 'data:image/jpeg;base64,nouveauPermis';

      class MockFileReader {
        result = base64;
        onloadend: (() => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
      vi.stubGlobal('FileReader', MockFileReader);

      const { container } = render(<VehicleDocumentsForm />);
      const inputs = container.querySelectorAll('input[type="file"]');
      const file = new File(['img'], 'permis.jpg', { type: 'image/jpeg' });

      fireEvent.change(inputs[1], { target: { files: [file] } });

      expect(mockMutate).toHaveBeenCalledWith({
        carteGrise: null,
        permisDeConduire: base64,
      });
      vi.unstubAllGlobals();
    });
  });

  describe('suppression automatique', () => {
    beforeEach(() => {
      mockUseVehicleDocument.mockReturnValue({
        data: {
          _id: 'doc1',
          userId: 1,
          carteGrise: 'data:image/jpeg;base64,carte',
          permisDeConduire: 'data:image/jpeg;base64,permis',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        isLoading: false,
      } as ReturnType<typeof useVehicleDocument>);
    });

    it('appelle mutate avec carteGrise=null quand on supprime la carte grise', async () => {
      render(<VehicleDocumentsForm />);
      const deleteButtons = screen.getAllByRole('button');

      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          carteGrise: null,
          permisDeConduire: 'data:image/jpeg;base64,permis',
        });
      });
    });

    it('appelle mutate avec permisDeConduire=null quand on supprime le permis', async () => {
      render(<VehicleDocumentsForm />);
      const deleteButtons = screen.getAllByRole('button');

      fireEvent.click(deleteButtons[1]);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          carteGrise: 'data:image/jpeg;base64,carte',
          permisDeConduire: null,
        });
      });
    });
  });

  describe('état pending', () => {
    it('transmet isPending aux cartes pour désactiver les boutons', () => {
      mockUseVehicleDocument.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as ReturnType<typeof useVehicleDocument>);

      mockUseUpsertVehicleDocument.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as ReturnType<typeof useUpsertVehicleDocument>);

      render(<VehicleDocumentsForm />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => expect(btn).toBeDisabled());
    });
  });
});
