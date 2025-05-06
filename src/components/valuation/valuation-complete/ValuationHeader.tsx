
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Save, Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AIConditionBadge } from "../AIConditionBadge";

export interface ValuationHeaderProps {
  valuationData: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage?: number;
    vin?: string;
    estimatedValue?: number;
    condition?: string;
  };
  photoSubmitted: boolean;
  photoScore: number | null;
  aiCondition: any | null;
  estimatedValue?: number;
  calculationInProgress: boolean;
  onShareValuation: () => void;
  onSaveToAccount: () => void;
  isSaving: boolean;
  bestPhotoUrl?: string;
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
  isSaving,
  bestPhotoUrl
}: ValuationHeaderProps) {
  const displayValue = estimatedValue || valuationData.estimatedValue;
  const formatMileage = (mileage?: number) => {
    return mileage ? mileage.toLocaleString() : 'Unknown';
  };

  return (
    <Card className="bg-white overflow-hidden border border-primary/10">
      {bestPhotoUrl && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={bestPhotoUrl} 
            alt="Vehicle" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}
      <CardContent className={`p-6 ${bestPhotoUrl ? '-mt-20 relative z-10' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold mb-1 ${bestPhotoUrl ? 'text-white' : 'text-gray-900'}`}>
              {valuationData.year} {valuationData.make} {valuationData.model}
              {valuationData.trim && ` ${valuationData.trim}`}
            </h2>
            <p className={`text-sm ${bestPhotoUrl ? 'text-white/90' : 'text-gray-500'} mb-3`}>
              {formatMileage(valuationData.mileage)} miles
              {valuationData.vin && ` • VIN: ${valuationData.vin.slice(-6)}`}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {aiCondition && (
                <AIConditionBadge 
                  condition={aiCondition.condition} 
                  confidenceScore={aiCondition.confidenceScore} 
                />
              )}
              <Badge variant="outline" className="bg-white/90">
                {photoSubmitted ? 'Photos Analyzed' : 'No Photos'}
              </Badge>
            </div>
          </div>
          <div className={`text-center ${bestPhotoUrl ? 'bg-white rounded-lg p-3 shadow-sm' : ''}`}>
            <p className="text-sm text-gray-500 font-medium mb-1">Estimated Value</p>
            {calculationInProgress ? (
              <div className="flex items-center justify-center gap-2 h-9">
                <Skeleton className="h-9 w-32" />
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <p className="text-3xl font-bold text-primary">
                {displayValue ? formatCurrency(displayValue) : 'Calculating...'}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={onShareValuation}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5"
            onClick={onSaveToAccount}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save to Account
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
