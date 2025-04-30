
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isStepValid: boolean;
}

export function FormStepNavigation({
  currentStep,
  totalSteps,
  goToNextStep,
  goToPreviousStep,
  isStepValid
}: FormStepNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 transition-all duration-300 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:transform group-hover:-translate-x-0.5" />
          <span>Previous</span>
        </Button>
      </motion.div>

      {currentStep < totalSteps && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={goToNextStep}
            disabled={!isStepValid}
            className={`flex items-center gap-2 transition-all duration-300 relative overflow-hidden group
              ${!isStepValid ? 'opacity-70' : 'hover:shadow-md'}`}
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:transform group-hover:translate-x-0.5" />
            
            {/* Animated indicator when the button becomes enabled */}
            {isStepValid && (
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 h-0.5 bg-white/30"
              />
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
