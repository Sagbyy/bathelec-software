'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { formSchema } from '@/lib/validations/derivationForm';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

type FormValues = z.infer<typeof formSchema>;

export function MultiStepForm() {
  const [step, setStep] = useState(9);
  const totalSteps = 9;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientInfo: {
        name: '',
        phone: '',
        folio: '',
      },
      generalInfo: {
        dateTime: new Date().toISOString(),
        derivationBy: '',
        address: {
          street: '',
          postalCode: '',
          city: '',
        },
        building: '',
        cmIdentification: '',
        floor: '',
        situation: '',
        comment: '',
      },
      photoBeforeWork: {
        photo: null,
      },
      oldMeter: {
        type: '',
        generation: '',
        preserved: false,
        serialNumber: '',
        key: '',
        dayIndex: '',
        nightIndex: '',
        indexPhoto: null,
      },
      newDerivation: {
        section: '',
        cableType: '',
        length: 0,
      },
      newMeter: {
        generation: '',
        serialNumber: '',
        dayIndex: '',
        nightIndex: '',
        indexPhoto: null,
      },
      circuitBreaker: {
        preserved: false,
        voltage: 'mono',
        brand: '',
        type: 'non_differentiel',
        power: '',
        commissioningDone: false,
        sealed: false,
      },
      photoAfterWork: {
        photo: null,
      },
      clientValidation: {
        present: true,
        workValidation: false,
        satisfactionLevel: '0',
        clientComment: '',
        signature: null,
        technicianComment: '',
      },
    },
    mode: 'onChange',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    alert('Formulaire soumis avec succès !');
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(step);

    const result = await form.trigger(fieldsToValidate as any);

    if (result) {
      if (step < totalSteps) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const getFieldsToValidate = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return ['clientInfo.name', 'clientInfo.phone', 'clientInfo.folio'];
      case 2:
        return [
          'generalInfo.dateTime',
          'generalInfo.derivationBy',
          'generalInfo.address.street',
          'generalInfo.address.postalCode',
          'generalInfo.address.city',
          'generalInfo.building',
          'generalInfo.cmIdentification',
          'generalInfo.floor',
          'generalInfo.situation',
        ];
      case 3:
        return ['photoBeforeWork.photo'];
      case 4:
        return [
          'oldMeter.type',
          'oldMeter.generation',
          'oldMeter.serialNumber',
          'oldMeter.key',
          'oldMeter.dayIndex',
        ];
      case 5:
        return [
          'newDerivation.section',
          'newDerivation.cableType',
          'newDerivation.length',
        ];
      case 6:
        return [
          'newMeter.generation',
          'newMeter.serialNumber',
          'newMeter.dayIndex',
          'newMeter.indexPhoto',
        ];
      case 7:
        return ['circuitBreaker.brand', 'circuitBreaker.power'];
      case 8:
        return ['photoAfterWork.photo'];
      case 9:
        return form.getValues('clientValidation.present')
          ? [
              'clientValidation.workValidation',
              'clientValidation.satisfactionLevel',
              'clientValidation.signature',
              'clientValidation.technicianComment',
            ]
          : ['clientValidation.technicianComment'];
      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (step) {
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
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="">
      <div className="mb-8">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium">
            Étape {step} sur {totalSteps}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form>
          <Card>
            <CardContent className="pt-6">
              {renderStep()}

              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <Button type="button" onClick={nextStep}>
                  {step === totalSteps ? (
                    <>
                      Soumettre
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
