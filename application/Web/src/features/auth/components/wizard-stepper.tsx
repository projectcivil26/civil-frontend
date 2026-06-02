import { cn } from "@/lib/utils";

interface WizardStepperProps {
  current: number;
  total: number;
  label: string;
}

// Compact horizontal progress indicator for the register wizard.
// Pure presentation component — no state, no logic.
export function WizardStepper({ current, total, label }: WizardStepperProps) {
  const percent = (current / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-500">
          Step {current} of {total}
        </span>
        <span className="font-medium text-teal-600">{label}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "h-full rounded-full bg-teal-500 transition-all duration-300"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
