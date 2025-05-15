
import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PlanToggleProps {
  isYearly: boolean;
  onChange: (value: boolean) => void;
}

export const PlanToggle: React.FC<PlanToggleProps> = ({ isYearly, onChange }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
      <div className="flex items-center gap-3 p-1 rounded-full border border-border/50 bg-muted/30">
        <motion.div
          className="relative flex items-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isYearly ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Label 
            htmlFor="plan-toggle" 
            className={`relative z-10 px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 ${
              !isYearly ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Monthly
          </Label>
          {!isYearly && (
            <motion.div 
              className="absolute inset-0 bg-primary/10 rounded-full"
              layoutId="toggleBackground"
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            />
          )}
        </motion.div>
        
        <div className="mx-1">
          <Switch
            id="plan-toggle"
            checked={isYearly}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        <motion.div
          className="relative flex items-center"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isYearly ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          <Label 
            htmlFor="plan-toggle" 
            className={`relative z-10 px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 ${
              isYearly ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Yearly
          </Label>
          {isYearly && (
            <motion.div 
              className="absolute inset-0 bg-primary/10 rounded-full"
              layoutId="toggleBackground"
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            />
          )}
          <div className="absolute -right-3 -top-3">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
