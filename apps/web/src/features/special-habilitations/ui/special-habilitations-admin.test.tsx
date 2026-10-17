import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpecialHabilitationsAdmin } from './special-habilitations-admin';

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}));

const mutate = vi.fn();
const useSpecialHabilitation = vi.fn();

vi.mock('@/entities/special-habilitation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/special-habilitation')>()),
  useSpecialHabilitation: (...args: unknown[]) =>
    useSpecialHabilitation(...args),
  useUpdateSpecialHabilitation: () => ({ mutate, isPending: false }),
}));

const withSst = (overrides: Record<string, unknown>) =>
  useSpecialHabilitation.mockReturnValue({
    data: { userId: 3, sstCertificate: true, ...overrides },
    isLoading: false,
  });

describe('SpecialHabilitationsAdmin — date de validité (DTA-51)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('bloque le dépôt du justificatif tant que la date est absente', () => {
    withSst({ sstCertificateDoc: null });

    render(<SpecialHabilitationsAdmin technicianId={3} />);

    expect(
      screen.getByRole('button', { name: /Joindre un document/ })
    ).toBeDisabled();
  });

  it('autorise le dépôt une fois la date renseignée', () => {
    withSst({ sstCertificateDoc: null });

    render(<SpecialHabilitationsAdmin technicianId={3} />);
    fireEvent.change(screen.getByLabelText(/Date de fin de validité/), {
      target: { value: '2027-05-31' },
    });

    expect(
      screen.getByRole('button', { name: /Joindre un document/ })
    ).toBeEnabled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("met à jour la date d'un justificatif existant", () => {
    withSst({
      sstCertificateDoc: 'data:image/png;base64,AAA',
      sstCertificateDocExpiresAt: '2027-05-31T00:00:00.000Z',
    });

    render(<SpecialHabilitationsAdmin technicianId={3} />);
    fireEvent.change(screen.getByLabelText(/Date de fin de validité/), {
      target: { value: '2028-01-15' },
    });

    expect(mutate).toHaveBeenCalledWith({
      sstCertificateDocExpiresAt: '2028-01-15',
    });
  });
});
