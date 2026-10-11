import { z } from 'zod';

export const createDerivationSchema = z.object({
  teamId: z.number({
    required_error: 'Veuillez sélectionner une équipe chantier',
    invalid_type_error: 'Veuillez sélectionner une équipe chantier',
  }),
  userId: z.number().int().positive().optional(),
  chantierId: z.number({
    required_error: 'Veuillez sélectionner un chantier',
    invalid_type_error: 'Veuillez sélectionner un chantier',
  }),
});

export type CreateDerivation = z.infer<typeof createDerivationSchema>;
