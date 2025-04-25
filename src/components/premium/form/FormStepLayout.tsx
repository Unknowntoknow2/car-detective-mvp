
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { ProgressIndicator } from './ProgressIndicator';
import { FormSteps } from './FormSteps';
import { FormStepNavigation } from './FormStepNavigation';
import { AccuracyMeter } from './AccuracyMeter';
import { motion } from 'framer-motion';

interface FormStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onNext: () => void;
  onPrevious: () => void;
  children: ReactNode;
  stepValidities: Record<number, boolean>;
  stepCompletionStatus: Record<number, boolean>;
  encouragementMessage?: string;
}

export function FormStepLayout({
  currentStep,
  totalSteps,
  isStepValid,
  onNext,
  onPrevious,
  children,
  stepValidities,
  stepCompletionStatus,
  encouragementMessage
}: FormStepLayoutProps) {
  return (
    <div className="space-y-6">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        stepCompletionStatus={stepCompletionStatus}
      />
      
      <div className="space-y-6">
        <AccuracyMeter stepValidities={stepValidities} totalSteps={totalSteps} />
        
        {encouragementMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded shadow-sm"
          >
            <p className="text-sm font-medium">{encouragementMessage}</p>
          </motion.div>
        )}
        
        <Card className="overflow-hidden border-2 border-gray-200 shadow-lg transition-all duration-300">
          <div className="p-6">
            <FormSteps currentStep={currentStep}>
              {children}
            </FormSteps>
            
            <FormStepNavigation 
              currentStep={currentStep}
              totalSteps={totalSteps}
              goToNextStep={onNext}
              goToPreviousStep={onPrevious}
              isStepValid={isStepValid}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
