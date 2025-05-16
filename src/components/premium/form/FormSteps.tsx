
import React from 'react';

interface FormStepsProps {
  currentStep: number;
  children: React.ReactNode;
}

export function FormSteps({ currentStep, children }: FormStepsProps) {
  return (
    <div className="py-4">
      {/* We'll only render children instead of the individual step components */}
      {children}
    </div>
  );
}
