<<<<<<< HEAD

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
=======
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award, Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface OfferScoreBadgeProps {
  score?: number;
  label?: string;
  insight?: string;
  isBestOffer?: boolean;
  recommendation?: 'excellent' | 'good' | 'fair' | 'below_market';
}

<<<<<<< HEAD
export function OfferScoreBadge({ 
  score, 
  label, 
  insight, 
  isBestOffer = false,
  recommendation 
}: OfferScoreBadgeProps) {
  if (!score && !label) return null;

  // Determine badge color and icon based on score or recommendation
  const getBadgeVariant = () => {
    if (recommendation) {
      switch (recommendation) {
        case 'excellent':
          return { color: 'bg-green-100 text-green-800 border-green-200', icon: TrendingUp };
        case 'good':
          return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: TrendingUp };
        case 'fair':
          return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Minus };
        case 'below_market':
          return { color: 'bg-red-100 text-red-800 border-red-200', icon: TrendingDown };
        default:
          return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Minus };
      }
    }

    if (score !== undefined) {
      if (score >= 80) {
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: TrendingUp };
      } else if (score >= 60) {
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: TrendingUp };
      } else if (score >= 40) {
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Minus };
      } else {
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: TrendingDown };
      }
    }

    // Default fallback
    return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Minus };
  };

  const { color, icon: Icon } = getBadgeVariant();
  const displayLabel = label || (recommendation ? recommendation.replace('_', ' ') : 'Scored');

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${color} flex items-center gap-1 text-xs`}>
        <Icon className="h-3 w-3" />
        {displayLabel}
        {score !== undefined && ` (${score})`}
      </Badge>
      {isBestOffer && (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
          <Star className="h-3 w-3 fill-current" />
          Best
        </Badge>
      )}
    </div>
  );
=======
export function OfferScoreBadge(
  { label, insight, score, isBestOffer = false }: OfferScoreBadgeProps,
) {
  if (!label) return null;

  switch (label) {
    case "Good Deal":
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
              {isBestOffer && (
                <p className="font-semibold mt-1">Best offer available!</p>
              )}
              {score && <p className="text-xs mt-1">Score: {score}/100</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "Fair Offer":
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
    case "Below Market":
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
