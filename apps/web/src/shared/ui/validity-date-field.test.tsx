import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ValidityBadge, ValidityDateField } from './validity-date-field';

describe('ValidityBadge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 17));
  });

  afterEach(() => vi.useRealTimers());

  it('signale une date manquante', () => {
    render(<ValidityBadge expiresAt={null} />);
    expect(screen.getByText('Date de validité manquante')).toBeInTheDocument();
  });

  it('signale un document expiré', () => {
    render(<ValidityBadge expiresAt="2026-09-01" />);
    expect(
      screen.getByText('Expiré depuis le 1 septembre 2026')
    ).toBeInTheDocument();
  });

  it('signale une expiration proche', () => {
    render(<ValidityBadge expiresAt="2026-11-01" />);
    expect(
      screen.getByText('Expire bientôt (1 novembre 2026)')
    ).toBeInTheDocument();
  });

  it('affiche la date de fin pour un document valide', () => {
    render(<ValidityBadge expiresAt="2027-05-31" />);
    expect(screen.getByText("Valide jusqu'au 31 mai 2027")).toBeInTheDocument();
  });
});

describe('ValidityDateField', () => {
  it('transmet la date saisie et null quand le champ est vidé', () => {
    const onChange = vi.fn();
    render(
      <ValidityDateField id="expiry" value="2027-05-31" onChange={onChange} />
    );
    const input = screen.getByLabelText(/Date de fin de validité/);

    expect(input).toHaveValue('2027-05-31');

    fireEvent.change(input, { target: { value: '2028-01-15' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenNthCalledWith(1, '2028-01-15');
    expect(onChange).toHaveBeenNthCalledWith(2, null);
  });
});
