import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from './login-form';

const authState = vi.hoisted(() => ({
  login: vi.fn(),
  loading: false,
  error: false,
}));

vi.mock('../model/use-auth', () => ({
  default: () => authState,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    authState.login.mockReset();
    authState.loading = false;
    authState.error = false;
  });

  it('submits the trimmed credentials', async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByPlaceholderText("Votre nom d'utilisateur"),
      ' jean.dupont '
    );
    await userEvent.type(
      screen.getByPlaceholderText('Votre mot de passe'),
      'secret'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(authState.login).toHaveBeenCalledWith('jean.dupont', 'secret');
  });

  it('shows validation messages instead of submitting empty fields', async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(
      await screen.findByText('Le mot de passe est requis')
    ).toBeInTheDocument();
    expect(authState.login).not.toHaveBeenCalled();
  });

  it('toggles the password visibility', async () => {
    render(<LoginForm />);
    const password = screen.getByPlaceholderText('Votre mot de passe');

    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(
      screen.getByRole('button', { name: 'Afficher le mot de passe' })
    );
    expect(password).toHaveAttribute('type', 'text');
  });

  it('announces invalid credentials', () => {
    authState.error = true;
    render(<LoginForm />);

    expect(screen.getByRole('alert')).toHaveTextContent(/incorrect/i);
  });

  it('disables the submit button while signing in', () => {
    authState.loading = true;
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeDisabled();
  });
});
