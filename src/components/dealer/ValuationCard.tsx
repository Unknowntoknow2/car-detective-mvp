
import { Button } from '@/components/ui/button';
import { Valuation } from '@/types/dealer';
import { ConditionBadge } from '@/components/ui/condition-badge';
import { ShieldCheck } from 'lucide-react';

interface ValuationCardProps {
  valuation: Valuation;
  onDownload: (valuation: Valuation) => void;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
  } | null;
}

export const ValuationCard = ({ valuation, onDownload, aiCondition }: ValuationCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">
            {valuation.year} {valuation.make} {valuation.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            Estimated Value: ${valuation.estimated_value?.toLocaleString()}
          </p>
          {valuation.mileage && (
            <p className="text-sm text-muted-foreground">
              Mileage: {valuation.mileage.toLocaleString()}
            </p>
          )}
          
          {/* Display the condition badge if aiCondition data exists */}
          {aiCondition && (
            <div className="mt-2">
              <ConditionBadge 
                condition={aiCondition.condition} 
                confidenceScore={aiCondition.confidenceScore} 
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          {aiCondition?.confidenceScore >= 85 && (
            <div className="flex items-center text-xs text-green-600 gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <ShieldCheck className="w-3 h-3" />
              <span>High Trust</span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => onDownload(valuation)}
          >
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
};
