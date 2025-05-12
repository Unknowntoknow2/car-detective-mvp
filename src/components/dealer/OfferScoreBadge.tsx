
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OfferScoreBadgeProps {
  label?: string;
  insight?: string;
  score?: number;
  isBestOffer?: boolean;
}

export function OfferScoreBadge({ label, insight, score, isBestOffer = false }: OfferScoreBadgeProps) {
  if (!label) return null;
  
  switch (label) {
    case 'Good Deal':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 flex items-center gap-1">
                {isBestOffer && <Award className="h-3 w-3" />}
                {label}
                <TrendingUp className="h-3 w-3 ml-1" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{insight}</p>
              {isBestOffer && <p className="font-semibold mt-1">Best offer available!</p>}
              {score && <p className="text-xs mt-1">Score: {score}/100</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'Fair Offer':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 flex items-center gap-1">
                {label}
                <Minus className="h-3 w-3 ml-1" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{insight}</p>
              {score && <p className="text-xs mt-1">Score: {score}/100</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'Below Market':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 flex items-center gap-1">
                {label}
                <TrendingDown className="h-3 w-3 ml-1" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{insight}</p>
              {score && <p className="text-xs mt-1">Score: {score}/100</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
                {label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{insight || "No additional information available."}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
  }
}
