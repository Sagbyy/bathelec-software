import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TechnicianShell } from './technician-shell';

const navigation = vi.hoisted(() => ({ pathname: '/dashboard' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ back: vi.fn() }),
}));

vi.mock('@/features/auth', () => ({ UserMenu: () => null }));
vi.mock('@/features/theme-toggle', () => ({ ThemeToggle: () => null }));

describe('TechnicianShell', () => {
  beforeEach(() => {
    navigation.pathname = '/dashboard';
  });

  it('renders its content', () => {
    render(<TechnicianShell>Contenu</TechnicianShell>);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('hides the back button on the home page', () => {
    render(<TechnicianShell>Contenu</TechnicianShell>);
    expect(
      screen.queryByRole('button', { name: 'Retour' })
    ).not.toBeInTheDocument();
  });

  it('shows the back button on inner pages', () => {
    navigation.pathname = '/dashboard/technician/vehicule';
    render(<TechnicianShell>Contenu</TechnicianShell>);
    expect(screen.getByRole('button', { name: 'Retour' })).toBeInTheDocument();
  });

  it('marks the current section in the tab bar', () => {
    navigation.pathname = '/dashboard/technician/urgences';
    render(<TechnicianShell>Contenu</TechnicianShell>);
    const nav = screen.getByRole('navigation', {
      name: 'Navigation principale',
    });
    expect(
      nav.querySelector('[aria-current="page"]')
    ).toHaveTextContent('Urgences');
  });
});
