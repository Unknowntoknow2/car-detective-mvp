
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ValuationFormActionsProps {
  isLoading: boolean;
  submitButtonText: string;
  onSubmit: () => void;
  onBack?: () => void;
}

export const ValuationFormActions: React.FC<ValuationFormActionsProps> = ({
  isLoading,
  submitButtonText,
  onSubmit,
  onBack
}) => {
  return (
    <div className="flex justify-between">
      {onBack && (
        <Button 
          onClick={onBack} 
          variant="outline"
          className="h-12 font-medium text-base rounded-lg"
        >
          Back
        </Button>
      )}
      <motion.div
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="relative"
      >
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="w-full bg-primary text-white h-12 font-medium text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </motion.div>
    </div>
  );
};
