import { Button } from '@/components/ui/button';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type FormNavigationProps = {
  form: UseFormReturn<CreateCompletedDerivation>;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
};

export const FormNavigation = ({
  form,
  step,
  totalSteps,
  onNext,
  onPrev,
}: FormNavigationProps) => {
  const isLastStep = step === totalSteps;
  const { isCompleted } = useDerivationStatusStore();
  const isSealed = form.watch('circuitBreaker.sealed');

  return (
    <div className="mt-8 flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={step === 1}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Précédent
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={(isLastStep && isCompleted) || (!isSealed && step === 7)}
      >
        {isLastStep ? (
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
  );
};
