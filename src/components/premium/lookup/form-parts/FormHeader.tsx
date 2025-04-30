
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface FormHeaderProps {
  title?: string;
  subtitle?: string;
  tooltipContent?: string;
}

export function FormHeader({
  title = "Manual Entry",
  subtitle = "Detailed Vehicle Information",
  tooltipContent = "Enter your vehicle details manually for the most accurate valuation. More details = better results."
}: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1.5">
          <FileText className="h-4 w-4 mr-2" />
          {title}
        </Badge>
        <p className="text-sm font-medium text-slate-600">{subtitle}</p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="text-slate-500 h-8">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-sm">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
