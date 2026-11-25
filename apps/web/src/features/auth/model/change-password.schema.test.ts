import { describe, it, expect } from 'vitest';
import { PASSWORD_MESSAGES } from '@/shared/lib/password-policy';
import { changePasswordSchema } from './change-password.schema';

const base = {
  currentPassword: 'OldPass123!',
  password: 'NewPass123!',
  confirmPassword: 'NewPass123!',
};

describe('changePasswordSchema', () => {
  it('accepts valid data', () => {
    expect(changePasswordSchema.safeParse(base).success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      password: 'Ab1!',
      confirmPassword: 'Ab1!',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain('8');
  });

  it('rejects password without a number', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      password: 'NoNumber!A',
      confirmPassword: 'NoNumber!A',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toContain(
      PASSWORD_MESSAGES.digit
    );
  });

  it('rejects password without an uppercase letter', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      password: 'nouppercase1!',
      confirmPassword: 'nouppercase1!',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toContain(
      PASSWORD_MESSAGES.uppercase
    );
  });

  it('rejects password without a lowercase letter', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      password: 'NOLOWER1!',
      confirmPassword: 'NOLOWER1!',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toContain(
      PASSWORD_MESSAGES.lowercase
    );
  });

  it('rejects password without a special character', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      password: 'NoSpecial1A',
      confirmPassword: 'NoSpecial1A',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toContain(
      PASSWORD_MESSAGES.special
    );
  });

  it('rejects mismatched confirm password', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      confirmPassword: 'Different123!',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      'Les mots de passe ne correspondent pas'
    );
    expect(result.error?.issues[0]?.path).toContain('confirmPassword');
  });

  it('requires the current password', () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      currentPassword: '',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('currentPassword');
  });
});
