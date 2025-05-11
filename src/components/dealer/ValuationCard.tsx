
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ConditionBadge } from '@/components/ui/condition-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ValuationWithCondition } from '@/types/dealer';
import { Download, ExternalLink } from 'lucide-react';

interface ValuationCardProps {
  valuation: ValuationWithCondition;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  onDownload: (valuation: ValuationWithCondition) => void;
}

export function ValuationCard({ valuation, aiCondition, onDownload }: ValuationCardProps) {
  return (
    <Card className="bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <h3 className="font-semibold text-base">
              {valuation.year} {valuation.make} {valuation.model}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {aiCondition ? (
                <ConditionBadge 
                  condition={aiCondition.condition as any} 
                  confidenceScore={aiCondition.confidenceScore} 
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {valuation.aiCondition ? valuation.aiCondition.condition : 'Condition unknown'}
                </span>
              )}
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {valuation.mileage?.toLocaleString() || 'Unknown'} miles
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Created {formatDate(valuation.created_at || new Date().toISOString())}
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Valuation</span>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(valuation.estimated_value)}
            </div>
            <div className="text-xs text-muted-foreground">
              {valuation.confidence_score ? `${valuation.confidence_score}% confidence` : ''}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onDownload(valuation)}
            >
              <Download className="h-3.5 w-3.5" />
              <span>PDF</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <a href={`/valuations/${valuation.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View</span>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
