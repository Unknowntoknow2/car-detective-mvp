
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface ValueEstimateCardProps {
  estimatedValue: number;
  confidenceScore?: number;
  onDownloadReport?: () => void;
  isPremiumPurchased?: boolean;
}

export function ValueEstimateCard({ 
  estimatedValue, 
  confidenceScore = 0,
  onDownloadReport,
  isPremiumPurchased = false 
}: ValueEstimateCardProps) {
  return (
    <Card className="p-6 sticky top-4">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Estimated Value</p>
          <p className="text-3xl font-bold font-display">${estimatedValue.toLocaleString()}</p>
          {confidenceScore > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              {confidenceScore}% Confidence Score
            </p>
          )}
        </div>

        {isPremiumPurchased && onDownloadReport && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onDownloadReport}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        )}
      </div>
    </Card>
  );
}
