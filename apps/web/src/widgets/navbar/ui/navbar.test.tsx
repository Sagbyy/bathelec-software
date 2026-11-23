import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Role, User } from '@repo/types';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useUserStore } from '@/entities/user';
import { Navbar } from './navbar';

vi.mock('@/features/auth', () => ({
  UserMenu: () => null,
}));

vi.mock('@/features/theme-toggle', () => ({
  ThemeToggle: () => null,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/technician/derivations',
}));

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Navbar', () => {
  afterEach(() => {
    useUserStore.setState({ user: undefined });
    vi.unstubAllGlobals();
  });

  it('lets the mobile menu scroll when its links overflow the screen', async () => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    useUserStore.setState({
      user: {
        id: 1,
        role: Role.TECHNICIAN,
        firstName: 'Jean',
        lastName: 'Tech',
      } as User,
    });
    render(<Navbar />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Toggle navigation menu' })
    );

    expect(await screen.findByRole('dialog')).toHaveClass('overflow-y-auto');
  });

  it('highlights the link of the current page in the mobile menu', async () => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    useUserStore.setState({
      user: { id: 1, role: Role.TECHNICIAN } as User,
    });
    render(<Navbar />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Toggle navigation menu' })
    );

    const dialog = await screen.findByRole('dialog');
    const current = within(dialog).getByRole('link', {
      name: 'Chantiers en cours',
    });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(
      within(dialog).getByRole('link', { name: 'Chantiers terminés' })
    ).not.toHaveAttribute('aria-current');
  });

  it('renders nothing without a signed-in user', () => {
    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });
});
