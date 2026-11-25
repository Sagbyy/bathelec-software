import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { REPORT_QUEUED_MESSAGE } from '../model/use-derivation-submit';
import { QueuedReportNotice } from './queued-report-notice';

describe('QueuedReportNotice', () => {
  it('renders nothing without a queued report', () => {
    const { container } = render(<QueuedReportNotice entry={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('tells the technician the report waits for the network', () => {
    render(<QueuedReportNotice entry={{ status: 'pending' }} />);
    expect(screen.getByRole('status')).toHaveTextContent(REPORT_QUEUED_MESSAGE);
  });

  it('surfaces the server rejection reason', () => {
    render(
      <QueuedReportNotice
        entry={{ status: 'rejected', lastError: 'Folio déjà utilisé' }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Envoi refusé par le serveur : Folio déjà utilisé'
    );
  });
});
