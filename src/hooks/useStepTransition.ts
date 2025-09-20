
import { useCallback, useState } from "react";
import { FormData } from "@/types/premium-valuation";

interface StepConfig {
  component: string;
  shouldShow: boolean;
  props?: any;
}

export function useStepTransition(
  currentStep: number,
  formData: FormData,
  isLoading: boolean,
  lookupVehicle: (
    type: "vin" | "plate" | "manual" | "photo",
    identifier: string,
    state?: string,
    manualData?: any,
  ) => Promise<void>
) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const findNextValidStep = useCallback(
    (current: number, direction: 1 | -1): number => {
      // Simple step navigation logic for MVP
      if (direction === 1) {
        return Math.min(current + 1, 7);
      } else {
        return Math.max(current - 1, 1);
      }
    },
    [formData, isLoading]
  );

  return {
    isTransitioning,
    findNextValidStep,
  };
}
