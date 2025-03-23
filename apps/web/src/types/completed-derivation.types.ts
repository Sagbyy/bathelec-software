import { z } from 'zod';
import { createCompletedDerivationSchema } from '@/validators/derivationForm';

export type CreateCompletedDerivation = z.infer<
  typeof createCompletedDerivationSchema
> & { requestedDerivationId: number };
