
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onNext: () => void;
  onPrevious: () => void;
  children: React.ReactNode;
  stepValidities?: Record<number, boolean>;
  stepCompletionStatus?: Record<number, boolean>;
  encouragementMessage?: string;
}

export function FormStepLayout({
  currentStep,
  totalSteps,
  isStepValid,
  onNext,
  onPrevious,
  children,
  stepValidities = {},
  stepCompletionStatus = {},
  encouragementMessage
}: FormStepLayoutProps) {
  // Calculate progress percentage
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  // Generate steps array for the stepper
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-sm font-medium text-primary">
              {progress}% Complete
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="overflow-x-auto pb-2 mb-6">
          <Tabs value={currentStep.toString()} className="w-full min-w-max">
            <TabsList className="w-full justify-start gap-2 h-auto bg-transparent p-0">
              {steps.map((step) => (
                <TabsTrigger
                  key={step}
                  value={step.toString()}
                  disabled
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium
                    ${currentStep === step 
                      ? 'bg-primary text-white border-primary ring-2 ring-primary/20'
                      : currentStep > step || stepCompletionStatus[step]
                        ? 'bg-primary/10 text-primary border-primary/30' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }
                    ${stepValidities && stepValidities[step]
                      ? 'ring-2 ring-green-100' 
                      : ''
                    }
                  `}
                >
                  {stepCompletionStatus[step] ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {encouragementMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-600 mb-6 italic"
          >
            {encouragementMessage}
          </motion.p>
        )}

        <div className="mb-8">
          {children}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 1}
            className="px-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!isStepValid || currentStep === totalSteps}
            className="px-4"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
