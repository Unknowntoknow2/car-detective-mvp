
import { ConditionBadge } from "@/components/ui/condition-badge";
import { Button } from "@/components/ui/button";
import { Share, Save, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ValuationHeaderProps {
  valuationData: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage?: number;
  };
  photoSubmitted: boolean;
  photoScore: number | null;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  estimatedValue?: number;
  calculationInProgress: boolean;
  onShareValuation: () => void;
  onSaveToAccount: () => void;
  isSaving: boolean;
}

export function ValuationHeader({
  valuationData,
  photoSubmitted,
  photoScore,
  aiCondition,
  estimatedValue,
  calculationInProgress,
  onShareValuation,
  onSaveToAccount,
  isSaving
}: ValuationHeaderProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {valuationData.year} {valuationData.make} {valuationData.model} {valuationData.trim}
          </h2>
          
          {valuationData.mileage && (
            <p className="text-gray-500 text-sm">
              {new Intl.NumberFormat().format(valuationData.mileage)} miles
            </p>
          )}
          
          {photoSubmitted && aiCondition && (
            <div className="mt-2">
              <ConditionBadge 
                condition={aiCondition.condition}
                confidenceScore={aiCondition.confidenceScore}
              />
            </div>
          )}
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
          {calculationInProgress ? (
            <Skeleton className="h-8 w-40 bg-gray-200" />
          ) : (
            <p className="text-2xl font-bold text-primary">
              {estimatedValue ? formatter.format(estimatedValue) : 'N/A'}
            </p>
          )}
          <div className="flex items-center justify-end mt-1 gap-1">
            {photoSubmitted && aiCondition && aiCondition.confidenceScore >= 80 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100 flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      High Trust Score
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm max-w-xs">
                      This valuation has a high AI trust score based on photo analysis.
                      Higher scores indicate more reliable assessments.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <p className="text-xs text-gray-400">
              {photoSubmitted ? 'Based on AI photo analysis' : 'Based on provided information'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          onClick={onShareValuation}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          onClick={onSaveToAccount}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save to My Account'}
        </Button>
      </div>
    </div>
  );
}
