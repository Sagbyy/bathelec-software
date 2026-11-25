import { describe, it, expect } from 'vitest';
import { PASSWORD_MESSAGES, strongPasswordSchema } from './password-policy';

const messagesFor = (password: string) =>
  strongPasswordSchema
    .safeParse(password)
    .error?.issues.map((i) => i.message) ?? [];

describe('strongPasswordSchema', () => {
  it('accepts a password meeting every rule', () => {
    expect(strongPasswordSchema.safeParse('Bathelec#2026').success).toBe(true);
  });

  it.each([
    ['Ab1!xyz', PASSWORD_MESSAGES.minLength],
    ['NoNumber!A', PASSWORD_MESSAGES.digit],
    ['nouppercase1!', PASSWORD_MESSAGES.uppercase],
    ['NOLOWER1!', PASSWORD_MESSAGES.lowercase],
    ['NoSpecial1A', PASSWORD_MESSAGES.special],
  ])('rejects %s', (password, message) => {
    expect(messagesFor(password)).toContain(message);
  });

  it.each([['Bathelec_2026'], ['Bathelec#2026'], ['Bathelec 2026']])(
    'accepts any non alphanumeric special character (%s)',
    (password) => {
      expect(strongPasswordSchema.safeParse(password).success).toBe(true);
    }
  );
});
