import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Role } from '@repo/types';

vi.mock('@/entities/chantier-document', () => ({
  ChantierDocumentsSection: ({
    toolbar,
    renderItemAction,
  }: {
    toolbar?: React.ReactNode;
    renderItemAction?: (doc: { _id: string }) => React.ReactNode;
  }) =>
    React.createElement(
      'div',
      null,
      React.createElement('div', { 'data-testid': 'toolbar' }, toolbar ?? null),
      React.createElement(
        'div',
        { 'data-testid': 'action' },
        renderItemAction ? renderItemAction({ _id: 'd1' }) : null
      )
    ),
}));

vi.mock('@/features/chantier-documents', () => ({
  ChantierDocumentUploadForm: () =>
    React.createElement('div', { 'data-testid': 'upload-form' }),
  ChantierDocumentDeleteButton: () =>
    React.createElement('div', { 'data-testid': 'delete-btn' }),
}));

vi.mock('@/entities/user', () => ({ useUserStore: vi.fn() }));

import { useUserStore } from '@/entities/user';
import { ChantierDocumentsManager } from './chantier-documents-manager';

const mockUseUserStore = vi.mocked(useUserStore);

function setRole(role: Role | undefined) {
  mockUseUserStore.mockImplementation(((selector: (s: unknown) => unknown) =>
    selector({ user: role ? { role } : undefined })) as never);
}

describe('ChantierDocumentsManager', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([Role.ADMIN, Role.SUPERVISOR])(
    'exposes upload and delete controls to %s',
    (role) => {
      setRole(role);
      render(<ChantierDocumentsManager chantierId={1} />);
      expect(screen.getByTestId('upload-form')).toBeInTheDocument();
      expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
    }
  );

  it.each([Role.TECHNICIAN, Role.SITE_MANAGER])(
    'hides upload and delete controls from %s',
    (role) => {
      setRole(role);
      render(<ChantierDocumentsManager chantierId={1} />);
      expect(screen.queryByTestId('upload-form')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete-btn')).not.toBeInTheDocument();
    }
  );
});
