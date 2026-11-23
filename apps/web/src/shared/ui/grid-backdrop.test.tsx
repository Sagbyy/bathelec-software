import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GridBackdrop } from './grid-backdrop';

describe('GridBackdrop', () => {
  it('is hidden from assistive technologies', () => {
    const { container } = render(<GridBackdrop />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses the requested grid cell size', () => {
    const { container } = render(<GridBackdrop cellSize={24} />);
    const grid = container.querySelector('[style]') as HTMLElement;
    expect(grid.style.backgroundSize).toBe('24px 24px');
  });

  it('does not draw any round shape', () => {
    const { container } = render(<GridBackdrop />);
    expect(container.querySelector('.rounded-full')).toBeNull();
  });
});
