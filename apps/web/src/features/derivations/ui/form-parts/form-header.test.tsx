import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormHeader } from './form-header';

describe('FormHeader', () => {
  it('shows the current step and rounded progress', () => {
    render(<FormHeader step={3} totalSteps={9} progress={33.4} />);

    expect(screen.getByText('Étape 3 sur 9')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('renders one segment per step', () => {
    const { container } = render(
      <FormHeader step={1} totalSteps={7} progress={14} />
    );

    expect(container.querySelectorAll('[data-state]')).toHaveLength(7);
  });

  it('marks previous steps done, the current one active and the rest upcoming', () => {
    const { container } = render(
      <FormHeader step={2} totalSteps={4} progress={50} />
    );

    const states = Array.from(container.querySelectorAll('[data-state]')).map((segment) => segment.getAttribute('data-state'));
    expect(states).toEqual(['done', 'current', 'upcoming', 'upcoming']);
  });

  it('exposes the step as an accessible progress value', () => {
    render(<FormHeader step={5} totalSteps={9} progress={55} />);

    const progressbar = screen.getByRole('progressbar', {
      name: 'Progression du formulaire',
    });
    expect(progressbar).toHaveAttribute('aria-valuenow', '5');
    expect(progressbar).toHaveAttribute('aria-valuemax', '9');
  });
});
