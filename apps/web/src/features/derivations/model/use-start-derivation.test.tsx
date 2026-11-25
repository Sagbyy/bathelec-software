import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DerivationStatus } from '@repo/types';
import { shouldStartDerivation, useStartDerivation } from './use-start-derivation';

const startDerivation = vi.fn();

vi.mock('@/entities/derivation', () => ({
  derivationService: {
    startDerivation: (id: number) => startDerivation(id),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
);

describe('shouldStartDerivation', () => {
  it('starts an editable pending derivation', () => {
    expect(
      shouldStartDerivation({ status: DerivationStatus.PENDING }, false)
    ).toBe(true);
  });

  it.each([
    DerivationStatus.ONGOING,
    DerivationStatus.REVISING,
    DerivationStatus.REVIEWING,
    DerivationStatus.COMPLETED,
  ])('does not start a %s derivation', (status) => {
    expect(shouldStartDerivation({ status }, false)).toBe(false);
  });

  it('does not start a read-only form', () => {
    expect(
      shouldStartDerivation({ status: DerivationStatus.PENDING }, true)
    ).toBe(false);
  });
});

describe('useStartDerivation', () => {
  beforeEach(() => {
    startDerivation.mockReset();
    startDerivation.mockResolvedValue({ id: 1 });
  });

  it('marks a pending derivation as ongoing once', async () => {
    const derivation = { id: 1, status: DerivationStatus.PENDING };
    const { rerender } = renderHook(
      () => useStartDerivation(derivation, false),
      { wrapper }
    );
    rerender();

    await waitFor(() => expect(startDerivation).toHaveBeenCalledWith(1));
    expect(startDerivation).toHaveBeenCalledTimes(1);
  });

  it('does nothing for a read-only form', async () => {
    renderHook(
      () => useStartDerivation({ id: 1, status: DerivationStatus.PENDING }, true),
      { wrapper }
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(startDerivation).not.toHaveBeenCalled();
  });
});
