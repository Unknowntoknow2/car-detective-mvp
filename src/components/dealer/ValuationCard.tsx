
import { Button } from '@/components/ui/button';
import { Valuation } from '@/types/dealer';

interface ValuationCardProps {
  valuation: Valuation;
  onDownload: (valuation: Valuation) => void;
}

export const ValuationCard = ({ valuation, onDownload }: ValuationCardProps) => {
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
