
import { Button } from '@/components/ui/button';
import { Valuation } from '@/types/dealer';
import { ConditionBadge } from '@/components/ui/condition-badge';

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
    <div className="border rounded-lg p-4">
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
        <Button
          variant="outline"
          onClick={() => onDownload(valuation)}
        >
          Download Report
        </Button>
      </div>
    </div>
  );
};
