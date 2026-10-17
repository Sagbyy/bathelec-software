import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Role, User } from '@repo/types';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useUserStore } from '@/entities/user';
import { Navbar } from './navbar';

vi.mock('@/features/auth', () => ({
  useAuth: () => ({ logout: vi.fn() }),
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
});
