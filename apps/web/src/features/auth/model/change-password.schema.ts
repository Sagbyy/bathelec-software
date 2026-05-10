import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .superRefine((password, ctx) => {
        const hasNumber = /\d/.test(password);
        if (!hasNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must contain a number',
          });
        }

        const hasUppercase = /[A-Z]/.test(password);
        if (!hasUppercase) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must contain an uppercase letter',
          });
        }

        const hasLowercase = /[a-z]/.test(password);
        if (!hasLowercase) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must contain a lowercase letter',
          });
        }

        const hasSpecialCharacter = /[@$!%*?&]/.test(password);
        if (!hasSpecialCharacter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must contain a special character',
          });
        }
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
