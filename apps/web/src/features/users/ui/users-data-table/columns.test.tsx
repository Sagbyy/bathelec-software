import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@iconify/react/dist/iconify.js', () => ({
  Icon: () => null,
}));

import { columns } from './columns';

function renderActionCell(userId: number, role: string) {
  const ActionCellDef = columns.find((c) => c.id === 'edit' || (c as { accessorKey?: string }).accessorKey === 'edit');
  if (!ActionCellDef || !('cell' in ActionCellDef) || !ActionCellDef.cell) {
    throw new Error('Column edit not found');
  }
  const cell = ActionCellDef.cell as (ctx: { row: { original: { id: number; role: string } } }) => React.ReactNode;
  const { container } = render(
    <div>{cell({ row: { original: { id: userId, role } } })}</div>
  );
  return container;
}

import React from 'react';

describe('ActionCell (columns.tsx)', () => {
  it('affiche le bouton Modifier pour un technicien', () => {
    renderActionCell(1, 'technician');
    expect(screen.getByTitle('Modifier')).toBeInTheDocument();
  });

  it('affiche le bouton Habilitations pour un technicien', () => {
    renderActionCell(1, 'technician');
    expect(screen.getByTitle('Habilitations')).toBeInTheDocument();
  });

  it("n'affiche pas le bouton Habilitations pour un admin", () => {
    renderActionCell(2, 'admin');
    expect(screen.queryByTitle('Habilitations')).not.toBeInTheDocument();
  });

  it('affiche le bouton Modifier pour un admin', () => {
    renderActionCell(2, 'admin');
    expect(screen.getByTitle('Modifier')).toBeInTheDocument();
  });

  it('navigue vers la page des habilitations au clic pour un technicien', async () => {
    const user = userEvent.setup();
    renderActionCell(7, 'technician');

    await user.click(screen.getByTitle('Habilitations'));

    expect(mockPush).toHaveBeenCalledWith(
      '/dashboard/admin/technicians/7/habilitations'
    );
  });

  it("navigue vers la page d'édition au clic sur Modifier", async () => {
    const user = userEvent.setup();
    renderActionCell(3, 'technician');

    await user.click(screen.getByTitle('Modifier'));

    expect(mockPush).toHaveBeenCalledWith('/dashboard/admin/users/edit/3');
  });
});
