
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

type Condition = 'Poor' | 'Fair' | 'Good' | 'Excellent';

interface ConditionSelectorProps {
  value: Condition;
  onChange: (condition: Condition) => void;
}

const conditions: Array<{
  value: Condition;
  label: string;
  color: string;
  description: string;
}> = [
  {
    value: 'Poor',
    label: 'Poor',
    color: 'bg-red-400',
    description: 'Vehicle has significant mechanical or cosmetic issues and requires major repairs.'
  },
  {
    value: 'Fair',
    label: 'Fair',
    color: 'bg-amber-400',
    description: 'Vehicle has some mechanical or cosmetic issues but is in working condition.'
  },
  {
    value: 'Good',
    label: 'Good',
    color: 'bg-green-400',
    description: 'Vehicle is in good working condition with minor wear and tear.'
  },
  {
    value: 'Excellent',
    label: 'Excellent',
    color: 'bg-blue-400',
    description: 'Vehicle is in exceptional condition with minimal signs of wear.'
  }
];

export const ConditionSelector = ({ value, onChange }: ConditionSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Vehicle Condition</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon size={16} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Select the condition that best describes the overall state of the vehicle.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm font-medium">
          Selected: <span className="text-primary">{value}</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {conditions.map((condition) => (
          <TooltipProvider key={condition.value}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChange(condition.value)}
                  className={`relative flex flex-col items-center p-3 rounded-lg transition-all ${
                    value === condition.value
                      ? 'ring-2 ring-primary ring-offset-2 shadow-md'
                      : 'ring-1 ring-border hover:ring-primary/50'
                  }`}
                  aria-label={`Set condition to ${condition.label}`}
                >
                  <div className={`w-full h-2 rounded-full mb-2 ${condition.color}`} />
                  <span className="text-sm font-medium">{condition.label}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="max-w-xs">{condition.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
