
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { generateConfidenceExplanation } from '@/utils/valuation/calculateUnifiedConfidence';
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
  explanation?: string; // 🎯 REQUIREMENT 4: AI explanation prop
}

export const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  estimatedValue,
  confidenceScore,
  vehicleInfo,
  marketAnchors,
  sources = [],
  explanation // 🎯 REQUIREMENT 4: Extract AI explanation prop
}) => {
  const confidenceLevel = confidenceScore >= 85 ? 'High' :
                          confidenceScore >= 70 ? 'Medium' : 'Low';
  
  const confidenceColor = confidenceScore >= 85 ? 'text-green-600' :
                          confidenceScore >= 70 ? 'text-amber-500' : 'text-red-500';

  // Generate AI confidence explanation
  const confidenceContext = {
    exactVinMatch: sources.includes('exact_vin_match') || marketAnchors?.exactVinMatch || false,
    marketListings: [],
    sources,
    trustScore: marketAnchors?.trustScore || 0.5,
    mileagePenalty: 0.02,
    zipCode: '95678'
  };
  
  const confidenceExplanation = generateConfidenceExplanation(confidenceScore, confidenceContext);

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
                  "bg-red-500"
                )}
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <span className={cn("text-sm font-medium", confidenceColor)}>
              {confidenceScore}% ({confidenceLevel})
            </span>
            {sources.includes('exact_vin_match') && (
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
      
      {/* Confidence Explanation */}
      {confidenceScore >= 90 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <h4 className="text-sm font-medium text-green-800 mb-1">High Confidence Valuation</h4>
          <p className="text-xs text-green-700">{confidenceExplanation}</p>
        </div>
      )}
      
      {confidenceScore < 70 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-sm font-medium text-amber-800 mb-1">Confidence Note</h4>
          <p className="text-xs text-amber-700">{confidenceExplanation}</p>
        </div>
      )}
      
      {/* 🎯 REQUIREMENT 4: AI Explanation Display */}
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
};
