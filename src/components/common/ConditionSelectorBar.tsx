
import React from 'react';
import { 
  CheckCircle, 
  ThumbsUp, 
  CircleCheck, 
  AlertCircle, 
  AlertTriangle 
} from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export enum ConditionLevel {
  Excellent = "excellent",
  VeryGood = "very_good",
  Good = "good",
  Fair = "fair",
  Poor = "poor"
}

interface ConditionSelectorBarProps {
  value: ConditionLevel;
  onChange: (level: ConditionLevel) => void;
  disabled?: boolean;
}

type ConditionOption = {
  value: ConditionLevel;
  label: string;
  percentage: string;
  description: string;
  details: string;
  impact: string;
  color: string;
  activeColor: string;
  icon: React.ReactNode;
};

const conditionOptions: ConditionOption[] = [
  {
    value: ConditionLevel.Excellent,
    label: 'Excellent',
    percentage: '90%',
    description: 'Like new condition',
    details: 'No visible scratches, like-new interior, all features work perfectly.',
    impact: 'Adds +10% over baseline',
    color: 'bg-green-100 border-green-200',
    activeColor: 'bg-green-500 text-white border-green-600',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    value: ConditionLevel.VeryGood,
    label: 'Very Good',
    percentage: '75%',
    description: 'Minimal wear',
    details: 'Very minor cosmetic defects, well-maintained, clean interior and exterior.',
    impact: 'Adds +5% over baseline',
    color: 'bg-emerald-100 border-emerald-200',
    activeColor: 'bg-emerald-500 text-white border-emerald-600',
    icon: <CircleCheck className="w-4 h-4" />,
  },
  {
    value: ConditionLevel.Good,
    label: 'Good',
    percentage: '60%',
    description: 'Normal wear and tear',
    details: 'Minor cosmetic issues, well-maintained mechanical components, clean interior.',
    impact: 'Baseline value',
    color: 'bg-blue-100 border-blue-200',
    activeColor: 'bg-blue-500 text-white border-blue-600',
    icon: <ThumbsUp className="w-4 h-4" />,
  },
  {
    value: ConditionLevel.Fair,
    label: 'Fair',
    percentage: '40%',
    description: 'Noticeable wear',
    details: 'Visible scratches, some mechanical issues that need attention, worn interior.',
    impact: 'Reduces value by -10%',
    color: 'bg-amber-100 border-amber-200',
    activeColor: 'bg-amber-500 text-white border-amber-600',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  {
    value: ConditionLevel.Poor,
    label: 'Poor',
    percentage: '25%',
    description: 'Significant issues',
    details: 'Significant mechanical or cosmetic problems, damaged interior, needs repairs.',
    impact: 'Reduces value by -25%',
    color: 'bg-red-100 border-red-200',
    activeColor: 'bg-red-500 text-white border-red-600',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
];

export const ConditionSelectorBar: React.FC<ConditionSelectorBarProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-1 rounded-xl overflow-hidden">
        {conditionOptions.map((option) => (
          <TooltipProvider key={option.value} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => !disabled && onChange(option.value)}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 px-2 transition-all border",
                    value === option.value
                      ? option.activeColor
                      : option.color,
                    disabled && "opacity-50 cursor-not-allowed",
                    "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  )}
                  disabled={disabled}
                  aria-label={`Select ${option.label} condition`}
                >
                  <div className="flex items-center justify-center space-x-1.5">
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-xs mt-1">{option.percentage}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="p-2 max-w-xs">
                <p><span className="font-medium">{option.description}</span></p>
                <p className="text-xs mt-1">{option.impact}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="bg-gray-50 border rounded-xl p-4 mt-4">
        <h4 className="font-medium text-gray-700 mb-2">What does each condition mean?</h4>
        <div className="grid grid-cols-1 gap-3 mt-2">
          {conditionOptions.map((option) => (
            <div key={`detail-${option.value}`} className="flex space-x-2">
              <div 
                className={cn(
                  "w-1 rounded-full flex-shrink-0", 
                  option.value === value ? option.activeColor : option.color
                )}
              />
              <div>
                <p className="text-sm font-medium">{option.label}: {option.description}</p>
                <p className="text-xs text-gray-600 mt-0.5">{option.details}</p>
                <p className="text-xs font-medium mt-0.5">{option.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConditionSelectorBar;
