
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

// Extended interface for condition options
interface ConditionOption {
  value: ConditionLevel;
  label: string;
  conditionValue: number;
  description: string;
  valueImpact: string;
  icon: LucideIcon;
}

const CONDITION_OPTIONS: ConditionOption[] = [
  { 
    value: 'poor', 
    label: 'Poor', 
    conditionValue: 25, 
    description: 'Significant repairs needed, not fully operational',
    valueImpact: 'Reduces value by 20-30%',
    icon: AlertTriangle
  },
  { 
    value: 'fair', 
    label: 'Fair', 
    conditionValue: 50, 
    description: 'Functional but has noticeable wear and issues',
    valueImpact: 'Reduces value by 10-15%',
    icon: AlertTriangle
  },
  { 
    value: 'good', 
    label: 'Good', 
    conditionValue: 75, 
    description: 'Minor wear, fully functional with minimal issues',
    valueImpact: 'Baseline value',
    icon: CheckCircle
  },
  { 
    value: 'excellent', 
    label: 'Excellent', 
    conditionValue: 100, 
    description: 'Like new condition with minimal wear',
    valueImpact: 'Increases value by 5-15%',
    icon: CheckCircle
  }
];

interface ConditionInputProps {
  condition: ConditionLevel;
  conditionValue: number;
  onChange: (value: ConditionLevel) => void;
  onSliderChange: (value: number) => void;
  disabled?: boolean;
}

export function ConditionInput({ 
  condition, 
  conditionValue, 
  onChange, 
  onSliderChange, 
  disabled 
}: ConditionInputProps) {
  const selectedCondition = CONDITION_OPTIONS.find(option => option.value === condition);

  const getConditionColor = (value: string): string => {
    switch (value) {
      case 'poor': return 'text-red-500 bg-red-50';
      case 'fair': return 'text-amber-500 bg-amber-50';
      case 'good': return 'text-green-500 bg-green-50';
      case 'excellent': return 'text-blue-500 bg-blue-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };
  
  const handleTabClick = (option: ConditionOption) => {
    if (disabled) return;
    onChange(option.value);
    onSliderChange(option.conditionValue);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-slate-700">Vehicle Condition</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-4">
              <p className="text-sm font-medium mb-2">How condition affects valuation:</p>
              <ul className="space-y-2 text-sm">
                {CONDITION_OPTIONS.map(option => (
                  <li key={option.value} className="flex items-start">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${option.value === 'poor' ? 'bg-red-500' : option.value === 'fair' ? 'bg-amber-500' : option.value === 'good' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    <span>
                      <strong className="font-medium">{option.label}:</strong> {option.valueImpact}
                    </span>
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {CONDITION_OPTIONS.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
              cursor-pointer rounded-lg border p-3 text-center transition-all
              ${condition === option.value 
                ? `border-2 ${getConditionColor(option.value)} border-${option.value === 'poor' ? 'red' : option.value === 'fair' ? 'amber' : option.value === 'good' ? 'green' : 'blue'}-300` 
                : 'border-slate-200 hover:border-slate-300 bg-white'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            onClick={() => handleTabClick(option)}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <option.icon className={`h-5 w-5 mb-1 ${condition === option.value ? (option.value === 'poor' || option.value === 'fair' ? 'text-amber-500' : 'text-green-500') : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${condition === option.value ? (option.value === 'poor' ? 'text-red-700' : option.value === 'fair' ? 'text-amber-700' : option.value === 'good' ? 'text-green-700' : 'text-blue-700') : 'text-slate-700'}`}>
                {option.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4">
        <Slider 
          value={[conditionValue]} 
          max={100} 
          step={1} 
          onValueChange={value => onSliderChange(value[0])}
          disabled={disabled}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span className="text-red-500">Poor</span>
          <span className="text-amber-500">Fair</span>
          <span className="text-green-500">Good</span>
          <span className="text-blue-500">Excellent</span>
        </div>
      </div>
      
      {selectedCondition && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          key={selectedCondition.value}
          className={`p-4 rounded-lg border mt-4 ${getConditionColor(selectedCondition.value)}`}
        >
          <div className="flex items-start gap-3">
            <selectedCondition.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${selectedCondition.value === 'poor' || selectedCondition.value === 'fair' ? 'text-amber-500' : 'text-green-500'}`} />
            <div>
              <h4 className="text-sm font-medium mb-1">
                {selectedCondition.label} Condition
              </h4>
              <p className="text-xs">
                {selectedCondition.description}
              </p>
              <p className="text-xs mt-1 font-medium">
                Valuation Impact: {selectedCondition.valueImpact}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
