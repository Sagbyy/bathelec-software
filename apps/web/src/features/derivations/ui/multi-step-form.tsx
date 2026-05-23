'use client';

import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type DefaultValues } from 'react-hook-form';
import { Form } from '@/shared/ui/form';
import { Card, CardContent } from '@/shared/ui/card';
import { ClientInfoStep } from './steps/client-info-step';
import { GeneralInfoStep } from './steps/general-info-step';
import { PhotoBeforeStep } from './steps/photo-before-step';
import { OldMeterStep } from './steps/old-meter-step';
import { NewDerivationStep } from './steps/new-derivation-step';
import { NewMeterStep } from './steps/new-meter-step';
import { CircuitBreakerStep } from './steps/circuit-breaker-step';
import { PhotoAfterStep } from './steps/photo-after-step';
import { ClientValidationStep } from './steps/client-validation-step';
import { createCompletedDerivationSchema } from '@/entities/derivation';
import { useCompletedDerivationsById } from '..';
import { CreateCompletedDerivation } from '@/entities/derivation';
import { useDerivationSubmit } from '..';
import { DEFAULT_FORM_VALUES } from '@/entities/derivation';
import { formatCompletedDerivation } from './utils/form-data-formatter';
import { useFormSteps } from '..';
import { FormHeader } from './form-parts/form-header';
import { FormNavigation } from './form-parts/form-navigation';
import { Derivation, DerivationStatus } from '@repo/types';
import { useDerivationStatusStore } from '@/entities/derivation';

interface MultiStepFormProps {
  derivation: Derivation;
  readOnly?: boolean;
}

export function MultiStepForm({
  derivation,
  readOnly = false,
}: MultiStepFormProps) {
  const { submit } = useDerivationSubmit(derivation.id);
  const { data: completedDerivation } = useCompletedDerivationsById(
    derivation.id
  );
  const { setIsNotEditable } = useDerivationStatusStore();

  useEffect(() => {
    if (readOnly) {
      setIsNotEditable(true);
      return;
    }

    if (
      derivation.status === DerivationStatus.COMPLETED ||
      derivation.status === DerivationStatus.REVIEWING ||
      derivation.status === DerivationStatus.INCORRECT
    ) {
      setIsNotEditable(true);
    } else {
      setIsNotEditable(false);
    }
  }, [derivation.status, setIsNotEditable, readOnly]);

  const form = useForm<
    CreateCompletedDerivation,
    unknown,
    CreateCompletedDerivation
  >({
    resolver: zodResolver(createCompletedDerivationSchema),
    defaultValues:
      DEFAULT_FORM_VALUES as unknown as DefaultValues<CreateCompletedDerivation>,
    mode: 'onChange',
  });

  useEffect(() => {
    if (completedDerivation) {
      form.reset(formatCompletedDerivation(completedDerivation));
    }
  }, [completedDerivation, form]);

  const { step, totalSteps, progress, nextStep, prevStep, getActualStep } =
    useFormSteps({
      form,
      onSubmit: submit,
      readOnly,
    });

  const renderStep = useCallback(() => {
    const actualStep = getActualStep(step);
    //const actualStep = 9;

    switch (actualStep) {
      case 1:
        return <ClientInfoStep form={form} />;
      case 2:
        return <GeneralInfoStep form={form} derivation={derivation} />;
      case 3:
        return <PhotoBeforeStep form={form} />;
      case 4:
        return <OldMeterStep form={form} />;
      case 5:
        return <NewDerivationStep form={form} />;
      case 6:
        return <NewMeterStep form={form} />;
      case 7:
        return <CircuitBreakerStep form={form} />;
      case 8:
        return <PhotoAfterStep form={form} />;
      case 9:
        return <ClientValidationStep form={form} />;
      default:
        return null;
    }
  }, [form, step, getActualStep]);

  return (
    <div className="w-full">
      <FormHeader step={step} totalSteps={totalSteps} progress={progress} />

      <Form {...form}>
        <form
          onSubmit={(e) => {
            if (readOnly) {
              e.preventDefault();
              return false;
            }
          }}
        >
          <Card>
            <CardContent className="pt-6">
              {renderStep()}

              <FormNavigation
                form={form}
                step={step}
                totalSteps={totalSteps}
                onNext={nextStep}
                onPrev={prevStep}
                readOnly={readOnly}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
