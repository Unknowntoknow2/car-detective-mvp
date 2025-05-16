
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIConditionBadgeProps {
  condition: string | null;
  confidenceScore: number;
}

export function AIConditionBadge({ condition, confidenceScore }: AIConditionBadgeProps) {
  if (!condition) return null;

  const getVariant = () => {
    if (confidenceScore >= 90) return "default";
    if (confidenceScore >= 80) return "secondary";
    if (confidenceScore >= 70) return "outline";
    return "outline";
  };

  const getLabel = () => {
    return `AI: ${condition} (${confidenceScore}%)`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getVariant()} className="flex items-center gap-1.5 cursor-help">
            <CheckCircle className="h-3.5 w-3.5" />
            {getLabel()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">This condition was assessed by our AI with {confidenceScore}% confidence.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
