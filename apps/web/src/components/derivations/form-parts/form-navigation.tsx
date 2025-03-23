import { Button } from '@/components/ui/button';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

type FormNavigationProps = {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
};

export const FormNavigation = ({
  step,
  totalSteps,
  onNext,
  onPrev,
}: FormNavigationProps) => {
  const isLastStep = step === totalSteps;
  const { isCompleted } = useDerivationStatusStore();

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
        disabled={isLastStep && isCompleted}
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
