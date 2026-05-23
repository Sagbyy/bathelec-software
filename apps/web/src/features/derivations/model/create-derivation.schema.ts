import { z } from 'zod';

export const formSchema = z.object({
  user: z
    .string()
    .min(2, {
      message: "Le nom d'utilisateur doit comporter au moins 2 caractères",
    })
    .max(50, {
      message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
    }),
  chantierId: z.number({
    required_error: 'Veuillez sélectionner un chantier',
    invalid_type_error: 'Veuillez sélectionner un chantier',
  }),
});
