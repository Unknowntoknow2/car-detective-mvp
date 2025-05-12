
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConditionSelectorProps {
  name?: string;
  label?: string;
  defaultValue?: number;
  required?: boolean;
  disableTooltips?: boolean;
  className?: string;
}

interface ConditionOption {
  value: number;
  label: string;
  description: string;
  improvementTips: string;
}

const conditionOptions: ConditionOption[] = [
  {
    value: 25,
    label: "Poor",
    description: "Vehicle has significant mechanical or cosmetic issues. May have high mileage (>150k), visible damage, engine problems, or rust.",
    improvementTips: "Address major mechanical issues, repair significant body damage, provide maintenance records."
  },
  {
    value: 50,
    label: "Fair",
    description: "Vehicle has noticeable wear and tear. May have minor dents, worn interior, higher mileage (100-150k), or require some maintenance.",
    improvementTips: "Fix minor dents and scratches, perform interior detailing, replace worn tires or brakes."
  },
  {
    value: 75,
    label: "Good",
    description: "Vehicle in good running condition with minimal issues. Some regular wear, recent maintenance, clean history, moderate mileage (50-100k).",
    improvementTips: "Complete all scheduled maintenance, repair minor cosmetic issues, detail interior and exterior."
  },
  {
    value: 90,
    label: "Excellent",
    description: "Vehicle in exceptional condition. Lower mileage (<50k), well-maintained, minimal wear, no mechanical issues, clean history report.",
    improvementTips: "Obtain complete service history documentation, consider certification, provide all records to buyer."
  }
];

export function ConditionSelector({
  name = "condition",
  label = "Vehicle Condition",
  defaultValue = 75,
  required = true,
  disableTooltips = false,
  className
}: ConditionSelectorProps) {
  const formContext = useFormContext();
  const { register, setValue, watch } = formContext || {};
  
  // Register field if form context exists
  React.useEffect(() => {
    if (formContext && setValue) {
      // Only set default value if one is provided and no current value exists
      const currentValue = watch?.(name);
      if (defaultValue && !currentValue) {
        setValue(name, defaultValue, { shouldValidate: true });
      }
      
      // Register the field
      register(name, { required });
    }
  }, [formContext, name, defaultValue, register, setValue, watch, required]);
  
  // Get current value from form or use local state if no form context
  const [localValue, setLocalValue] = React.useState<number>(defaultValue);
  const currentValue = formContext ? (watch?.(name) as number) : localValue;
  
  const handleOptionClick = (value: number) => {
    if (formContext && setValue) {
      setValue(name, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    } else {
      setLocalValue(value);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(value);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={name} 
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
            
            {!disableTooltips && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-sm">
                      Select the condition that best describes your vehicle's current state
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </label>
          
          <span className="text-sm text-muted-foreground">
            {conditionOptions.find(opt => opt.value === currentValue)?.label || 'Not selected'}
          </span>
        </div>
      )}
      
      <div 
        role="radiogroup" 
        aria-labelledby={`${name}-label`}
        className="grid grid-cols-4 gap-2 w-full"
      >
        {conditionOptions.map((option) => {
          const isSelected = currentValue === option.value;
          
          return (
            <div key={option.value} className="flex flex-col items-center">
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    id={`${name}-${option.value}`}
                    className={cn(
                      "w-full relative flex-1 rounded-md py-3 px-1 transition-all border-2 cursor-pointer",
                      "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                      isSelected 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-background border-muted hover:bg-muted/30"
                    )}
                    onClick={() => handleOptionClick(option.value)}
                    onKeyDown={(e) => handleKeyDown(e, option.value)}
                  >
                    <span className="flex flex-col items-center justify-center gap-1 text-center">
                      {isSelected && (
                        <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                      )}
                      <span className={cn(
                        "font-medium text-sm", 
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {option.label}
                      </span>
                      <span className={cn(
                        "text-xs", 
                        isSelected ? "text-primary/80" : "text-muted-foreground"
                      )}>
                        {option.value}%
                      </span>
                    </span>
                  </button>
                </HoverCardTrigger>
                
                {!disableTooltips && (
                  <HoverCardContent side="top" className="w-80 p-0">
                    <div className="space-y-2 p-4">
                      <h3 className="font-medium text-sm">{option.label} Condition ({option.value}%)</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="border-t border-border bg-muted/50 p-4">
                      <h4 className="font-medium text-xs text-muted-foreground mb-1">How to improve:</h4>
                      <p className="text-xs text-muted-foreground">{option.improvementTips}</p>
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
              
              {/* Show a visual indicator for the selected level */}
              <div className="h-1 mt-1 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-300 ease-out",
                    isSelected ? "bg-primary" : "bg-transparent"
                  )} 
                  style={{ width: `${option.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        id={name}
        {...(formContext && register ? register(name, { required }) : {})}
        value={currentValue}
      />
    </div>
  );
}
