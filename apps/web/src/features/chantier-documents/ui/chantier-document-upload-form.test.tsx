import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('@iconify/react/dist/iconify.js', () => ({ Icon: () => null }));

const mockMutate = vi.fn();
vi.mock('@/entities/chantier-document', () => ({
  useCreateChantierDocument: () => ({ mutate: mockMutate, isPending: false }),
}));

import { ChantierDocumentUploadForm } from './chantier-document-upload-form';

describe('ChantierDocumentUploadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the name, type and file fields plus the submit button', () => {
    render(<ChantierDocumentUploadForm chantierId={1} />);

    expect(screen.getByText('Ajouter un document')).toBeInTheDocument();
    expect(screen.getByText('Nom')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ajouter le document/i })
    ).toBeInTheDocument();
  });

  it('auto-fills the name from the selected file when empty', async () => {
    class MockFileReader {
      result = 'data:application/pdf;base64,JVBERi0=';
      onloadend: (() => void) | null = null;
      readAsDataURL() {
        this.onloadend?.();
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    const { container } = render(<ChantierDocumentUploadForm chantierId={1} />);
    const fileInput = container.querySelector('input[type="file"]')!;

    fireEvent.change(fileInput, {
      target: {
        files: [new File(['x'], 'etude-marche.pdf', { type: 'application/pdf' })],
      },
    });

    const nameInput = screen.getByPlaceholderText(
      'Nom du document'
    ) as HTMLInputElement;
    await waitFor(() => expect(nameInput.value).toBe('etude-marche'));

    vi.unstubAllGlobals();
  });

  it('does not submit when required fields are missing', async () => {
    render(<ChantierDocumentUploadForm chantierId={1} />);

    fireEvent.click(
      screen.getByRole('button', { name: /ajouter le document/i })
    );

    await waitFor(() =>
      expect(screen.getByText(/veuillez sélectionner un type/i)).toBeInTheDocument()
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
