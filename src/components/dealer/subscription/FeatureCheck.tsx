
import React from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FeatureCheckProps {
  included: boolean | 'limited' | 'full';
  label?: string;
}

export const FeatureCheck: React.FC<FeatureCheckProps> = ({ included, label }) => {
  if (included === 'limited') {
    return (
      <div className="flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="h-5 w-5 flex items-center justify-center text-amber-500"
        >
          <Check className="h-4 w-4" />
        </motion.div>
        {label && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  if (included === 'full' || included === true) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="h-5 w-5 flex items-center justify-center text-green-500"
      >
        <Check className="h-4 w-4" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="h-5 w-5 flex items-center justify-center text-gray-300"
    >
      <X className="h-3.5 w-3.5" />
    </motion.div>
  );
};
