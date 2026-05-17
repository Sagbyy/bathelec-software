import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DocumentUploadCard } from './document-upload-card';

vi.mock('react-medium-image-zoom', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'zoom' }, children),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

const defaultProps = {
  label: 'Carte grise',
  description: 'Photo de la carte grise',
  inputId: 'carte-grise-upload',
  value: null,
  onChange: vi.fn(),
};

describe('DocumentUploadCard', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('zone de dépôt (pas d\'image)', () => {
    it('affiche le label', () => {
      render(<DocumentUploadCard {...defaultProps} />);
      expect(screen.getByText('Carte grise')).toBeInTheDocument();
    });

    it('affiche la description', () => {
      render(<DocumentUploadCard {...defaultProps} />);
      expect(screen.getByText('Photo de la carte grise')).toBeInTheDocument();
    });

    it('affiche le bouton de sélection', () => {
      render(<DocumentUploadCard {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: /sélectionner un fichier/i })
      ).toBeInTheDocument();
    });

    it('affiche l\'icône upload', () => {
      const { container } = render(<DocumentUploadCard {...defaultProps} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('l\'input accepte uniquement les images autorisées', () => {
      const { container } = render(<DocumentUploadCard {...defaultProps} />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveAttribute(
        'accept',
        'image/jpeg,image/jpg,image/png,image/webp'
      );
    });

    it('le bouton est désactivé quand isPending=true', () => {
      render(<DocumentUploadCard {...defaultProps} isPending />);
      expect(
        screen.getByRole('button', { name: /sélectionner un fichier/i })
      ).toBeDisabled();
    });
  });

  describe('prévisualisation (image présente)', () => {
    const propsWithValue = {
      ...defaultProps,
      value: 'data:image/jpeg;base64,abc123',
    };

    it('affiche l\'image de prévisualisation', () => {
      render(<DocumentUploadCard {...propsWithValue} />);
      const img = screen.getByRole('img', { name: /aperçu carte grise/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,abc123');
    });

    it('entoure l\'image du composant Zoom', () => {
      render(<DocumentUploadCard {...propsWithValue} />);
      expect(screen.getByTestId('zoom')).toBeInTheDocument();
    });

    it('n\'affiche pas la zone de dépôt', () => {
      render(<DocumentUploadCard {...propsWithValue} />);
      expect(
        screen.queryByRole('button', { name: /sélectionner un fichier/i })
      ).not.toBeInTheDocument();
    });

    it('affiche le bouton de suppression', () => {
      render(<DocumentUploadCard {...propsWithValue} />);
      const deleteBtn = screen.getByRole('button');
      expect(deleteBtn).toBeInTheDocument();
    });

    it('appelle onChange(null) quand on clique sur supprimer', async () => {
      const onChange = vi.fn();
      render(<DocumentUploadCard {...propsWithValue} onChange={onChange} />);

      await userEvent.click(screen.getByRole('button'));

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('le bouton de suppression est désactivé quand isPending=true', () => {
      render(<DocumentUploadCard {...propsWithValue} isPending />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('upload d\'un fichier', () => {
    it('appelle onChange avec le base64 après sélection d\'un fichier', () => {
      const onChange = vi.fn();
      const base64Result = 'data:image/jpeg;base64,nouveauFichier';

      class MockFileReader {
        result = base64Result;
        onloadend: (() => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
      vi.stubGlobal('FileReader', MockFileReader);

      const { container } = render(
        <DocumentUploadCard {...defaultProps} onChange={onChange} />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['image'], 'carte.jpg', { type: 'image/jpeg' });
      fireEvent.change(input, { target: { files: [file] } });

      expect(onChange).toHaveBeenCalledWith(base64Result);
      vi.unstubAllGlobals();
    });

    it('ne fait rien si aucun fichier n\'est sélectionné', () => {
      const onChange = vi.fn();
      const { container } = render(
        <DocumentUploadCard {...defaultProps} onChange={onChange} />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(input, { target: { files: [] } });

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
