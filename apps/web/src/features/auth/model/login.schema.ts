import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginValues = z.infer<typeof loginSchema>;
