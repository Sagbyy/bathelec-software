import { z } from 'zod';
import { createCompletedDerivationSchema } from '@/validators/derivation-form';

export type CreateCompletedDerivation = z.infer<
  typeof createCompletedDerivationSchema
> & { requestedDerivationId: number };
