
import React from 'react';

interface FormStepsProps {
  currentStep: number;
  children: React.ReactNode;
}

export function FormSteps({ currentStep, children }: FormStepsProps) {
  // Filter children to only show the current step
  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray.find((child) => {
    if (React.isValidElement(child) && typeof child.props.step === 'number') {
      return child.props.step === currentStep;
    }
    return false;
  });

  return <div className="space-y-6">{currentChild}</div>;
}
