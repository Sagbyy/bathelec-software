import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import type { CreateCompletedDerivation } from './completed-derivation.types';
import { getCompletedDerivationSchema } from './derivation-form.schema';

export const completedDerivationResolver: Resolver<CreateCompletedDerivation> = (
  values,
  context,
  options
) =>
  zodResolver(getCompletedDerivationSchema(values.oldMeter ?? {}))(
    values,
    context,
    options
  ) as ReturnType<Resolver<CreateCompletedDerivation>>;
