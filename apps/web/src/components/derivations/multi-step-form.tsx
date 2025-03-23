'use client';

import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { ClientInfoStep } from './steps/client-info-step';
import { GeneralInfoStep } from './steps/general-info-step';
import { PhotoBeforeStep } from './steps/photo-before-step';
import { OldMeterStep } from './steps/old-meter-step';
import { NewDerivationStep } from './steps/new-derivation-step';
import { NewMeterStep } from './steps/new-meter-step';
import { CircuitBreakerStep } from './steps/circuit-breaker-step';
import { PhotoAfterStep } from './steps/photo-after-step';
import { ClientValidationStep } from './steps/client-validation-step';
import { createCompletedDerivationSchema } from '@/validators/derivationForm';
import {
  useCompletedDerivations,
  useCompletedDerivationsById,
} from '@/hooks/queries/use-completed-derivations';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { toast } from '@/hooks/use-toast';

import { DEFAULT_FORM_VALUES } from '../../constants/derivations';
import { formatCompletedDerivation } from './utils/form-data-formatter';
import { useFormSteps } from '../../hooks/use-form-steps';
import { FormHeader } from './form-parts/form-header';
import { FormNavigation } from './form-parts/form-navigation';

export function MultiStepForm({
  requestedDerivationId,
}: {
  requestedDerivationId: number;
}) {
  const {
    mutate: createCompletedDerivation,
    status,
    error,
  } = useCompletedDerivations();
  const { data: completedDerivation } = useCompletedDerivationsById(
    requestedDerivationId
  );

  const form = useForm<CreateCompletedDerivation>({
    resolver: zodResolver(createCompletedDerivationSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  useEffect(() => {
    if (completedDerivation) {
      console.log(formatCompletedDerivation(completedDerivation));
      form.reset(formatCompletedDerivation(completedDerivation));
    }
  }, [completedDerivation, form]);

  const onSubmit = useCallback(
    (data: CreateCompletedDerivation) => {
      createCompletedDerivation({
        ...data,
        requestedDerivationId,
      });
    },
    [createCompletedDerivation, requestedDerivationId]
  );

  useEffect(() => {
    if (status === 'success') {
      toast({
        title: 'Formulaire soumis avec succès !',
        description: 'Votre demande a été soumise avec succès.',
        variant: 'success',
      });
    }

    if (status === 'error') {
      toast({
        title: 'Erreur lors de la soumission du formulaire',
        description: `Une erreur est survenue lors de la soumission du formulaire. ${error?.message}`,
        variant: 'destructive',
      });
    }
  }, [status, error]);

  const { step, totalSteps, progress, nextStep, prevStep, getActualStep } =
    useFormSteps({
      form,
      onSubmit,
    });

  const renderStep = useCallback(() => {
    const actualStep = getActualStep(step);

    switch (actualStep) {
      case 1:
        return <ClientInfoStep form={form} />;
      case 2:
        return <GeneralInfoStep form={form} />;
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
        <form>
          <Card>
            <CardContent className="pt-6">
              {renderStep()}

              <FormNavigation
                step={step}
                totalSteps={totalSteps}
                onNext={nextStep}
                onPrev={prevStep}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
