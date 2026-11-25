import { z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_RULES } from '@repo/types';

export const PASSWORD_MESSAGES = {
  minLength: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
  digit: 'Le mot de passe doit contenir un chiffre',
  uppercase: 'Le mot de passe doit contenir une majuscule',
  lowercase: 'Le mot de passe doit contenir une minuscule',
  special: 'Le mot de passe doit contenir un caractère spécial',
} as const;

const CHARACTER_RULES = ['digit', 'uppercase', 'lowercase', 'special'] as const;

export const strongPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_MESSAGES.minLength)
  .superRefine((password, ctx) => {
    CHARACTER_RULES.filter(
      (rule) => !PASSWORD_RULES[rule].test(password)
    ).forEach((rule) =>
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PASSWORD_MESSAGES[rule],
      })
    );
  });
