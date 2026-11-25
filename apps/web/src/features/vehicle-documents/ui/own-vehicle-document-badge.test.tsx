import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OwnVehicleDocumentBadge } from './own-vehicle-document-badge';

vi.mock('@/entities/vehicle-document', () => ({
  useVehicleDocument: vi.fn(),
}));

vi.mock('@/entities/user', () => ({
  useUserStore: vi.fn((selector: (s: { user: { id: number } }) => unknown) =>
    selector({ user: { id: 3 } })
  ),
}));

import { useVehicleDocument } from '@/entities/vehicle-document';

const mockUseVehicleDocument = vi.mocked(useVehicleDocument);
const asHook = (value: unknown) =>
  value as ReturnType<typeof useVehicleDocument>;

describe('OwnVehicleDocumentBadge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 17));
  });

  afterEach(() => vi.useRealTimers());

  it('signale un document expiré', () => {
    mockUseVehicleDocument.mockReturnValue(
      asHook({
        isLoading: false,
        data: {
          drivingLicense: 'data:image/png;base64,AAA',
          drivingLicenseExpiresAt: '2026-09-01',
        },
      })
    );

    render(<OwnVehicleDocumentBadge documentKey="drivingLicense" />);

    expect(mockUseVehicleDocument).toHaveBeenCalledWith(3);
    expect(
      screen.getByText('Expiré depuis le 1 septembre 2026')
    ).toBeInTheDocument();
  });

  it("signale l'absence de document", () => {
    mockUseVehicleDocument.mockReturnValue(
      asHook({ isLoading: false, data: undefined })
    );

    render(<OwnVehicleDocumentBadge documentKey="vehicleRegistration" />);

    expect(screen.getByText('Aucun document')).toBeInTheDocument();
  });
});
