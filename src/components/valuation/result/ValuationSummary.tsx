
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { generateConfidenceExplanation } from '@/utils/unifiedConfidenceCalculator';
import { Bot } from 'lucide-react';

export interface ValuationSummaryProps {
  estimatedValue: number;
  confidenceScore: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    mileage?: number;
    condition?: string;
  };
  marketAnchors?: {
    exactVinMatch?: boolean;
    listingsCount?: number;
    trustScore?: number;
  };
  sources?: string[];
  explanation?: string;
}

export const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  estimatedValue,
  confidenceScore,
  vehicleInfo,
  marketAnchors,
  sources = [],
  explanation
}) => {
  const confidenceLevel = confidenceScore >= 85 ? 'High' :
                          confidenceScore >= 70 ? 'Good' : 
                          confidenceScore >= 50 ? 'Moderate' : 'Low';
  
  const confidenceColor = confidenceScore >= 85 ? 'text-green-600' :
                          confidenceScore >= 70 ? 'text-amber-500' : 
                          confidenceScore >= 50 ? 'text-yellow-600' : 'text-red-500';

  // Generate AI confidence explanation
  const confidenceContext = {
    exactVinMatch: sources.includes('exact_vin_match') || marketAnchors?.exactVinMatch || false,
    marketListings: [],
    sources,
    trustScore: marketAnchors?.trustScore || 0.5,
    mileagePenalty: 0.02,
    zipCode: ''
  };
  
  const confidenceExplanation = explanation || 
    generateConfidenceExplanation(confidenceScore, confidenceContext);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Estimated Value</h3>
          <p className="text-3xl font-bold">{formatCurrency(estimatedValue)}</p>
        </div>
        
        <div className="mt-2 sm:mt-0">
          <h3 className="text-sm font-medium text-muted-foreground">Confidence Score</h3>
          <div className="flex items-center gap-2">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div 
                className={cn("h-2 rounded-full transition-all duration-500", 
                  confidenceScore >= 85 ? "bg-green-500" : 
                  confidenceScore >= 70 ? "bg-amber-500" : 
                  confidenceScore >= 50 ? "bg-yellow-500" :
                  "bg-red-500"
                )}
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <span className={cn("text-sm font-medium", confidenceColor)}>
              {confidenceScore}% ({confidenceLevel})
            </span>
            {(sources.includes('exact_vin_match') || marketAnchors?.exactVinMatch) && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                VIN Match
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-gray-50 p-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Year</p>
          <p className="font-medium">{vehicleInfo.year}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Make</p>
          <p className="font-medium">{vehicleInfo.make}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Model</p>
          <p className="font-medium">{vehicleInfo.model}</p>
        </div>
        {vehicleInfo.mileage && (
          <div>
            <p className="text-xs text-muted-foreground">Mileage</p>
            <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} mi</p>
          </div>
        )}
        {vehicleInfo.condition && (
          <div>
            <p className="text-xs text-muted-foreground">Condition</p>
            <p className="font-medium">{vehicleInfo.condition}</p>
          </div>
        )}
      </div>
      
      {/* Confidence Explanation based on score level */}
      <div className={cn(
        "mt-4 p-3 rounded-md border",
        confidenceScore >= 85 ? "bg-green-50 border-green-200" :
        confidenceScore >= 70 ? "bg-blue-50 border-blue-200" :
        confidenceScore >= 50 ? "bg-amber-50 border-amber-200" :
        "bg-red-50 border-red-200"
      )}>
        <h4 className={cn(
          "text-sm font-medium mb-1",
          confidenceScore >= 85 ? "text-green-800" :
          confidenceScore >= 70 ? "text-blue-800" :
          confidenceScore >= 50 ? "text-amber-800" :
          "text-red-800"
        )}>
          {confidenceLevel} Confidence Valuation
        </h4>
        <p className={cn(
          "text-xs",
          confidenceScore >= 85 ? "text-green-700" :
          confidenceScore >= 70 ? "text-blue-700" :
          confidenceScore >= 50 ? "text-amber-700" :
          "text-red-700"
        )}>
          {confidenceExplanation}
        </p>
      </div>
      
      {/* AI Explanation Display */}
      {explanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">AI Valuation Insight</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
