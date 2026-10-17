import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HabilitationsAdmin } from './habilitations-admin';

const mutate = vi.fn();
const useHabilitation = vi.fn();

vi.mock('@/entities/habilitation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/habilitation')>()),
  useHabilitation: (...args: unknown[]) => useHabilitation(...args),
  useUpdateHabilitation: () => ({ mutate, isPending: false }),
}));

describe('HabilitationsAdmin — date de validité (DTA-51)', () => {
  beforeEach(() => vi.clearAllMocks());

  it("bloque l'attribution d'un code tant que la date est absente", () => {
    useHabilitation.mockReturnValue({ data: undefined, isLoading: false });

    render(<HabilitationsAdmin technicianId={3} />);

    expect(screen.getByRole('switch', { name: 'B0' })).toBeDisabled();
    expect(
      screen.getByText(/Renseignez la date de validité/)
    ).toBeInTheDocument();
  });

  it('permet de retirer un code déjà accordé même sans date', () => {
    useHabilitation.mockReturnValue({
      data: { userId: 3, b0: true, expiresAt: null },
      isLoading: false,
    });

    render(<HabilitationsAdmin technicianId={3} />);

    expect(screen.getByRole('switch', { name: 'B0' })).toBeEnabled();
  });

  it('enregistre la date de validité saisie', () => {
    useHabilitation.mockReturnValue({ data: undefined, isLoading: false });

    render(<HabilitationsAdmin technicianId={3} />);
    fireEvent.change(
      screen.getByLabelText(/Date de fin de validité du titre/),
      { target: { value: '2027-05-31' } }
    );

    expect(mutate).toHaveBeenCalledWith({ expiresAt: '2027-05-31' });
  });

  it('autorise les codes une fois la date connue', () => {
    useHabilitation.mockReturnValue({
      data: { userId: 3, expiresAt: '2027-05-31T00:00:00.000Z' },
      isLoading: false,
    });

    render(<HabilitationsAdmin technicianId={3} />);

    expect(screen.getByRole('switch', { name: 'B0' })).toBeEnabled();
  });
});
