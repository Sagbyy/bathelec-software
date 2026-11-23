import { cn } from '@/shared/lib/utils';

type FormHeaderProps = {
  step: number;
  totalSteps: number;
  progress: number;
};

type SegmentState = 'done' | 'current' | 'upcoming';

const SEGMENT_CLASSES: Record<SegmentState, string> = {
  done: 'bg-primary',
  current: 'bg-primary/60',
  upcoming: 'bg-muted',
};

const getSegmentState = (index: number, step: number): SegmentState => {
  if (index < step) return 'done';
  if (index === step) return 'current';
  return 'upcoming';
};

export const FormHeader = ({ step, totalSteps, progress }: FormHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold">
          Étape {step} sur {totalSteps}
        </span>
        <span className="text-sm font-medium tabular-nums text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Progression du formulaire"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={step}
        className="flex gap-1"
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const state = getSegmentState(index + 1, step);
          return (
            <span
              key={index}
              data-state={state}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                SEGMENT_CLASSES[state]
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
