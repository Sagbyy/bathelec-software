import { useState, useCallback, useMemo, useEffect } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import {
  type CreateCompletedDerivation,
  findFirstInvalidStep,
  getFieldsToValidate,
  getVisibleSteps,
} from '@/entities/derivation';

type UseFormStepsProps = {
  form: UseFormReturn<CreateCompletedDerivation>;
  onSubmit: (data: CreateCompletedDerivation) => void;
  readOnly?: boolean;
};

export const INVALID_SUBMISSION_MESSAGE =
  'Le formulaire est incomplet : corrigez les champs signalés avant de soumettre.';

export const useFormSteps = ({
  form,
  onSubmit,
  readOnly = false,
}: UseFormStepsProps) => {
  const [step, setStep] = useState(1);

  const oldMeterPreserved = form.watch('oldMeter.preserved');
  const linkyRefusal = form.watch('oldMeter.linkyRefusal');
  const clientPresent = form.watch('clientValidation.present');

  const visibleSteps = useMemo(
    () => getVisibleSteps({ preserved: oldMeterPreserved, linkyRefusal }),
    [oldMeterPreserved, linkyRefusal]
  );
  const totalSteps = visibleSteps.length;

  useEffect(() => {
    setStep((current) => Math.min(current, totalSteps));
  }, [totalSteps]);

  const getActualStep = useCallback(
    (currentStep: number) => visibleSteps[currentStep - 1] ?? currentStep,
    [visibleSteps]
  );

  const goToStep = useCallback((target: number) => {
    setStep(target);
    window.scrollTo(0, 0);
  }, []);

  const restoreStep = useCallback(
    (target: number) => setStep(Math.max(1, Math.round(target))),
    []
  );

  const goToFirstInvalidStep = useCallback(
    (invalidSections: string[]) => {
      const invalidStep = findFirstInvalidStep(invalidSections, visibleSteps);

      if (invalidStep !== null) {
        goToStep(visibleSteps.indexOf(invalidStep) + 1);
      }
      toast.error(INVALID_SUBMISSION_MESSAGE);
    },
    [visibleSteps, goToStep]
  );

  const submit = useCallback(async () => {
    await form.handleSubmit(
      (data) => onSubmit(data),
      (errors) => goToFirstInvalidStep(Object.keys(errors))
    )();
  }, [form, onSubmit, goToFirstInvalidStep]);

  const nextStep = useCallback(async () => {
    if (readOnly) {
      if (step < totalSteps) {
        goToStep(step + 1);
      }
      return;
    }

    const fieldsToValidate = getFieldsToValidate(
      getActualStep(step),
      clientPresent
    );
    const isStepValid = await form.trigger(
      fieldsToValidate as Path<CreateCompletedDerivation>[]
    );

    if (!isStepValid) {
      return;
    }

    if (step < totalSteps) {
      goToStep(step + 1);
      return;
    }

    await submit();
  }, [
    step,
    totalSteps,
    form,
    getActualStep,
    clientPresent,
    goToStep,
    submit,
    readOnly,
  ]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      goToStep(step - 1);
    }
  }, [step, goToStep]);

  const progress = (step / totalSteps) * 100;

  return {
    step,
    totalSteps,
    progress,
    nextStep,
    prevStep,
    getActualStep,
    restoreStep,
    oldMeterPreserved,
  };
};
