import type { UseFormReturn } from 'react-hook-form';
import {
  getStepNumber,
  type CreateCompletedDerivation,
} from '@/entities/derivation';

export const useStepNumber = (
  form: UseFormReturn<CreateCompletedDerivation>,
  formStep: number
) => {
  const preserved = form.watch('oldMeter.preserved');
  const linkyRefusal = form.watch('oldMeter.linkyRefusal');

  return getStepNumber(formStep, { preserved, linkyRefusal });
};
