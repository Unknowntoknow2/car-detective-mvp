
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface ConditionOption {
  value: string;
  label: string;
  description: string;
  details: string;
  impact: string;
  color: string;
}

interface ConditionSelectorProps {
  options: ConditionOption[];
  value: string;
  onChange: (value: string) => void;
  title: string;
  subtitle?: string;
}

export function ConditionSelector({ 
  options, 
  value, 
  onChange, 
  title, 
  subtitle 
}: ConditionSelectorProps) {
  const getBadgeVariant = (optionValue: string) => {
    switch (optionValue) {
      case 'excellent': return 'default';
      case 'very-good': return 'secondary';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[120px] ${
                isSelected
                  ? `${option.color} ring-2 ring-opacity-50 ring-current`
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-current border-current' 
                      : 'border-gray-400'
                  }`}>
                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <Badge variant={getBadgeVariant(option.value)} className="text-xs">
                  {option.impact}
                </Badge>
              </div>
              <div className="text-xs text-gray-600 mb-2 font-medium">{option.description}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{option.details}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
