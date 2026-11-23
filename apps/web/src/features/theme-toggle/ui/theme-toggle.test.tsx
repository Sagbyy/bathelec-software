import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';

const setTheme = vi.fn();
const themeState = vi.hoisted(() => ({ resolvedTheme: 'light' }));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: themeState.resolvedTheme, setTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    setTheme.mockClear();
  });

  it('switches to the dark theme from the light theme', async () => {
    themeState.resolvedTheme = 'light';
    render(<ThemeToggle />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Activer le thème sombre' })
    );

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('switches back to the light theme from the dark theme', async () => {
    themeState.resolvedTheme = 'dark';
    render(<ThemeToggle />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Activer le thème clair' })
    );

    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
