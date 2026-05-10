import { z } from 'zod';
import { createCompletedDerivationSchema } from './derivation-form.schema';

export type CreateCompletedDerivation = z.infer<
  typeof createCompletedDerivationSchema
> & { requestedDerivationId: number };
