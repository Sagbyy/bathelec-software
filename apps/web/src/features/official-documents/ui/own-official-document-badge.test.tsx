import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OwnOfficialDocumentBadge } from './own-official-document-badge';

vi.mock('@/entities/official-document', () => ({
  useOfficialDocument: vi.fn(),
}));

vi.mock('@/entities/user', () => ({
  useUserStore: vi.fn((selector: (s: { user: { id: number } }) => unknown) =>
    selector({ user: { id: 1 } })
  ),
}));

import { useOfficialDocument } from '@/entities/official-document';

const mockUseOfficialDocument = vi.mocked(useOfficialDocument);
const asHook = (value: unknown) =>
  value as ReturnType<typeof useOfficialDocument>;

describe('OwnOfficialDocumentBadge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 17));
  });

  afterEach(() => vi.useRealTimers());

  it('affiche le statut de validité du document du technicien connecté', () => {
    mockUseOfficialDocument.mockReturnValue(
      asHook({
        isLoading: false,
        data: {
          btpCard: 'data:image/png;base64,AAA',
          btpCardExpiresAt: '2026-11-01T00:00:00.000Z',
        },
      })
    );

    render(<OwnOfficialDocumentBadge documentKey="btpCard" />);

    expect(mockUseOfficialDocument).toHaveBeenCalledWith(1);
    expect(
      screen.getByText('Expire bientôt (1 novembre 2026)')
    ).toBeInTheDocument();
  });

  it("signale l'absence de document", () => {
    mockUseOfficialDocument.mockReturnValue(
      asHook({ isLoading: false, data: null })
    );

    render(<OwnOfficialDocumentBadge documentKey="idCard" />);

    expect(screen.getByText('Aucun document')).toBeInTheDocument();
  });

  it("n'affiche rien pendant le chargement", () => {
    mockUseOfficialDocument.mockReturnValue(
      asHook({ isLoading: true, data: undefined })
    );

    const { container } = render(
      <OwnOfficialDocumentBadge documentKey="idCard" />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
