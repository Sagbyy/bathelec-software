import { Progress } from '@/components/ui/progress';

type FormHeaderProps = {
  step: number;
  totalSteps: number;
  progress: number;
};

export const FormHeader = ({ step, totalSteps, progress }: FormHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium">
          Étape {step} sur {totalSteps}
        </span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
