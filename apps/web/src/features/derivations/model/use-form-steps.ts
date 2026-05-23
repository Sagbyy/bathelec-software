import { useState, useEffect, useCallback } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import {
  type CreateCompletedDerivation,
  STEP_FIELDS_TO_VALIDATE,
  TOTAL_STEPS,
} from '@/entities/derivation';

type UseFormStepsProps = {
  form: UseFormReturn<CreateCompletedDerivation>;
  onSubmit: (data: CreateCompletedDerivation) => void;
  readOnly?: boolean;
};

export const useFormSteps = ({
  form,
  onSubmit,
  readOnly = false,
}: UseFormStepsProps) => {
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(TOTAL_STEPS);

  const oldMeterPreserved = form.watch('oldMeter.preserved');
  const clientPresent = form.watch('clientValidation.present');
  const isLinkyRefusal = form.watch('oldMeter.linkyRefusal');

  useEffect(() => {
    if (isLinkyRefusal) {
      setTotalSteps(oldMeterPreserved ? 7 : 8);
    } else {
      setTotalSteps(oldMeterPreserved ? 8 : 9);
    }
  }, [oldMeterPreserved, isLinkyRefusal]);

  const getActualStep = useCallback(
    (currentStep: number) => {
      if (
        oldMeterPreserved &&
        isLinkyRefusal &&
        currentStep > 5 &&
        currentStep < 9
      ) {
        console.log('currentStep', currentStep);
        return currentStep + 2;
      }

      if (oldMeterPreserved && currentStep > 5 && currentStep < 9) {
        console.log('currentStep oldMeterPreserved', currentStep);
        return currentStep + 1;
      }

      if (isLinkyRefusal && currentStep > 6 && currentStep < 9) {
        console.log('currentStep isLinkyRefusal', currentStep);
        return currentStep + 1;
      }

      return currentStep;
    },
    [oldMeterPreserved]
  );

  const getFieldsToValidate = useCallback(
    (currentStep: number) => {
      const stepConfig = STEP_FIELDS_TO_VALIDATE[currentStep];

      if (currentStep === 6 && oldMeterPreserved) {
        return [];
      }

      if (
        currentStep === TOTAL_STEPS &&
        stepConfig &&
        typeof stepConfig === 'object' &&
        'present' in stepConfig
      ) {
        return clientPresent ? stepConfig.present : stepConfig.absent;
      }

      return stepConfig as string[];
    },
    [oldMeterPreserved, clientPresent]
  );

  const nextStep = useCallback(async () => {
    if (readOnly) {
      if (step < totalSteps) {
        if (oldMeterPreserved && step === 5) {
          setStep(6);
        } else {
          setStep(step + 1);
        }
        window.scrollTo(0, 0);
      }
      return;
    }

    const fieldsToValidate = getFieldsToValidate(getActualStep(step));
    const result = await form.trigger(
      fieldsToValidate as Path<CreateCompletedDerivation>[]
    );

    if (result) {
      if (step < totalSteps) {
        if (oldMeterPreserved && step === 5) {
          setStep(6);
        } else {
          setStep(step + 1);
        }
        window.scrollTo(0, 0);
      } else {
        const data = form.getValues();
        console.log(data);
        onSubmit(data);
      }
    }
  }, [
    step,
    totalSteps,
    oldMeterPreserved,
    form,
    getActualStep,
    getFieldsToValidate,
    onSubmit,
    readOnly,
  ]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      if (oldMeterPreserved && step === 6) {
        setStep(5);
      } else {
        setStep(step - 1);
      }
      window.scrollTo(0, 0);
    }
  }, [step, oldMeterPreserved]);

  const progress = (step / totalSteps) * 100;

  return {
    step,
    totalSteps,
    progress,
    nextStep,
    prevStep,
    getActualStep,
    getFieldsToValidate,
    oldMeterPreserved,
  };
};
