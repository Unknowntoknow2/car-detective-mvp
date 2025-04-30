
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface RecallToggleProps {
  hasOpenRecall: boolean;
  onToggle: (hasOpenRecall: boolean) => void;
  disabled?: boolean;
}

export function RecallToggle({ 
  hasOpenRecall, 
  onToggle, 
  disabled = false 
}: RecallToggleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="open-recall" className="text-base font-medium">
            Open Recall?
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">An open recall can reduce your vehicle's value by approximately 10%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Switch
          id="open-recall"
          checked={hasOpenRecall}
          onCheckedChange={onToggle}
          disabled={disabled}
        />
      </div>
      
      {hasOpenRecall && (
        <p className="text-sm text-amber-600">
          Note: Open recalls typically reduce a vehicle's value by approximately 10%.
        </p>
      )}
    </div>
  );
}
