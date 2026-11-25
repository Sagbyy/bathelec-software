import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NetworkStatusIndicator } from './network-status-indicator';

describe('NetworkStatusIndicator', () => {
  it('shows the online state without counters when nothing is pending', () => {
    render(<NetworkStatusIndicator online pendingCount={0} rejectedCount={0} />);

    expect(screen.getByText('En ligne')).toBeInTheDocument();
    expect(screen.queryByText(/en attente/)).not.toBeInTheDocument();
  });

  it('shows the offline state and the pending sync counter', () => {
    render(
      <NetworkStatusIndicator online={false} pendingCount={2} rejectedCount={0} />
    );

    expect(screen.getByText('Hors ligne')).toBeInTheDocument();
    expect(screen.getByText('2 envois en attente')).toBeInTheDocument();
  });

  it('shows rejected submissions apart', () => {
    render(<NetworkStatusIndicator online pendingCount={0} rejectedCount={1} />);

    expect(screen.getByText('1 envoi refusé')).toBeInTheDocument();
  });
});
