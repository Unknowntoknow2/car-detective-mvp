
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ConditionLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;

interface ConditionBadgeProps {
  condition: ConditionLevel;
  confidenceScore?: number;
  className?: string;
  showVerificationOnly?: boolean;
}

export function ConditionBadge({ 
  condition, 
  confidenceScore = 0, 
  className,
  showVerificationOnly = false
}: ConditionBadgeProps) {
  if (!condition && !showVerificationOnly) return null;
  
  const isVerified = confidenceScore >= 70;
  
  // Determine style based on confidence level
  const getVariant = () => {
    if (!isVerified) return "outline";
    
    if (confidenceScore >= 90) return "default"; // Green
    if (confidenceScore >= 80) return "secondary"; // Blue
    if (confidenceScore >= 70) return "outline"; // Neutral
    return "outline"; // Default
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getVariant()} 
            className={cn(
              "flex items-center gap-1.5 cursor-help",
              !isVerified && "text-gray-500 border-gray-300",
              confidenceScore >= 90 && isVerified && "bg-green-500 hover:bg-green-600",
              confidenceScore >= 80 && confidenceScore < 90 && isVerified && "bg-blue-500 hover:bg-blue-600",
              confidenceScore >= 70 && confidenceScore < 80 && isVerified && "border-amber-500 text-amber-600",
              confidenceScore < 70 && "border-red-500 text-red-600",
              className
            )}
          >
            {isVerified ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            
            {showVerificationOnly ? (
              isVerified ? (
                `AI Verified (${confidenceScore}%)`
              ) : (
                `Unverified`
              )
            ) : (
              isVerified ? (
                `AI Verified: ${condition}`
              ) : (
                `AI Unverified (Low Confidence)`
              )
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {isVerified 
              ? "This condition has been verified by AI image analysis. Higher confidence scores indicate more reliable assessments."
              : "Our AI couldn't verify the condition with high confidence. Consider uploading clearer photos from multiple angles."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
