import { Button } from '@/shared/ui/button';
import { useDerivationStatusStore } from '@/entities/derivation';
import { CreateCompletedDerivation } from '@/entities/derivation';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type FormNavigationProps = {
  form: UseFormReturn<CreateCompletedDerivation>;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  readOnly?: boolean;
};

export const FormNavigation = ({
  form,
  step,
  totalSteps,
  onNext,
  onPrev,
  readOnly = false,
}: FormNavigationProps) => {
  const isLastStep = step === totalSteps;
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  return (
    <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 -mx-5 -mb-5 mt-8 flex gap-3 rounded-b-xl border-t bg-card/95 px-5 py-2.5 backdrop-blur md:static md:mx-0 md:mb-0 md:justify-between md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
      <Button
        type="button"
        variant="outline"
        className="flex-1 md:min-w-32 md:flex-none"
        onClick={onPrev}
        disabled={step === 1}
      >
        <ChevronLeft />
        Précédent
      </Button>

      <Button
        type="button"
        className="flex-1 md:min-w-32 md:flex-none"
        onClick={onNext}
        disabled={isLastStep && isCompleted}
      >
        {isLastStep ? (
          <>
            Soumettre
            <Check />
          </>
        ) : (
          <>
            Suivant
            <ChevronRight />
          </>
        )}
      </Button>
    </div>
  );
};
